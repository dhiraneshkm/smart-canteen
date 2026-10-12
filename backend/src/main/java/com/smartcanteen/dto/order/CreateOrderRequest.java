package com.smartcanteen.dto.order;

import com.smartcanteen.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public class CreateOrderRequest {

    @NotNull(message = "Pickup slot is required")
    private Long pickupSlotId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod = PaymentMethod.MOCK_ONLINE_UPI;

    private String specialInstructions;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(Long pickupSlotId, PaymentMethod paymentMethod, String specialInstructions) {
        this.pickupSlotId = pickupSlotId;
        this.paymentMethod = paymentMethod;
        this.specialInstructions = specialInstructions;
    }

    public Long getPickupSlotId() {
        return pickupSlotId;
    }

    public void setPickupSlotId(Long pickupSlotId) {
        this.pickupSlotId = pickupSlotId;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }
}
