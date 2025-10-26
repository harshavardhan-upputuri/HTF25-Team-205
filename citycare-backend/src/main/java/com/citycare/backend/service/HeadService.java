package com.citycare.backend.service;

import java.util.HashSet;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.citycare.backend.domain.USER_ROLE;
import com.citycare.backend.model.Head;
import com.citycare.backend.model.Officer;
import com.citycare.backend.repository.HeadRepository;
import com.citycare.backend.repository.OfficerRepository;
import com.citycare.backend.request.OfficerRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeadService {

    private final HeadRepository headRepo;
    private final OfficerRepository officerRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // ---------------- CREATE OFFICER ----------------
    public Officer createOfficer(Long headId, OfficerRequest req) throws Exception {
        Head head = headRepo.findById(headId)
                .orElseThrow(() -> new Exception("Head not found"));

        Officer officer = new Officer();
        officer.setName(req.getName());
        officer.setEmail(req.getEmail());
        officer.setPhone(req.getPhone());

        // Generate temporary password
        String tempPassword = java.util.UUID.randomUUID().toString().substring(0, 8);
        officer.setPassword(passwordEncoder.encode(tempPassword));
        officer.setRole(USER_ROLE.ROLE_OFFICER);
        officer.setCreatedTechnicians(new HashSet<>());

        Officer savedOfficer = officerRepo.save(officer);

        // Link officer to head
        head.getManagedOfficers().add(savedOfficer);
        headRepo.save(head);

        // Send credentials email
        emailService.sendLoginCredentialsEmail(officer.getEmail(), tempPassword, "Officer");

        return savedOfficer;
    }

    // ---------------- GET ALL OFFICERS ----------------
    public List<Officer> getAllOfficers() {
        return officerRepo.findAll();
    }

    // ---------------- DELETE OFFICER ----------------
    public void deleteOfficer(Long officerId) throws Exception {
        Officer officer = officerRepo.findById(officerId)
                .orElseThrow(() -> new Exception("Officer not found"));
        officerRepo.delete(officer);
    }

    // ---------------- FETCH HEAD INFO ----------------
    public Head getHeadById(Long headId) throws Exception {
        return headRepo.findById(headId)
                .orElseThrow(() -> new Exception("Head not found"));
    }

    // ---------------- UPDATE HEAD INFO ----------------
    public Head updateHead(Long headId, Head req) throws Exception {
        Head head = headRepo.findById(headId)
                .orElseThrow(() -> new Exception("Head not found"));

        if (req.getName() != null) head.setName(req.getName());
        if (req.getEmail() != null) head.setEmail(req.getEmail());
        if (req.getPhone() != null) head.setPhone(req.getPhone());

        return headRepo.save(head);
    }

    // ---------------- UPDATE PASSWORD ----------------
    public void updatePassword(Long headId, String oldPassword, String newPassword) throws Exception {
        Head head = headRepo.findById(headId)
                .orElseThrow(() -> new Exception("Head not found"));

        if (!passwordEncoder.matches(oldPassword, head.getPassword())) {
            throw new Exception("Old password is incorrect");
        }

        head.setPassword(passwordEncoder.encode(newPassword));
        headRepo.save(head);
    }
}
