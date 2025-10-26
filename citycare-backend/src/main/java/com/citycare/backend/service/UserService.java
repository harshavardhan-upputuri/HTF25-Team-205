package com.citycare.backend.service;

import org.springframework.stereotype.Service;

import com.citycare.backend.config.JwtProvider;
import com.citycare.backend.model.Citizen;
import com.citycare.backend.model.Head;
import com.citycare.backend.model.Officer;
import com.citycare.backend.model.Technician;
import com.citycare.backend.repository.CitizenRepository;
import com.citycare.backend.repository.HeadRepository;
import com.citycare.backend.repository.OfficerRepository;
import com.citycare.backend.repository.TechnicianRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final CitizenRepository citizenRepo;
    private final TechnicianRepository technicianRepo;
    private final OfficerRepository officerRepo;
    private final HeadRepository headRepo;
    private final JwtProvider jwtProvider;

    // Extract user from JWT
    public Object findUserByJwt(String jwt) throws Exception {
        // Remove Bearer prefix if present
        String token = jwt;
        if (jwt.startsWith("Bearer ")) {
            token = jwt.substring(7);
        }

        // decode JWT to get email
        String email = jwtProvider.getEmailFromJwtToken(token);

        // find user by email (Efficiently)
        Citizen citizen = citizenRepo.findByEmail(email);
        if (citizen != null) {
            return citizen;
        }

        Technician technician = technicianRepo.findByEmail(email);
        if (technician != null) {
            return technician;
        }

        Officer officer = officerRepo.findByEmail(email);
        if (officer != null) {
            return officer;
        }

        Head head = headRepo.findByEmail(email);
        if (head != null) {
            return head;
        }

        throw new Exception("User not found for email: " + email);
    }

    public void validateOfficer(String jwt) throws Exception {
        Object user = findUserByJwt(jwt);
        if (!(user instanceof Officer)) throw new Exception("Unauthorized");
    }
}