package com.jobconnect.backend.dto;

import com.jobconnect.backend.enums.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private Long id;
    private String username;
    private String token;
    private UserRole role;
}
