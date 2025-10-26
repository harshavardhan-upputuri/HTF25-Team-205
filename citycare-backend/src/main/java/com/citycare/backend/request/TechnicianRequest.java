package com.citycare.backend.request;

import java.util.Set;
import com.citycare.backend.domain.IssueType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TechnicianRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private Set<IssueType> skills;
}
