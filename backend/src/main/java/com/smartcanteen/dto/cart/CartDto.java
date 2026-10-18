package com.smartcanteen.dto.cart;

import com.smartcanteen.entity.Cart;
import com.smartcanteen.entity.CartItem;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CartDto {
    private Long id;
    private Long userId;
    private List<CartItemDto> items = new ArrayList<>();
    private BigDecimal totalAmount = BigDecimal.ZERO;
    private Integer totalItemsCount = 0;

    public CartDto() {
    }

    public static CartDto fromEntity(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        if (cart.getUser() != null) {
            dto.setUserId(cart.getUser().getId());
        }
        if (cart.getItems() != null) {
            dto.setItems(cart.getItems().stream().map(CartItemDto::fromEntity).collect(Collectors.toList()));
            dto.setTotalAmount(cart.calculateTotal());
            dto.setTotalItemsCount(cart.getItems().stream().mapToInt(CartItem::getQuantity).sum());
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getTotalItemsCount() {
        return totalItemsCount;
    }

    public void setTotalItemsCount(Integer totalItemsCount) {
        this.totalItemsCount = totalItemsCount;
    }
}
