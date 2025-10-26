package com.citycare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.citycare.backend.model.Head;

@Repository
public interface HeadRepository extends JpaRepository<Head, Long> {
    Head findByEmail(String email);
}
