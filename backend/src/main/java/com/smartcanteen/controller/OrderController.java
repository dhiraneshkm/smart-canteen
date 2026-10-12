package com.smartcanteen.controller;

import com.smartcanteen.dto.common.ApiResponse;
import com.smartcanteen.dto.order.CancelOrderRequest;
import com.smartcanteen.dto.order.CreateOrderRequest;
import com.smartcanteen.dto.order.OrderDto;
import com.smartcanteen.entity.User;
import com.smartcanteen.service.AuthService;
import com.smartcanteen.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    private User getCurrentUser(Authentication auth) {
        return authService.getCurrentUserEntity(auth.getName());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            Authentication auth,
            @Valid @RequestBody CreateOrderRequest request) {
        User user = getCurrentUser(auth);
        OrderDto order = orderService.createPreOrder(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Order placed successfully", order));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(Authentication auth) {
        User user = getCurrentUser(auth);
        List<OrderDto> orders = orderService.getStudentOrders(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderDto>> cancelOrder(
            Authentication auth,
            @PathVariable Long id,
            @RequestBody(required = false) CancelOrderRequest request) {
        User user = getCurrentUser(auth);
        String reason = (request != null) ? request.getReason() : "Cancelled by student";
        OrderDto order = orderService.cancelOrder(id, user.getId(), reason);
        return ResponseEntity.ok(ApiResponse.ok("Order cancelled successfully", order));
    }
}
