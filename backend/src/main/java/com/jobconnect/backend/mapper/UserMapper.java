package com.jobconnect.backend.mapper;

import com.jobconnect.backend.dto.AuthResponse;
import com.jobconnect.backend.entity.User;

public class UserMapper {
    public static AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .token(token)
                .build();
    }
}
