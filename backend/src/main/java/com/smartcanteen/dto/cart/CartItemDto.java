package com.smartcanteen.dto.cart;

import com.smartcanteen.entity.CartItem;

import java.math.BigDecimal;

public class CartItemDto {
    private Long id;
    private Long foodItemId;
    private String foodItemName;
    private String imageUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
    private Integer preparationTimeMinutes;

    public CartItemDto() {
    }

    public static CartItemDto fromEntity(CartItem item) {
        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        if (item.getFoodItem() != null) {
            dto.setFoodItemId(item.getFoodItem().getId());
            dto.setFoodItemName(item.getFoodItem().getName());
            dto.setImageUrl(item.getFoodItem().getImageUrl());
            dto.setPreparationTimeMinutes(item.getFoodItem().getPreparationTimeMinutes());
        }
        dto.setUnitPrice(item.getUnitPrice());
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

    public String getFoodItemName() {
        return foodItemName;
    }

    public void setFoodItemName(String foodItemName) {
        this.foodItemName = foodItemName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
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

    public Integer getPreparationTimeMinutes() {
        return preparationTimeMinutes;
    }

    public void setPreparationTimeMinutes(Integer preparationTimeMinutes) {
        this.preparationTimeMinutes = preparationTimeMinutes;
    }
}
