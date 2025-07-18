package com.jobconnect.backend.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobconnect.backend.dto.AuthResponse;
import com.jobconnect.backend.dto.LoginRequest;
import com.jobconnect.backend.dto.RegisterRequest;
import com.jobconnect.backend.entity.User;
import com.jobconnect.backend.enums.UserRole;
import com.jobconnect.backend.repository.UserRepository;
import com.jobconnect.backend.security.JwtUtil;
import com.jobconnect.backend.service.interf.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .companyName(request.getRole() == UserRole.EMPLOYER ? request.getCompanyName() : null)
                .build();

        userRepository.save(user);

        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                jwtUtil.generateToken(user.getUsername()),
                user.getRole());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                jwtUtil.generateToken(user.getUsername()),
                user.getRole());
    }
}