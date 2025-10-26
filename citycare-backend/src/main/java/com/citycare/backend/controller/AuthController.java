package com.citycare.backend.controller;

import com.citycare.backend.domain.USER_ROLE;
import com.citycare.backend.model.Head;
import com.citycare.backend.model.Officer;
import com.citycare.backend.model.Technician;
import com.citycare.backend.model.VerificationCode;
import com.citycare.backend.request.LoginOtpRequest;
import com.citycare.backend.request.LoginRequest;
import com.citycare.backend.request.SignupRequest;
import com.citycare.backend.response.ApiResponse;
import com.citycare.backend.response.AuthResponse;
import com.citycare.backend.service.AuthService;
import com.citycare.backend.service.CitizenService;
import com.citycare.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private  UserService userService;

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) throws Exception {
        AuthResponse authResponse = authService.signIn(req);
        return ResponseEntity.ok(authResponse);
    }

    // SIGNUP (only for Citizen)
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest req) throws Exception {
        AuthResponse authResponse = authService.signUp(req);
        return ResponseEntity.ok(authResponse);
    }

    // Send OTP
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse> sendOtp(@RequestBody LoginOtpRequest req) throws Exception {
        authService.sendLoginOtp(req.getEmail(), req.getRole());
        ApiResponse res = new ApiResponse();
        res.setMessage("OTP sent successfully");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/officer/profile")
    public ResponseEntity<Officer> getOfficerProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        Officer officer = (Officer) userService.findUserByJwt(jwt);
        return ResponseEntity.ok(officer);
    }

    @GetMapping("/technician/profile")
    public ResponseEntity<Technician> getTechnicianProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        Technician technician = (Technician) userService.findUserByJwt(jwt);
        return ResponseEntity.ok(technician);
    }

    @GetMapping("/head/profile")
    public ResponseEntity<Head> getHeadProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        Head head = (Head) userService.findUserByJwt(jwt);
        return ResponseEntity.ok(head);
    }
}
