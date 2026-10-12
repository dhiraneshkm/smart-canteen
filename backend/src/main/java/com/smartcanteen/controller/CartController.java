package com.smartcanteen.controller;

import com.smartcanteen.dto.cart.AddToCartRequest;
import com.smartcanteen.dto.cart.CartDto;
import com.smartcanteen.dto.cart.UpdateCartItemRequest;
import com.smartcanteen.dto.common.ApiResponse;
import com.smartcanteen.entity.User;
import com.smartcanteen.service.AuthService;
import com.smartcanteen.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    public CartController(CartService cartService, AuthService authService) {
        this.cartService = cartService;
        this.authService = authService;
    }

    private Long getUserId(Authentication auth) {
        User user = authService.getCurrentUserEntity(auth.getName());
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(Authentication auth) {
        CartDto cart = cartService.getCart(getUserId(auth));
        return ResponseEntity.ok(ApiResponse.ok(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            Authentication auth,
            @Valid @RequestBody AddToCartRequest request) {
        CartDto cart = cartService.addToCart(getUserId(auth), request);
        return ResponseEntity.ok(ApiResponse.ok("Item added to cart", cart));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartDto cart = cartService.updateCartItem(getUserId(auth), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cart updated", cart));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<ApiResponse<CartDto>> removeCartItem(
            Authentication auth,
            @PathVariable Long id) {
        CartDto cart = cartService.removeCartItem(getUserId(auth), id);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart", cart));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> clearCart(Authentication auth) {
        cartService.clearCart(getUserId(auth));
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared", null));
    }
}
