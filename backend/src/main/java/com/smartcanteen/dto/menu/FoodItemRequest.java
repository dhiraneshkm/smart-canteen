package com.smartcanteen.dto.menu;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class FoodItemRequest {

    @NotBlank(message = "Item name is required")
    private String name;

    private String description;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal price;

    private String imageUrl;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity = 0;

    private Boolean available = true;

    @NotNull(message = "Preparation time is required")
    @Min(value = 1, message = "Preparation time must be at least 1 minute")
    private Integer preparationTimeMinutes = 10;

    private Boolean vegetarian = true;

    public FoodItemRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public Integer getPreparationTimeMinutes() {
        return preparationTimeMinutes;
    }

    public void setPreparationTimeMinutes(Integer preparationTimeMinutes) {
        this.preparationTimeMinutes = preparationTimeMinutes;
    }

    public Boolean getVegetarian() {
        return vegetarian;
    }

    public void setVegetarian(Boolean vegetarian) {
        this.vegetarian = vegetarian;
    }
}
