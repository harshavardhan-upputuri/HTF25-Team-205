package com.citycare.backend.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.citycare.backend.domain.USER_ROLE;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "citizens")
@Getter // <-- Add this
@Setter // <-- Add this
@NoArgsConstructor
@AllArgsConstructor
// @EqualsAndHashCode
public class Citizen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String phone;

    @Enumerated(EnumType.STRING)
    private USER_ROLE role = USER_ROLE.ROLE_CITIZEN;

    private LocalDateTime registeredAt;
    private Boolean isActive = true;

    @OneToMany(mappedBy = "citizen", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Address> addresses = new HashSet<>();

    // @OneToMany(mappedBy = "citizen", cascade = CascadeType.ALL)
    // @JsonManagedReference
    // private List<Issue> reportedIssues;

    @OneToMany(mappedBy = "citizen", fetch = FetchType.EAGER)
    @JsonIgnore
   private List<Issue> reportedIssues;

    @OneToMany(mappedBy = "citizen", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Vote> votes;

}
