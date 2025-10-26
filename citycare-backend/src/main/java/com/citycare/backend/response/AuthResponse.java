package com.citycare.backend.response;

import com.citycare.backend.domain.USER_ROLE;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String jwt;
    private String message;
    private USER_ROLE role;
}
