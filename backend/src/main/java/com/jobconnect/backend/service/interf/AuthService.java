package com.jobconnect.backend.service.interf;

import com.jobconnect.backend.dto.AuthResponse;
import com.jobconnect.backend.dto.LoginRequest;
import com.jobconnect.backend.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}