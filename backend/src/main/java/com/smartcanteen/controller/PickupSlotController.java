package com.smartcanteen.controller;

import com.smartcanteen.dto.common.ApiResponse;
import com.smartcanteen.dto.slot.PickupSlotDto;
import com.smartcanteen.service.PickupSlotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pickup-slots")
public class PickupSlotController {

    private final PickupSlotService pickupSlotService;

    public PickupSlotController(PickupSlotService pickupSlotService) {
        this.pickupSlotService = pickupSlotService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PickupSlotDto>>> getAvailableSlots() {
        List<PickupSlotDto> slots = pickupSlotService.getActivePickupSlots();
        return ResponseEntity.ok(ApiResponse.ok(slots));
    }
}
