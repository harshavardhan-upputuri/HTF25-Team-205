package com.citycare.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.citycare.backend.response.ApiResponse;
import com.citycare.backend.model.Citizen;
import com.citycare.backend.request.CitizenUpdateDto;
import com.citycare.backend.service.CitizenService;
import com.citycare.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/citizen")
@RequiredArgsConstructor
public class CitizenController {

    private final UserService userService;
    private final CitizenService citizenService;

    // ---------------- FETCH OWN PROFILE ----------------
    @GetMapping("/profile")
    public ResponseEntity<Citizen> getProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        Citizen citizen = (Citizen) userService.findUserByJwt(jwt);
        return ResponseEntity.ok(citizen);
    }

    // ---------------- UPDATE PROFILE ----------------
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(@RequestHeader("Authorization") String jwt,
            @RequestBody CitizenUpdateDto req) throws Exception {
        Citizen curr = (Citizen) userService.findUserByJwt(jwt);
        citizenService.updateCitizenProfile(req, curr);

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Profile updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    // ---------------- UPDATE PASSWORD ----------------
    @PutMapping("/profile/password")
    public ResponseEntity<ApiResponse> updatePassword(@RequestHeader("Authorization") String jwt,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) throws Exception {
        Citizen citizen = (Citizen) userService.findUserByJwt(jwt);
        citizenService.updateCitizenPassword(citizen, oldPassword, newPassword);

        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Password updated successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
