package com.smartcanteen.controller;

import com.smartcanteen.dto.common.ApiResponse;
import com.smartcanteen.dto.payment.CreatePaymentRequest;
import com.smartcanteen.dto.payment.PaymentDto;
import com.smartcanteen.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PaymentDto>> processPayment(@Valid @RequestBody CreatePaymentRequest request) {
        PaymentDto payment = paymentService.processPayment(request);
        return ResponseEntity.ok(ApiResponse.ok("Payment processed successfully (Simulated)", payment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentDto>> getPaymentById(@PathVariable Long id) {
        PaymentDto payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.ok(payment));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<PaymentDto>> getPaymentByOrderId(@PathVariable Long orderId) {
        PaymentDto payment = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.ok(payment));
    }

    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse<String>> paymentWebhook(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(ApiResponse.ok("Webhook acknowledged", null));
    }
}
