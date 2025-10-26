package com.citycare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.citycare.backend.model.VerificationCode;


@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode,Long>{
    VerificationCode findByEmail(String email);
    VerificationCode findByOtp(String otp);
}

