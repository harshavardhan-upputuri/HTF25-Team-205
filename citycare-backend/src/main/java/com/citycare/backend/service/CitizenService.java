package com.citycare.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.citycare.backend.model.Address;
import com.citycare.backend.model.Citizen;
import com.citycare.backend.repository.AddressRepository;
import com.citycare.backend.repository.CitizenRepository;
import com.citycare.backend.request.CitizenUpdateDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CitizenService {

    private final CitizenRepository citizenRepo;
    private final AddressRepository addressRepo;
    private final PasswordEncoder passwordEncoder;

    // ---------------- UPDATE CITIZEN PROFILE ----------------
    public void updateCitizenProfile( CitizenUpdateDto req, Citizen curr) throws Exception {

        if (req.getName() != null) curr.setName(req.getName());
        if (req.getEmail() != null) curr.setEmail(req.getEmail());
        if (req.getPhone() != null) curr.setPhone(req.getPhone());

        // Optional: update addresses if sent
        if (req.getAddresses() != null) {
            for (Address incomingAddr : req.getAddresses()) {
                if (incomingAddr.getId() != null) {
                    Address existing = addressRepo.findById(incomingAddr.getId())
                            .orElseThrow(() -> new RuntimeException("Address not found with id " + incomingAddr.getId()));
                    existing.setName(incomingAddr.getName());
                    existing.setLocality(incomingAddr.getLocality());
                    existing.setStreetAddress(incomingAddr.getStreetAddress());
                    existing.setCity(incomingAddr.getCity());
                    existing.setState(incomingAddr.getState());
                    existing.setPinCode(incomingAddr.getPinCode());
                    existing.setMobile(incomingAddr.getMobile());
                    existing.setCitizen(curr);
                } else {
                    incomingAddr.setCitizen(curr);
                    curr.getAddresses().add(incomingAddr);
                }
            }
        }

        citizenRepo.save(curr);
    }

    // ---------------- UPDATE PASSWORD ----------------
    public void updateCitizenPassword(Citizen citizen, String oldPassword, String newPassword) throws Exception {
        if (!passwordEncoder.matches(oldPassword, citizen.getPassword())) {
            throw new Exception("Old password is incorrect");
        }
        citizen.setPassword(passwordEncoder.encode(newPassword));
        citizenRepo.save(citizen);
    }
}
