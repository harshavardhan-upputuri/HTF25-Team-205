package com.citycare.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.citycare.backend.model.Citizen;
import com.citycare.backend.model.Technician;
import com.citycare.backend.request.TechnicianRequest;
import com.citycare.backend.service.TechnicianService;
import com.citycare.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth/technicians")
@RequiredArgsConstructor
public class TechnicianController {

    private final TechnicianService technicianService;
    private final UserService userService; // for JWT auth


    @GetMapping()
    public ResponseEntity<Technician> getTechnician(
                                                    @RequestHeader("Authorization") String jwt) throws Exception {
        Technician technician = (Technician) userService.findUserByJwt(jwt);
        return ResponseEntity.ok(technician);
    }

    // ---------------- UPDATE TECHNICIAN INFO ----------------
    @PutMapping("/{id}")
    public ResponseEntity<Technician> updateTechnician(@PathVariable Long id,
                                                       @RequestBody TechnicianRequest req,
                                                       @RequestHeader("Authorization") String jwt) throws Exception {
        userService.findUserByJwt(jwt); // validate JWT
        return ResponseEntity.ok(technicianService.updateTechnician(id, req));
    }

    // ---------------- UPDATE TECHNICIAN PASSWORD ----------------
    @PutMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable Long id,
                                                 @RequestParam String oldPassword,
                                                 @RequestParam String newPassword,
                                                 @RequestHeader("Authorization") String jwt) throws Exception {
        userService.findUserByJwt(jwt); // validate JWT
        technicianService.updatePassword(id, oldPassword, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }
}
