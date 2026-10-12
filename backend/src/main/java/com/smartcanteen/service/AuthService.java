package com.smartcanteen.service;

import com.smartcanteen.dto.auth.*;
import com.smartcanteen.entity.Role;
import com.smartcanteen.entity.User;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.exception.ResourceNotFoundException;
import com.smartcanteen.repository.UserRepository;
import com.smartcanteen.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Role role = Role.ROLE_STUDENT;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                role = Role.fromString(request.getRole());
            } catch (Exception ignored) {
            }
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhone(),
                role
        );
        user = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(token, UserProfileDto.fromEntity(user));
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(token, UserProfileDto.fromEntity(user));
    }

    public UserProfileDto getCurrentUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return UserProfileDto.fromEntity(user);
    }

    public User getCurrentUserEntity(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    @Transactional
    public UserProfileDto updateProfile(String username, UpdateProfileRequest request) {
        User user = getCurrentUserEntity(username);
        user.setFullName(request.getFullName());
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        user = userRepository.save(user);
        return UserProfileDto.fromEntity(user);
    }
}
