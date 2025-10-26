package com.citycare.backend.request;

import com.citycare.backend.domain.USER_ROLE;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginOtpRequest {
    private String email;
    private USER_ROLE role;  // to specify which role this login is for
}
