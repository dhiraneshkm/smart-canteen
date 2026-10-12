package com.smartcanteen.dto.payment;

import com.smartcanteen.entity.Payment;
import com.smartcanteen.entity.PaymentMethod;
import com.smartcanteen.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {
    private Long id;
    private String paymentReference;
    private Long orderId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionId;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;

    public PaymentDto() {
    }

    public static PaymentDto fromEntity(Payment payment) {
        PaymentDto dto = new PaymentDto();
        dto.setId(payment.getId());
        dto.setPaymentReference(payment.getPaymentReference());
        if (payment.getOrder() != null) {
            dto.setOrderId(payment.getOrder().getId());
        }
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setStatus(payment.getStatus());
        dto.setTransactionId(payment.getTransactionId());
        dto.setPaidAt(payment.getPaidAt());
        dto.setCreatedAt(payment.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
