package com.citycare.backend.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.citycare.backend.domain.IssueStatus;
import com.citycare.backend.domain.IssueType;
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
// @EqualsAndHashCode
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    private IssueType issueType;

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<IssueAttachment> attachments = new HashSet<>();

    private LocalDateTime reportedAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;

    @Enumerated(EnumType.STRING)
    private IssueStatus status = IssueStatus.PENDING;

    // @ManyToOne
    // @JsonBackReference
    // private Citizen citizen;

    // @ManyToMany
    // @JoinTable(name = "issue_technicians", joinColumns = @JoinColumn(name =
    // "issue_id"), inverseJoinColumns = @JoinColumn(name = "technician_id"))
    // @JsonManagedReference
    // private Set<Technician> assignedTechnicians = new HashSet<>();

    // @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval =
    // true)
    // @JsonManagedReference
    // private Set<Vote> votes = new HashSet<>();

    // @OneToOne(cascade = CascadeType.ALL)
    // @JoinColumn(name = "address_id")
    // @JsonManagedReference
    // private Address address; // Issue location

    @ManyToOne
    @JsonBackReference
    private Citizen citizen;

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Vote> votes = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    @JsonManagedReference
    private Address address;

    @ManyToMany
    @JoinTable(name = "issue_technicians", joinColumns = @JoinColumn(name = "issue_id"), inverseJoinColumns = @JoinColumn(name = "technician_id"))
    @JsonManagedReference
    private Set<Technician> assignedTechnicians = new HashSet<>();

}
