package com.citycare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.citycare.backend.model.Officer;

@Repository
public interface OfficerRepository extends JpaRepository<Officer, Long> {
    Officer findByEmail(String email);
}
