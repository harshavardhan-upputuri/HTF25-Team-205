package com.citycare.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.citycare.backend.model.Vote;
import com.citycare.backend.model.Citizen;
import com.citycare.backend.model.Issue;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByCitizenAndIssue(Citizen citizen, Issue issue);
    Long countByIssueAndUpvoteTrue(Issue issue);
    Long countByIssueAndUpvoteFalse(Issue issue);
    List<Vote> findByIssue(Issue issue);
}
