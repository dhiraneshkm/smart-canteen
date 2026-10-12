package com.smartcanteen.dto.order;

import com.smartcanteen.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class OrderStatusUpdateRequest {

    @NotNull(message = "Order status is required")
    private OrderStatus status;

    private String note;

    public OrderStatusUpdateRequest() {
    }

    public OrderStatusUpdateRequest(OrderStatus status, String note) {
        this.status = status;
        this.note = note;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
