package com.example.jwtdemo.service;

import com.example.jwtdemo.dto.LoginRequest;
import com.example.jwtdemo.dto.LoginResponse;
import com.example.jwtdemo.entity.RefreshToken;
import com.example.jwtdemo.entity.User;
import com.example.jwtdemo.repository.UserRepository;
import com.example.jwtdemo.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");

        String accessToken = jwtTokenProvider.generateAccessToken(username, role);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new LoginResponse(accessToken, "Bearer", username, role, refreshToken.getToken());
    }

    public LoginResponse refreshToken(String refreshTokenString) {
        return refreshTokenService.findByToken(refreshTokenString)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUserId)
                .map(userId -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    String accessToken = jwtTokenProvider.generateAccessToken(user.getUsername(), user.getRole());
                    return new LoginResponse(accessToken, "Bearer", user.getUsername(), user.getRole(), refreshTokenString);
                })
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));
    }

    public void logout(Long userId) {
        refreshTokenService.deleteByUserId(userId);
    }
}
