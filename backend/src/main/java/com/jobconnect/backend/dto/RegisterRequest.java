package com.jobconnect.backend.dto;

import com.jobconnect.backend.enums.UserRole;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String phone;
    private UserRole role;
    private String companyName;
    private String companyWebsite;
}
