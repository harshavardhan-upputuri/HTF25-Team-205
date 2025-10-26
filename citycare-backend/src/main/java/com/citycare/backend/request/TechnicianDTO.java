package com.citycare.backend.request;


import java.util.Set;

public class TechnicianDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Set<String> skills;

    public TechnicianDTO(Long id, String name, String email, String phone, Set<String> skills) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.skills = skills;
    }

    // getters & setters
}
