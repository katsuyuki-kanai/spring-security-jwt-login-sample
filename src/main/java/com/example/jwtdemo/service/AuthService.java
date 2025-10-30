package com.example.jwtdemo.service;

import com.example.jwtdemo.dto.LoginRequest;
import com.example.jwtdemo.dto.LoginResponse;
import com.example.jwtdemo.entity.RefreshToken;
import com.example.jwtdemo.entity.User;
import com.example.jwtdemo.repository.UserRepository;
import com.example.jwtdemo.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private RefreshTokenService refreshTokenService;
    
    @Autowired
    private UserRepository userRepository;
    
    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        
        String accessToken = tokenProvider.generateAccessToken(authentication);
        
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
        
        return new LoginResponse(accessToken, user.getUsername(), user.getRole());
    }
}
