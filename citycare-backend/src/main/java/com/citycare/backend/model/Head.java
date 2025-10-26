package com.citycare.backend.model;

import java.util.HashSet;
import java.util.Set;
import com.citycare.backend.domain.USER_ROLE;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "managedOfficers")
public class Head {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String password;

    @Enumerated(EnumType.STRING)
    private USER_ROLE role = USER_ROLE.ROLE_HEAD;

    // Head can manage multiple officers
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "managed_by_head_id")
    @JsonManagedReference
    private Set<Officer> managedOfficers = new HashSet<>();
}
