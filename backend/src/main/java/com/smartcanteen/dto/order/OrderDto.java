package com.smartcanteen.dto.order;

import com.smartcanteen.entity.Order;
import com.smartcanteen.entity.OrderStatus;
import com.smartcanteen.entity.PaymentMethod;
import com.smartcanteen.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDto {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String customerName;
    private String customerPhone;
    private Long pickupSlotId;
    private String pickupSlotTime;
    private OrderStatus status;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal totalAmount;
    private String specialInstructions;
    private String cancellationReason;
    private List<OrderItemDto> items = new ArrayList<>();
    private String ticketNumber;
    private Integer queuePosition;
    private Integer estimatedWaitMinutes;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
    private String paymentReference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderDto() {
    }

    public static OrderDto fromEntity(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setCustomerName(order.getUser().getFullName());
            dto.setCustomerPhone(order.getUser().getPhone());
        }
        if (order.getPickupSlot() != null) {
            dto.setPickupSlotId(order.getPickupSlot().getId());
            dto.setPickupSlotTime(order.getPickupSlot().getStartTime() + " - " + order.getPickupSlot().getEndTime());
        }
        dto.setStatus(order.getStatus());
        dto.setSubtotal(order.getSubtotal());
        dto.setTax(order.getTax());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setSpecialInstructions(order.getSpecialInstructions());
        dto.setCancellationReason(order.getCancellationReason());
        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(OrderItemDto::fromEntity).collect(Collectors.toList()));
        }
        if (order.getQueueTicket() != null) {
            dto.setTicketNumber(order.getQueueTicket().getTicketNumber());
            dto.setQueuePosition(order.getQueueTicket().getQueuePosition());
            dto.setEstimatedWaitMinutes(order.getQueueTicket().getEstimatedWaitMinutes());
        }
        if (order.getPayment() != null) {
            dto.setPaymentStatus(order.getPayment().getStatus());
            dto.setPaymentMethod(order.getPayment().getPaymentMethod());
            dto.setPaymentReference(order.getPayment().getPaymentReference());
        }
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public Long getPickupSlotId() {
        return pickupSlotId;
    }

    public void setPickupSlotId(Long pickupSlotId) {
        this.pickupSlotId = pickupSlotId;
    }

    public String getPickupSlotTime() {
        return pickupSlotTime;
    }

    public void setPickupSlotTime(String pickupSlotTime) {
        this.pickupSlotTime = pickupSlotTime;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public Integer getQueuePosition() {
        return queuePosition;
    }

    public void setQueuePosition(Integer queuePosition) {
        this.queuePosition = queuePosition;
    }

    public Integer getEstimatedWaitMinutes() {
        return estimatedWaitMinutes;
    }

    public void setEstimatedWaitMinutes(Integer estimatedWaitMinutes) {
        this.estimatedWaitMinutes = estimatedWaitMinutes;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
