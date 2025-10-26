package com.citycare.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.citycare.backend.model.Officer;
import com.citycare.backend.model.Technician;
import com.citycare.backend.request.OfficerRequest;
import com.citycare.backend.request.TechnicianRequest;
import com.citycare.backend.service.OfficerService;
import com.citycare.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
public class OfficerController {

    private final OfficerService officerService;
    private final UserService userService;

    // ---------------- CREATE TECHNICIAN ----------------
    @PostMapping("/create-technician")
    public ResponseEntity<Technician> createTechnician(@RequestBody TechnicianRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception {
        Officer officer = (Officer) userService.findUserByJwt(jwt);
        Technician technician = officerService.createTechnician(officer.getId(), req);
        return ResponseEntity.ok(technician);
    }

    // ---------------- GET ALL TECHNICIANS ----------------
    @GetMapping("/technicians")
    public ResponseEntity<List<Technician>> getAllTechnicians(@RequestHeader("Authorization") String jwt)
            throws Exception {
        Officer officer = (Officer) userService.findUserByJwt(jwt); // get logged-in officer
        List<Technician> technicians = officerService.getAllTechniciansByOfficer(officer.getId());
        return ResponseEntity.ok(technicians);
    }

    // ---------------- GET OFFICER INFO ----------------
    // @GetMapping("/me")
    // public ResponseEntity<Officer> getOfficer(@RequestHeader("Authorization")
    // String jwt) throws Exception {
    // Officer officer = (Officer) userService.findUserByJwt(jwt);
    // return ResponseEntity.ok(officerService.getOfficer(officer.getId()));
    // }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getOfficer(@RequestHeader("Authorization") String jwt) throws Exception {
        Officer officer = (Officer) userService.findUserByJwt(jwt);

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", officer.getId());
        profile.put("name", officer.getName());
        profile.put("email", officer.getEmail());
        profile.put("role", officer.getRole());
        profile.put("phone", officer.getPhone());
        // Only basic info — skip collections!

        return ResponseEntity.ok(profile);
    }

    // ---------------- UPDATE OFFICER INFO ----------------
    @PutMapping("/me")
    public ResponseEntity<Officer> updateOfficer(@RequestBody OfficerRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception {
        Officer officer = (Officer) userService.findUserByJwt(jwt);
        return ResponseEntity.ok(officerService.updateOfficer(officer.getId(), req));
    }

    // ---------------- UPDATE PASSWORD ----------------
    @PutMapping("/me/password")
    public ResponseEntity<String> updatePassword(@RequestParam String oldPassword,
            @RequestParam String newPassword,
            @RequestHeader("Authorization") String jwt) throws Exception {
        Officer officer = (Officer) userService.findUserByJwt(jwt);
        officerService.updatePassword(officer.getId(), oldPassword, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }

    // ---------------- DELETE TECHNICIAN ----------------
    @DeleteMapping("/technicians/{id}")
    public ResponseEntity<String> deleteTechnician(@PathVariable Long id) throws Exception {
        officerService.deleteTechnician(id);
        return ResponseEntity.ok("Technician deleted successfully");
    }
}
