package com.citycare.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.citycare.backend.model.Vote;
import com.citycare.backend.model.Citizen;
import com.citycare.backend.service.UserService;
import com.citycare.backend.service.VoteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/votes")
public class VoteController {

    private final VoteService voteService;
    private final UserService userService;

    // Create or update vote
    @PostMapping("/{issueId}")
    public ResponseEntity<Vote> castVote(
            @PathVariable Long issueId,
            @RequestParam boolean upvote,
            @RequestParam(required = false) String comment,
            @RequestHeader("Authorization") String jwt) throws Exception {

        Citizen citizen = (Citizen) userService.findUserByJwt(jwt);

        Vote vote = voteService.createOrUpdateVote(issueId, citizen.getId(), upvote, comment);
        return ResponseEntity.ok(vote);
    }

    // Delete vote
    @DeleteMapping("/{voteId}")
    public ResponseEntity<String> deleteVote(
            @PathVariable Long voteId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        Citizen citizen = (Citizen) userService.findUserByJwt(jwt);
        voteService.deleteVote(voteId, citizen.getId());

        return ResponseEntity.ok("Vote deleted successfully");
    }

    // Get vote counts
    @GetMapping("/{issueId}/count")
    public ResponseEntity<?> getVoteCount(@PathVariable Long issueId) throws Exception {
        Long upvotes = voteService.countUpvotes(issueId);
        Long downvotes = voteService.countDownvotes(issueId);

        return ResponseEntity.ok(new java.util.HashMap<String, Long>() {{
            put("upvotes", upvotes);
            put("downvotes", downvotes);
        }});
    }

    // Get user's vote for an issue
    @GetMapping("/{issueId}/my-vote")
    public ResponseEntity<Vote> getMyVote(@PathVariable Long issueId,
                                          @RequestHeader("Authorization") String jwt) throws Exception {
        Citizen citizen = (Citizen) userService.findUserByJwt(jwt);
        Vote vote = voteService.getVoteByCitizenAndIssue(issueId, citizen.getId());
        return ResponseEntity.ok(vote);
    }

    // Get all comments for an issue
    @GetMapping("/{issueId}/comments")
    public ResponseEntity<List<Vote>> getAllComments(@PathVariable Long issueId) throws Exception {
        List<Vote> votes = voteService.getVotesByIssue(issueId);
        return ResponseEntity.ok(votes);
    }
}
