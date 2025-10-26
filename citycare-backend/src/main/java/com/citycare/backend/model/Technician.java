package com.citycare.backend.model;

import java.util.HashSet;
import java.util.Set;

import com.citycare.backend.domain.IssueType;
import com.citycare.backend.domain.USER_ROLE;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String password;

    @Enumerated(EnumType.STRING)
    private USER_ROLE role = USER_ROLE.ROLE_TECHNICIAN;

    @Enumerated(EnumType.STRING)
    @ElementCollection(targetClass = IssueType.class)
    @CollectionTable(name = "technician_skills", joinColumns = @JoinColumn(name = "technician_id"))
    @Column(name = "issue_type")
    private Set<IssueType> skills;

    @ManyToMany(mappedBy = "assignedTechnicians")
    @JsonBackReference
    private Set<Issue> issuesAssigned = new HashSet<>();

    @OneToMany(mappedBy = "technician", cascade = CascadeType.ALL)
    private Set<Address> addresses = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "created_by_officer_id")
    @JsonBackReference
    private Officer createdBy;
}
