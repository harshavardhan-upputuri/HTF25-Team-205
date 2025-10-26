package com.citycare.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.citycare.backend.model.Technician;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    Technician findByEmail(String email);
        List<Technician> findByCreatedBy_Id(Long officerId);

}
