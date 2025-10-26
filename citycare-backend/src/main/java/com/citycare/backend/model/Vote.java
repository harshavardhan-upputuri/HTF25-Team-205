package com.citycare.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean upvote = true; // true = upvote, false = downvote

    @Column(length = 500)
    private String comment; 

    @ManyToOne
    @JoinColumn(name = "citizen_id")
    @JsonBackReference
    private Citizen citizen;

    @ManyToOne
    @JoinColumn(name = "issue_id")
    @JsonBackReference
    private Issue issue;

}
