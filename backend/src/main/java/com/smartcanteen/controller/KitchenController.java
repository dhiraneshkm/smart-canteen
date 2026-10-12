package com.smartcanteen.controller;

import com.smartcanteen.dto.common.ApiResponse;
import com.smartcanteen.dto.order.OrderDto;
import com.smartcanteen.dto.order.OrderStatusUpdateRequest;
import com.smartcanteen.service.KitchenService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen")
@PreAuthorize("hasAnyRole('KITCHEN_STAFF', 'ADMIN')")
public class KitchenController {

    private final KitchenService kitchenService;

    public KitchenController(KitchenService kitchenService) {
        this.kitchenService = kitchenService;
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getKitchenOrders() {
        List<OrderDto> orders = kitchenService.getActiveKitchenOrders();
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderDto updated = kitchenService.updatePreparationStatus(id, request.getStatus(), request.getNote());
        return ResponseEntity.ok(ApiResponse.ok("Order status updated to " + request.getStatus(), updated));
    }
}
