package com.smartcanteen.service;

import com.smartcanteen.dto.payment.CreatePaymentRequest;
import com.smartcanteen.dto.payment.PaymentDto;
import com.smartcanteen.entity.Order;
import com.smartcanteen.entity.Payment;
import com.smartcanteen.entity.PaymentMethod;
import com.smartcanteen.entity.PaymentStatus;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.repository.OrderRepository;
import com.smartcanteen.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Payment createInitialPayment(Order order, PaymentMethod method) {
        String ref = "PAY-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        PaymentStatus initialStatus = (method == PaymentMethod.CASH_ON_PICKUP) ? PaymentStatus.PENDING : PaymentStatus.PAID;

        Payment payment = new Payment(ref, order, order.getTotalAmount(), method, initialStatus);
        if (initialStatus == PaymentStatus.PAID) {
            payment.setTransactionId("SIM-TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            payment.setPaidAt(LocalDateTime.now());
        }
        return paymentRepository.save(payment);
    }

    @Transactional
    public PaymentDto processPayment(CreatePaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for order id: " + order.getId()));

        if (payment.getStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Order is already paid.");
        }

        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.PAID);
        payment.setTransactionId("SIM-TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setPaidAt(LocalDateTime.now());

        payment = paymentRepository.save(payment);
        return PaymentDto.fromEntity(payment);
    }

    public PaymentDto getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return PaymentDto.fromEntity(payment);
    }

    public PaymentDto getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order id: " + orderId));
        return PaymentDto.fromEntity(payment);
    }
}
