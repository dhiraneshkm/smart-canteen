package com.smartcanteen.dto.order;

import com.smartcanteen.entity.OrderItem;

import java.math.BigDecimal;

public class OrderItemDto {
    private Long id;
    private Long foodItemId;
    private String itemName;
    private BigDecimal itemPrice;
    private Integer quantity;
    private BigDecimal subtotal;

    public OrderItemDto() {
    }

    public static OrderItemDto fromEntity(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(item.getId());
        if (item.getFoodItem() != null) {
            dto.setFoodItemId(item.getFoodItem().getId());
        }
        dto.setItemName(item.getItemName());
        dto.setItemPrice(item.getItemPrice());
        dto.setQuantity(item.getQuantity());
        dto.setSubtotal(item.getSubtotal());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFoodItemId() {
        return foodItemId;
    }

    public void setFoodItemId(Long foodItemId) {
        this.foodItemId = foodItemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public BigDecimal getItemPrice() {
        return itemPrice;
    }

    public void setItemPrice(BigDecimal itemPrice) {
        this.itemPrice = itemPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
