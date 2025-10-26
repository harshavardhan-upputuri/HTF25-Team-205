package com.citycare.backend.controller;

import com.citycare.backend.model.Issue;
import com.citycare.backend.model.IssueAttachment;
import com.citycare.backend.model.Technician;
import com.citycare.backend.request.IssueRequest;
import com.citycare.backend.model.Address;
import com.citycare.backend.model.Citizen;
import com.citycare.backend.service.IssueService;
import com.citycare.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;
    private final UserService userService;

    public IssueController(IssueService issueService, UserService userService) {
        this.issueService = issueService;
        this.userService = userService;
    }

    // ---------------- CITIZEN ----------------

    @PostMapping("/create")
    public ResponseEntity<Issue> createIssue(@RequestBody IssueRequest request,
            @RequestHeader("Authorization") String jwt) throws Exception {
        Citizen citizen = (Citizen) userService.findUserByJwt(jwt);
        if (citizen == null)
            throw new Exception("Invalid user");

        // Create Address
        Address address = new Address();
        address.setName(request.getAddressName());
        address.setLocality(request.getLocality());
        address.setStreetAddress(request.getStreetAddress());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPinCode(request.getPinCode());
        address.setMobile(request.getMobile());
        address.setLatitude(request.getLatitude()); // <--- set
        address.setLongitude(request.getLongitude());

        // Create Issue
        Issue issue = new Issue();
        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setIssueType(
                Enum.valueOf(com.citycare.backend.domain.IssueType.class, request.getIssueType().toUpperCase()));
        issue.setCitizen(citizen);
        issue.setAddress(address);
        issue.setAttachments(new HashSet<>());

        // Add attachments from URLs
        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                IssueAttachment attachment = new IssueAttachment();
                attachment.setImageUrl(url);
                attachment.setIssue(issue); // very important
                issue.getAttachments().add(attachment);
                
            }

        }

        Issue created = issueService.createIssue(issue);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/my-issues")
    public ResponseEntity<List<Issue>> getMyIssues(@RequestHeader("Authorization") String jwt) throws Exception {
        Citizen citizen = (Citizen) userService.findUserByJwt(jwt);
        List<Issue> issues = issueService.getIssuesByCitizen(citizen.getId());
        return ResponseEntity.ok(issues);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        Citizen citizen = (Citizen) userService.findUserByJwt(jwt);
        issueService.deleteIssueByCitizen(id, citizen.getId());
        return ResponseEntity.noContent().build();
    }

    // ---------------- OFFICER ----------------

    @GetMapping("/all")
    public ResponseEntity<List<Issue>> getAllIssues(@RequestHeader("Authorization") String jwt) throws Exception {
        userService.validateOfficer(jwt); // only officer can fetch all
        List<Issue> issues = issueService.getAllIssues();
        return ResponseEntity.ok(issues);
    }

    @PostMapping("/{id}/assign-technicians")
    public ResponseEntity<Issue> assignTechnicians(@PathVariable Long id,
            @RequestBody Set<Long> technicianIds,
            @RequestHeader("Authorization") String jwt) throws Exception {
        userService.validateOfficer(jwt);
        Issue updated = issueService.assignTechnicians(id, technicianIds);
        return ResponseEntity.ok(updated);
    }

    // ---------------- TECHNICIAN ----------------

    @PatchMapping("/{id}/update-status")
    public ResponseEntity<Issue> updateStatus(@PathVariable Long id,
            @RequestParam String status,
            @RequestHeader("Authorization") String jwt) throws Exception {
        Technician tech = (Technician) userService.findUserByJwt(jwt);
        Issue updated = issueService.updateStatusByTechnician(id, status, tech.getId());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/my-assigned")
    public ResponseEntity<List<Issue>> getAssignedIssues(@RequestHeader("Authorization") String jwt) throws Exception {
        Technician tech = (Technician) userService.findUserByJwt(jwt);
        List<Issue> issues = issueService.getIssuesForTechnician(tech.getId());
        return ResponseEntity.ok(issues);
    }

    @GetMapping("/all-public")
    public ResponseEntity<List<Issue>> getAllIssuesPublic() throws Exception {
        List<Issue> issues = issueService.getAllIssues();

        return ResponseEntity.ok(issues);
    }

}
