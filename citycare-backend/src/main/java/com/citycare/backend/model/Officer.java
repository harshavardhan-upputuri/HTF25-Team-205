package com.citycare.backend.model;

import java.util.HashSet;
import java.util.Set;
import com.citycare.backend.domain.USER_ROLE;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;

    private String password;

    @Enumerated(EnumType.STRING)
    private USER_ROLE role = USER_ROLE.ROLE_OFFICER;

    // Officers can create multiple technicians
    @OneToMany(mappedBy = "createdBy")
    @JsonIgnore
    private Set<Technician> createdTechnicians = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "managed_by_head_id")
    @JsonBackReference
    private Head head;

}
