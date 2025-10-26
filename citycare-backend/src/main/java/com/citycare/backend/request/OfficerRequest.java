package com.citycare.backend.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfficerRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
}
