package com.citycare.backend.request;

 

import com.citycare.backend.model.Address;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CitizenUpdateDto {
    private String name;
    private String email;
    private String phone;
    private Set<Address> addresses; // optional
}

