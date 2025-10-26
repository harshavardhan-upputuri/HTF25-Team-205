package com.citycare.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.citycare.backend.model.Citizen;
import com.citycare.backend.model.Issue;
import com.citycare.backend.model.Vote;
import com.citycare.backend.repository.IssueRepository;
import com.citycare.backend.repository.VoteRepository;
import com.citycare.backend.repository.CitizenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final IssueRepository issueRepository;
    private final CitizenRepository citizenRepository;

    public Vote createOrUpdateVote(Long issueId, Long citizenId, boolean upvote, String comment) throws Exception {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new Exception("Issue not found"));

        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new Exception("Citizen not found"));

        Vote vote = voteRepository.findByCitizenAndIssue(citizen, issue)
                .orElse(new Vote());

        vote.setCitizen(citizen);
        vote.setIssue(issue);
        vote.setUpvote(upvote);
        vote.setComment(comment);

        return voteRepository.save(vote);
    }

    public void deleteVote(Long voteId, Long citizenId) throws Exception {
        Vote vote = voteRepository.findById(voteId)
                .orElseThrow(() -> new Exception("Vote not found"));

        if (!vote.getCitizen().getId().equals(citizenId)) {
            throw new Exception("You cannot delete this vote");
        }

        voteRepository.delete(vote);
    }

    public Vote getVoteByCitizenAndIssue(Long issueId, Long citizenId) throws Exception {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new Exception("Issue not found"));

        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new Exception("Citizen not found"));

        return voteRepository.findByCitizenAndIssue(citizen, issue).orElse(null);
    }

    public List<Vote> getVotesByIssue(Long issueId) throws Exception {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new Exception("Issue not found"));
        return voteRepository.findByIssue(issue);
    }

    public Long countUpvotes(Long issueId) throws Exception {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new Exception("Issue not found"));
        return voteRepository.countByIssueAndUpvoteTrue(issue);
    }

    public Long countDownvotes(Long issueId) throws Exception {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new Exception("Issue not found"));
        return voteRepository.countByIssueAndUpvoteFalse(issue);
    }
}
