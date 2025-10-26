package com.citycare.backend.service;

import java.util.HashSet;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.citycare.backend.domain.USER_ROLE;
import com.citycare.backend.model.Officer;
import com.citycare.backend.model.Technician;
import com.citycare.backend.repository.OfficerRepository;
import com.citycare.backend.repository.TechnicianRepository;
import com.citycare.backend.request.TechnicianRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TechnicianService {

    private final TechnicianRepository technicianRepo;
    private final OfficerRepository officerRepo;
    private final PasswordEncoder passwordEncoder;

    

    // ---------------- GET TECHNICIAN BY ID ----------------
    public Technician getTechnicianById(Long technicianId) throws Exception {
        return technicianRepo.findById(technicianId)
                .orElseThrow(() -> new Exception("Technician not found"));
    }

    // ---------------- UPDATE TECHNICIAN INFO ----------------
    public Technician updateTechnician(Long technicianId, TechnicianRequest req) throws Exception {
        Technician tech = technicianRepo.findById(technicianId)
                .orElseThrow(() -> new Exception("Technician not found"));

        if(req.getName() != null) tech.setName(req.getName());
        if(req.getEmail() != null) tech.setEmail(req.getEmail());
        if(req.getPhone() != null) tech.setPhone(req.getPhone());
        if(req.getSkills() != null) tech.setSkills(req.getSkills());
        if(req.getPassword() != null) tech.setPassword(passwordEncoder.encode(req.getPassword()));

        return technicianRepo.save(tech);
    }

    // ---------------- UPDATE TECHNICIAN PASSWORD ----------------
    public void updatePassword(Long technicianId, String oldPassword, String newPassword) throws Exception {
        Technician tech = technicianRepo.findById(technicianId)
                .orElseThrow(() -> new Exception("Technician not found"));

        if(!passwordEncoder.matches(oldPassword, tech.getPassword())) {
            throw new Exception("Old password is incorrect");
        }

        tech.setPassword(passwordEncoder.encode(newPassword));
        technicianRepo.save(tech);
    }
}
