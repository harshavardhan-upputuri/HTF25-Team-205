package com.citycare.backend.request;

import com.citycare.backend.domain.USER_ROLE;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String email;
    private String password;  // optional if using OTP
    private String otp;       // optional if using password
    private USER_ROLE role;   // optional, helps identify role if needed
}
