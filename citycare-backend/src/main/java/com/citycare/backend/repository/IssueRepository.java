package com.citycare.backend.repository;

import com.citycare.backend.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    // Fetch all issues for a specific citizen
    List<Issue> findByCitizenId(Long citizenId);

    // Fetch all issues assigned to a specific technician
    List<Issue> findByAssignedTechniciansId(Long technicianId);

    // Fetch issues by status (optional)
    List<Issue> findByStatus(String status);



    // Fetch all issues for a citizen along with address and technicians
    @Query("SELECT DISTINCT i FROM Issue i " +
           "JOIN FETCH i.citizen c " +
           "JOIN FETCH i.address a " +
           "LEFT JOIN FETCH i.assignedTechnicians t " +
           "WHERE c.id = :citizenId")
    List<Issue> findAllByCitizenIdWithDetails(@Param("citizenId") Long citizenId);

    // Fetch all issues for a technician
    @Query("SELECT DISTINCT i FROM Issue i " +
           "JOIN FETCH i.assignedTechnicians t " +
           "JOIN FETCH i.address a " +
           "JOIN FETCH i.citizen c " +
           "WHERE t.id = :techId")
    List<Issue> findAllForTechnicianWithDetails(@Param("techId") Long techId);
}
