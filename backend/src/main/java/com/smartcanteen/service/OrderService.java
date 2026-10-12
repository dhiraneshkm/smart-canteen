package com.smartcanteen.service;

import com.smartcanteen.dto.order.CreateOrderRequest;
import com.smartcanteen.dto.order.OrderDto;
import com.smartcanteen.entity.*;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.repository.CartRepository;
import com.smartcanteen.repository.OrderRepository;
import com.smartcanteen.repository.UserRepository;
import com.smartcanteen.websocket.WebSocketNotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final MenuService menuService;
    private final PickupSlotService pickupSlotService;
    private final QueueService queueService;
    private final PaymentService paymentService;
    private final NotificationService notificationService;
    private final WebSocketNotificationService webSocketNotificationService;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        UserRepository userRepository,
                        MenuService menuService,
                        PickupSlotService pickupSlotService,
                        QueueService queueService,
                        PaymentService paymentService,
                        NotificationService notificationService,
                        WebSocketNotificationService webSocketNotificationService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.menuService = menuService;
        this.pickupSlotService = pickupSlotService;
        this.queueService = queueService;
        this.paymentService = paymentService;
        this.notificationService = notificationService;
        this.webSocketNotificationService = webSocketNotificationService;
    }

    @Transactional
    public OrderDto createPreOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty. Please add items to cart before placing an order."));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty. Please add items before checking out.");
        }

        // 1. Reserve pickup slot atomically
        PickupSlot slot = pickupSlotService.getSlotEntity(request.getPickupSlotId());
        pickupSlotService.reserveSlot(slot.getId());

        // 2. Reserve stock for all items atomically
        for (CartItem ci : cart.getItems()) {
            menuService.deductStock(ci.getFoodItem().getId(), ci.getQuantity());
        }

        // 3. Create unique order number
        String datePart = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String orderNumber = "ORD-" + datePart + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setPickupSlot(slot);
        order.setStatus(OrderStatus.PLACED);
        order.setSpecialInstructions(request.getSpecialInstructions());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem ci : cart.getItems()) {
            OrderItem orderItem = new OrderItem(
                    order,
                    ci.getFoodItem(),
                    ci.getFoodItem().getName(),
                    ci.getFoodItem().getPrice(),
                    ci.getQuantity()
            );
            order.addItem(orderItem);
            subtotal = subtotal.add(orderItem.getSubtotal());
        }

        // Standard 5% GST tax calculation
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.05")).setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(tax);

        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setTotalAmount(totalAmount);

        order = orderRepository.save(order);

        // 4. Generate Queue Ticket with dynamic wait time estimation
        QueueTicket ticket = queueService.generateTicketForOrder(order);
        order.setQueueTicket(ticket);

        // 5. Generate Payment
        Payment payment = paymentService.createInitialPayment(order, request.getPaymentMethod());
        order.setPayment(payment);

        order = orderRepository.save(order);

        // 6. Clear user cart
        cart.getItems().clear();
        cartRepository.save(cart);

        OrderDto orderDto = OrderDto.fromEntity(order);

        // 7. Real-time WebSocket broadcasts
        webSocketNotificationService.sendOrderUpdate(orderDto);
        queueService.recalculateQueuePositions();

        // 8. User notification
        notificationService.sendNotification(
                user,
                "Pre-Order Placed Successfully",
                "Your order " + order.getOrderNumber() + " (Ticket: " + ticket.getTicketNumber() + ") has been placed.",
                NotificationType.ORDER_STATUS
        );

        return orderDto;
    }

    public List<OrderDto> getStudentOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return OrderDto.fromEntity(order);
    }

    public Order getOrderEntity(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    @Transactional
    public OrderDto cancelOrder(Long orderId, Long userId, String reason) {
        Order order = getOrderEntity(orderId);

        // Ensure student can only cancel their own order unless admin
        if (userId != null && !order.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own orders.");
        }

        if (order.getStatus() != OrderStatus.PLACED && order.getStatus() != OrderStatus.ACCEPTED) {
            throw new BadRequestException("Order cannot be cancelled in status: " + order.getStatus() + ". It is already being prepared or completed.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(reason != null ? reason : "Cancelled by student");

        // Release slot capacity
        if (order.getPickupSlot() != null) {
            pickupSlotService.releaseSlot(order.getPickupSlot().getId());
        }

        // Restore inventory stock
        for (OrderItem item : order.getItems()) {
            menuService.restoreStock(item.getFoodItem().getId(), item.getQuantity());
        }

        // Update queue ticket
        queueService.updateTicketStatus(order, OrderStatus.CANCELLED);

        order = orderRepository.save(order);
        OrderDto orderDto = OrderDto.fromEntity(order);

        webSocketNotificationService.sendOrderUpdate(orderDto);

        notificationService.sendNotification(
                order.getUser(),
                "Order Cancelled",
                "Your order " + order.getOrderNumber() + " has been cancelled.",
                NotificationType.ORDER_STATUS
        );

        return orderDto;
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus, String note) {
        Order order = getOrderEntity(orderId);
        order.setStatus(newStatus);

        if (newStatus == OrderStatus.CANCELLED || newStatus == OrderStatus.REJECTED) {
            if (order.getPickupSlot() != null) {
                pickupSlotService.releaseSlot(order.getPickupSlot().getId());
            }
            for (OrderItem item : order.getItems()) {
                menuService.restoreStock(item.getFoodItem().getId(), item.getQuantity());
            }
        }

        queueService.updateTicketStatus(order, newStatus);
        order = orderRepository.save(order);

        OrderDto orderDto = OrderDto.fromEntity(order);
        webSocketNotificationService.sendOrderUpdate(orderDto);

        String message = switch (newStatus) {
            case ACCEPTED -> "Your order " + order.getOrderNumber() + " has been accepted by the kitchen.";
            case PREPARING -> "Your meal is now being prepared! Ticket: " + (order.getQueueTicket() != null ? order.getQueueTicket().getTicketNumber() : "");
            case READY -> "Your order is ready for pickup at Counter! Show Ticket: " + (order.getQueueTicket() != null ? order.getQueueTicket().getTicketNumber() : "");
            case COLLECTED -> "Order collected! Thank you for dining with us.";
            case REJECTED -> "Your order was rejected: " + (note != null ? note : "Kitchen unable to process.");
            case CANCELLED -> "Your order was cancelled.";
            default -> "Status updated to " + newStatus;
        };

        notificationService.sendNotification(
                order.getUser(),
                "Order Update: " + newStatus,
                message,
                NotificationType.ORDER_STATUS
        );

        return orderDto;
    }

    public List<OrderDto> getAllOrdersAdmin() {
        return orderRepository.findAll().stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }
}
