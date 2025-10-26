package com.citycare.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// @EqualsAndHashCode
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Home, Office, etc.
    private String locality;
    private String streetAddress;
    private String city;
    private String state;
    private String pinCode;
    private String mobile;

    private Double latitude;
    private Double longitude;

    // @ManyToOne
    // @JoinColumn(name = "citizen_id")
    // @JsonIgnore
    // private Citizen citizen;

    @ManyToOne
    @JoinColumn(name = "technician_id")
    @JsonIgnore
    private Technician technician;

    // @OneToOne(mappedBy = "address")
    // @JsonIgnore
    // private Issue issue;

    @ManyToOne
    @JoinColumn(name = "citizen_id")
    @JsonBackReference
    private Citizen citizen;

    @OneToOne(mappedBy = "address")
    @JsonBackReference
    private Issue issue;

}
