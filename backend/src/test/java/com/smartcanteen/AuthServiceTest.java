package com.smartcanteen;

import com.smartcanteen.dto.auth.AuthResponse;
import com.smartcanteen.dto.auth.LoginRequest;
import com.smartcanteen.dto.auth.RegisterRequest;
import com.smartcanteen.entity.Role;
import com.smartcanteen.entity.User;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.repository.UserRepository;
import com.smartcanteen.security.JwtTokenProvider;
import com.smartcanteen.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("testuser", "test@example.com", "encodedPass", "Test User", "1234567890", Role.ROLE_STUDENT);
        sampleUser.setId(1L);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest req = new RegisterRequest("testuser", "test@example.com", "Password@123", "Test User", "1234567890", "STUDENT");

        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        AuthResponse res = authService.register(req);

        assertNotNull(res);
        assertEquals("mock.jwt.token", res.getToken());
        assertEquals("testuser", res.getUser().getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateUsernameThrowsException() {
        RegisterRequest req = new RegisterRequest("existinguser", "new@example.com", "Password@123", "User", null, null);
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginSuccess() {
        LoginRequest req = new LoginRequest("testuser", "Password@123");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(sampleUser));

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("mock.jwt.token", res.getToken());
        assertEquals(1L, res.getUser().getId());
    }
}
