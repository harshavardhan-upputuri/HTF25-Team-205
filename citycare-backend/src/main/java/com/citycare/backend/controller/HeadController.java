package com.citycare.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.citycare.backend.model.Head;
import com.citycare.backend.model.Officer;
import com.citycare.backend.request.OfficerRequest;
import com.citycare.backend.service.HeadService;
import com.citycare.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/head")
@RequiredArgsConstructor
public class HeadController {

    private final HeadService headService;
    private final UserService userService;

    // ---------------- CREATE OFFICER ----------------
    @PostMapping("/create-officer")
    public ResponseEntity<Officer> createOfficer(@RequestBody OfficerRequest req,
                                                 @RequestHeader("Authorization") String jwt) throws Exception {
        Head head = (Head) userService.findUserByJwt(jwt);
        Officer officer = headService.createOfficer(head.getId(), req);
        return ResponseEntity.ok(officer);
    }

    // ---------------- DELETE OFFICER ----------------
    @DeleteMapping("/officers/{officerId}")
    public ResponseEntity<String> deleteOfficer(@PathVariable Long officerId,
                                                @RequestHeader("Authorization") String jwt) throws Exception {
        Head head = (Head) userService.findUserByJwt(jwt);
        if(head == null) throw new Exception("Head not found");
        headService.deleteOfficer(officerId);
        return ResponseEntity.ok("Officer deleted successfully");
    }

    // ---------------- GET ALL OFFICERS ----------------
    @GetMapping("/officers")
    public ResponseEntity<List<Officer>> getAllOfficers(@RequestHeader("Authorization") String jwt) throws Exception {
        Head head = (Head) userService.findUserByJwt(jwt);
        if(head == null) throw new Exception("Head not found");
        return ResponseEntity.ok(headService.getAllOfficers());
    }

    // ---------------- FETCH HEAD INFO ----------------
    @GetMapping("/me")
    public ResponseEntity<Head> getHead(@RequestHeader("Authorization") String jwt) throws Exception {
        Head head = (Head) userService.findUserByJwt(jwt);
        return ResponseEntity.ok(head);
    }

    // ---------------- UPDATE HEAD INFO ----------------
    @PutMapping("/me")
    public ResponseEntity<Head> updateHead(@RequestBody Head req,
                                           @RequestHeader("Authorization") String jwt) throws Exception {
        Head head = (Head) userService.findUserByJwt(jwt);
        Head updatedHead = headService.updateHead(head.getId(), req);
        return ResponseEntity.ok(updatedHead);
    }

    // ---------------- UPDATE PASSWORD ----------------
    @PutMapping("/me/password")
    public ResponseEntity<String> updatePassword(@RequestParam String oldPassword,
                                                 @RequestParam String newPassword,
                                                 @RequestHeader("Authorization") String jwt) throws Exception {
        Head head = (Head) userService.findUserByJwt(jwt);
        headService.updatePassword(head.getId(), oldPassword, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }
}
