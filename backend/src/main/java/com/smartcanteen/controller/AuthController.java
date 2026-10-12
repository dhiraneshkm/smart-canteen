package com.smartcanteen.controller;

import com.smartcanteen.dto.auth.*;
import com.smartcanteen.dto.common.ApiResponse;
import com.smartcanteen.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserProfileDto profile = authService.getCurrentUserProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileDto updated = authService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", null));
    }
}
