package com.citycare.backend.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String otp;   // OTP sent to email
}
