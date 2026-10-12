package com.smartcanteen.service;

import com.smartcanteen.dto.cart.AddToCartRequest;
import com.smartcanteen.dto.cart.CartDto;
import com.smartcanteen.dto.cart.UpdateCartItemRequest;
import com.smartcanteen.entity.Cart;
import com.smartcanteen.entity.CartItem;
import com.smartcanteen.entity.FoodItem;
import com.smartcanteen.entity.User;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.exception.InsufficientStockException;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.repository.CartItemRepository;
import com.smartcanteen.repository.CartRepository;
import com.smartcanteen.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final MenuService menuService;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       UserRepository userRepository,
                       MenuService menuService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.menuService = menuService;
    }

    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            Cart newCart = new Cart(user);
            return cartRepository.save(newCart);
        });
    }

    @Transactional(readOnly = true)
    public CartDto getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return CartDto.fromEntity(cart);
    }

    @Transactional
    public CartDto addToCart(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);
        FoodItem foodItem = menuService.getFoodItemEntity(request.getFoodItemId());

        if (!foodItem.isAvailable()) {
            throw new BadRequestException("Item '" + foodItem.getName() + "' is currently unavailable.");
        }
        if (foodItem.getStockQuantity() < request.getQuantity()) {
            throw new InsufficientStockException("Only " + foodItem.getStockQuantity() + " units available for '" + foodItem.getName() + "'.");
        }

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getFoodItem().getId().equals(foodItem.getId()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existing = existingItemOpt.get();
            int newQuantity = existing.getQuantity() + request.getQuantity();
            if (foodItem.getStockQuantity() < newQuantity) {
                throw new InsufficientStockException("Cannot add more: only " + foodItem.getStockQuantity() + " units in stock.");
            }
            existing.setQuantity(newQuantity);
            existing.setUnitPrice(foodItem.getPrice());
        } else {
            CartItem newItem = new CartItem(cart, foodItem, request.getQuantity(), foodItem.getPrice());
            cart.getItems().add(newItem);
        }

        cart = cartRepository.save(cart);
        return CartDto.fromEntity(cart);
    }

    @Transactional
    public CartDto updateCartItem(Long userId, Long cartItemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to user cart");
        }

        FoodItem foodItem = cartItem.getFoodItem();
        if (foodItem.getStockQuantity() < request.getQuantity()) {
            throw new InsufficientStockException("Only " + foodItem.getStockQuantity() + " units available in stock.");
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);
        return CartDto.fromEntity(cart);
    }

    @Transactional
    public CartDto removeCartItem(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));
        cart = cartRepository.save(cart);
        return CartDto.fromEntity(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
