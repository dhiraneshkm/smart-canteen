package com.smartcanteen;

import com.smartcanteen.dto.order.CreateOrderRequest;
import com.smartcanteen.dto.order.OrderDto;
import com.smartcanteen.entity.*;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.repository.CartRepository;
import com.smartcanteen.repository.OrderRepository;
import com.smartcanteen.repository.UserRepository;
import com.smartcanteen.service.*;
import com.smartcanteen.websocket.WebSocketNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MenuService menuService;

    @Mock
    private PickupSlotService pickupSlotService;

    @Mock
    private QueueService queueService;

    @Mock
    private PaymentService paymentService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private WebSocketNotificationService webSocketNotificationService;

    @InjectMocks
    private OrderService orderService;

    private User sampleUser;
    private PickupSlot sampleSlot;
    private Cart sampleCart;
    private FoodItem sampleFood;

    @BeforeEach
    void setUp() {
        sampleUser = new User("student", "s@test.com", "pass", "Student One", "9999999999", Role.ROLE_STUDENT);
        sampleUser.setId(1L);

        sampleSlot = new PickupSlot(LocalTime.of(12, 30), LocalTime.of(13, 30), 30);
        sampleSlot.setId(10L);

        sampleFood = new FoodItem();
        sampleFood.setId(20L);
        sampleFood.setName("Samosa");
        sampleFood.setPrice(new BigDecimal("30.00"));
        sampleFood.setStockQuantity(50);
        sampleFood.setAvailable(true);

        sampleCart = new Cart(sampleUser);
        sampleCart.setId(5L);
        CartItem cartItem = new CartItem(sampleCart, sampleFood, 2, new BigDecimal("30.00"));
        sampleCart.getItems().add(cartItem);
    }

    @Test
    void testCreatePreOrderSuccess() {
        CreateOrderRequest req = new CreateOrderRequest(10L, PaymentMethod.MOCK_ONLINE_UPI, "No onions");

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(sampleCart));
        when(pickupSlotService.getSlotEntity(10L)).thenReturn(sampleSlot);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QueueTicket ticket = new QueueTicket("TKT-001", null, 1, 10);
        when(queueService.generateTicketForOrder(any())).thenReturn(ticket);

        Payment payment = new Payment("PAY-001", null, new BigDecimal("63.00"), PaymentMethod.MOCK_ONLINE_UPI, PaymentStatus.PAID);
        when(paymentService.createInitialPayment(any(), eq(PaymentMethod.MOCK_ONLINE_UPI))).thenReturn(payment);

        OrderDto created = orderService.createPreOrder(1L, req);

        assertNotNull(created);
        assertNotNull(created.getOrderNumber());
        assertEquals(OrderStatus.PLACED, created.getStatus());
        assertEquals(new BigDecimal("60.00"), created.getSubtotal());
        assertEquals(new BigDecimal("3.00"), created.getTax());
        assertEquals(new BigDecimal("63.00"), created.getTotalAmount());

        verify(pickupSlotService, times(1)).reserveSlot(10L);
        verify(menuService, times(1)).deductStock(20L, 2);
        assertTrue(sampleCart.getItems().isEmpty(), "User cart should be cleared upon checkout");
    }

    @Test
    void testCreatePreOrderFailsWhenCartIsEmpty() {
        sampleCart.getItems().clear();
        CreateOrderRequest req = new CreateOrderRequest(10L, PaymentMethod.CASH_ON_PICKUP, null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(sampleCart));

        assertThrows(BadRequestException.class, () -> orderService.createPreOrder(1L, req));
        verify(orderRepository, never()).save(any());
    }

    @Test
    void testCancelOrderSuccess() {
        Order order = new Order();
        order.setId(50L);
        order.setUser(sampleUser);
        order.setPickupSlot(sampleSlot);
        order.setStatus(OrderStatus.PLACED);
        order.addItem(new OrderItem(order, sampleFood, "Samosa", new BigDecimal("30"), 2));

        when(orderRepository.findById(50L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        OrderDto cancelled = orderService.cancelOrder(50L, 1L, "Change of plans");

        assertEquals(OrderStatus.CANCELLED, cancelled.getStatus());
        verify(pickupSlotService, times(1)).releaseSlot(10L);
        verify(menuService, times(1)).restoreStock(20L, 2);
        verify(queueService, times(1)).updateTicketStatus(order, OrderStatus.CANCELLED);
    }
}
