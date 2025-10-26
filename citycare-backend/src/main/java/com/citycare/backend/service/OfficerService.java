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
import com.citycare.backend.request.OfficerRequest;
import com.citycare.backend.request.TechnicianRequest;
import com.citycare.backend.utils.OtpUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OfficerService {

    private final OfficerRepository officerRepo;
    private final TechnicianRepository technicianRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // ---------------- CREATE TECHNICIAN ----------------

    public Technician createTechnician(Long officerId, TechnicianRequest req) throws Exception {
        Officer officer = officerRepo.findById(officerId)
                .orElseThrow(() -> new Exception("Officer not found"));

        Technician technician = new Technician();
        technician.setName(req.getName());
        technician.setEmail(req.getEmail());
        technician.setPhone(req.getPhone());

        String tempPassword = OtpUtil.generateOtp(); // generate password
        technician.setPassword(passwordEncoder.encode(tempPassword));
        technician.setRole(USER_ROLE.ROLE_TECHNICIAN);
        technician.setSkills(req.getSkills() != null ? req.getSkills() : new HashSet<>());

        // Set the owning side
        technician.setCreatedBy(officer);

        // Save technician
        Technician savedTech = technicianRepo.save(technician);

        // No need to modify officer.getCreatedTechnicians() manually

        // Send credentials via email
        emailService.sendLoginCredentialsEmail(technician.getEmail(), tempPassword, "Technician");

        return savedTech;
    }

    // ---------------- GET ALL TECHNICIANS CREATED BY OFFICER ----------------
    public List<Technician> getAllTechniciansByOfficer(Long officerId) throws Exception {
        return technicianRepo.findByCreatedBy_Id(officerId); // Java 16+ safe stream conversion
    }

    // ---------------- GET OFFICER INFO ----------------
    public Officer getOfficer(Long officerId) throws Exception {
        return officerRepo.findById(officerId)
                .orElseThrow(() -> new Exception("Officer not found"));
    }

    // ---------------- UPDATE OFFICER INFO ----------------
    public Officer updateOfficer(Long officerId, OfficerRequest req) throws Exception {
        Officer officer = officerRepo.findById(officerId)
                .orElseThrow(() -> new Exception("Officer not found"));

        officer.setName(req.getName());
        officer.setEmail(req.getEmail());
        officer.setPhone(req.getPhone());
        return officerRepo.save(officer);
    }

    // ---------------- UPDATE OFFICER PASSWORD ----------------
    public void updatePassword(Long officerId, String oldPassword, String newPassword) throws Exception {
        Officer officer = officerRepo.findById(officerId)
                .orElseThrow(() -> new Exception("Officer not found"));

        if (!passwordEncoder.matches(oldPassword, officer.getPassword())) {
            throw new Exception("Old password is incorrect");
        }

        officer.setPassword(passwordEncoder.encode(newPassword));
        officerRepo.save(officer);
    }

    // ---------------- DELETE TECHNICIAN ----------------
    public void deleteTechnician(Long technicianId) throws Exception {
        Technician tech = technicianRepo.findById(technicianId)
                .orElseThrow(() -> new Exception("Technician not found"));
        technicianRepo.delete(tech);
    }
}
