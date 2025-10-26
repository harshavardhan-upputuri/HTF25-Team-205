package com.citycare.backend.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.citycare.backend.model.Issue;
import com.citycare.backend.model.Technician;
import com.citycare.backend.repository.IssueRepository;
import com.citycare.backend.repository.TechnicianRepository;

import jakarta.transaction.Transactional;

@Service
public class IssueService {

    private final IssueRepository issueRepo;
    private final TechnicianRepository techRepo;

    public IssueService(IssueRepository issueRepo, TechnicianRepository techRepo) {
        this.issueRepo = issueRepo;
        this.techRepo = techRepo;
    }

    // Citizen
    public Issue createIssue(Issue issue) {
        return issueRepo.save(issue);
    }

    public List<Issue> getIssuesByCitizen(Long citizenId) {
        return issueRepo.findAllByCitizenIdWithDetails(citizenId);
    }

    public void deleteIssueByCitizen(Long issueId, Long citizenId) throws Exception {
        Issue issue = issueRepo.findById(issueId).orElseThrow(() -> new Exception("Issue not found"));
        if (!issue.getCitizen().getId().equals(citizenId))
            throw new Exception("Unauthorized");
        issueRepo.delete(issue);
    }

    // Officer
    public List<Issue> getAllIssues() {
        return issueRepo.findAll();
    }

    @Transactional
    public Issue assignTechnicians(Long issueId, Set<Long> technicianIds) throws Exception {
        Issue issue = issueRepo.findById(issueId).orElseThrow(() -> new Exception("Issue not found"));
        Set<Technician> technicians = techRepo.findAllById(technicianIds).stream()
                .collect(java.util.stream.Collectors.toSet());
        issue.getAssignedTechnicians().clear();
        issue.getAssignedTechnicians().addAll(technicians);
        return issue;
    }

    // Technician
    @Transactional
    public Issue updateStatusByTechnician(Long issueId, String status, Long techId) throws Exception {
        Issue issue = issueRepo.findById(issueId).orElseThrow(() -> new Exception("Issue not found"));
        boolean assigned = issue.getAssignedTechnicians().stream().anyMatch(t -> t.getId().equals(techId));
        if (!assigned)
            throw new Exception("Technician not assigned to this issue");
        issue.setStatus(Enum.valueOf(com.citycare.backend.domain.IssueStatus.class, status.toUpperCase()));
        return issue;
    }

    public List<Issue> getIssuesForTechnician(Long techId) {
        return issueRepo.findAllForTechnicianWithDetails(techId);
    }

    

}
