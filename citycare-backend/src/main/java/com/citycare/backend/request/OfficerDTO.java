package com.citycare.backend.request;

 

import com.citycare.backend.model.Address;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// DTO class
public class OfficerDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    // no Set<Technician> here!
}


