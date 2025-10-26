package com.citycare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.citycare.backend.model.Citizen;

@Repository
public interface CitizenRepository extends JpaRepository<Citizen, Long> {
    Citizen findByEmail(String email);
}
