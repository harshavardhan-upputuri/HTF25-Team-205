import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
// Icons are removed as per previous request

// API Base URL (adjust if needed)
const API = "http://localhost:8083/api/votes"; // Ensure port matches backend

// VoteModal Component - Enhanced UI
const VoteModal = ({ issueId, isOpen, onClose }) => {
  const token = localStorage.getItem("jwt");

  const [counts, setCounts] = useState({ upvotes: 0, downvotes: 0 });
  const [userVote, setUserVote] = useState(null); // boolean | null
  const [commentInput, setCommentInput] = useState("");
  const [existingComment, setExistingComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true); // Separate loading for initial fetch
  const [error, setError] = useState(null);

  // --- Fetch vote data and all comments ---
  const fetchVoteData = useCallback(async () => {
    setIsLoadingData(true);
    setError(null);
    try {
      // Fetch Counts
      const countRes = await axios.get(`${API}/${issueId}/count`);
      setCounts({
        upvotes: countRes.data.upvotes || 0,
        downvotes: countRes.data.downvotes || 0,
      });

      // Fetch user's vote status and comment if logged in
      if (token) {
        try {
          // ASSUMPTION: Backend provides GET /api/votes/{issueId}/my-vote
          const userVoteRes = await axios.get(`${API}/${issueId}/my-vote`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserVote(userVoteRes.data?.upvote ?? null);
          setExistingComment(userVoteRes.data?.comment ?? "");
          setCommentInput(userVoteRes.data?.comment ?? "");
        } catch (userVoteErr) {
          // Handle 404 specifically - means no vote exists
          if (userVoteErr.response?.status === 404) {
            setUserVote(null);
            setExistingComment("");
            setCommentInput("");
          } else {
            console.error("Failed to fetch user vote:", userVoteErr);
            setError("Could not load your vote status."); // Show specific error
          }
        }
      } else {
        // Reset if not logged in
        setUserVote(null);
        setExistingComment("");
        setCommentInput("");
      }

      // Fetch all comments for the issue
      // ASSUMPTION: Backend provides GET /api/votes/{issueId}/comments returning List<Vote> with citizen details
      const commentsRes = await axios.get(`${API}/${issueId}/comments`);
      setAllComments(commentsRes.data || []);

    } catch (err) {
      console.error("Failed to load modal data:", err);
      // Show error primarily related to counts or all comments fetch
      setError("Failed to load vote counts or comments.");
    } finally {
      setIsLoadingData(false);
    }
  }, [issueId, token]);

  useEffect(() => {
    if (isOpen) {
        fetchVoteData();
    }
  }, [fetchVoteData, isOpen]);

  // --- Handle Vote/Comment Submission ---
  const handleVoteSubmit = async (upvote) => {
    if (!token) return alert("Please log in to vote/comment.");
    if (isSubmitting) return;

    // Prevent submitting the same vote again via main buttons
    if (upvote === userVote) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post(`${API}/${issueId}`, null, {
        params: { upvote, comment: commentInput || null },
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchVoteData(); // Refetch everything to update counts, user vote, and potentially comment list
      // Comment input is reset/updated within fetchVoteData
    } catch (err) {
      console.error("Failed to submit vote/comment:", err);
      setError(err.response?.data?.message || "Failed to submit vote/comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handle Vote/Comment Deletion ---
  const handleDelete = async () => {
    if (!token) return alert("Please log in first.");
    if (isSubmitting || userVote === null) return; // Can't delete if no vote exists
    if (!window.confirm("Are you sure you want to remove your vote and comment?")) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Backend handles finding the specific vote by user+issue
      await axios.delete(`${API}/${issueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchVoteData(); // Refetch everything
    } catch (err) {
      console.error("Failed to delete vote:", err);
      setError(err.response?.data?.message || "Failed to delete vote/comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Modal Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting} // Disable close while submitting
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Votes & Comments</h2>

        {/* Loading State */}
         {isLoadingData && (
            <div className="flex justify-center items-center py-10 text-gray-500">
                <span className="inline-block border-t-2 border-r-2 border-indigo-600 rounded-full w-6 h-6 animate-spin mr-3"></span>
                Loading...
            </div>
         )}

        {/* Error Display */}
        {error && !isLoadingData && (
             <div className="rounded-md bg-red-100 p-3 border border-red-200 flex items-center mb-4">
                <span className="text-red-500 mr-2 text-xl font-bold flex-shrink-0">!</span>
                <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
        )}

        {/* Content - Visible after initial load */}
        {!isLoadingData && (
            <>
                {/* Upvote / Downvote Buttons */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => handleVoteSubmit(true)}
                    disabled={isSubmitting || !token}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-white font-medium transition-all duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed ${
                      userVote === true ? "bg-green-600 ring-2 ring-green-700" : "bg-green-400 hover:bg-green-500"
                    }`}
                  >
                    <span role="img" aria-label="thumbs up" className="text-lg">👍</span> Upvote ({counts.upvotes})
                  </button>

                  <button
                    onClick={() => handleVoteSubmit(false)}
                    disabled={isSubmitting || !token}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-white font-medium transition-all duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed ${
                      userVote === false ? "bg-red-600 ring-2 ring-red-700" : "bg-red-400 hover:bg-red-500"
                    }`}
                  >
                    <span role="img" aria-label="thumbs down" className="text-lg">👎</span> Downvote ({counts.downvotes})
                  </button>

                 {userVote !== null && token && (
                    <button
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 disabled:opacity-60"
                        title="Remove your vote and comment"
                    >
                         <span role="img" aria-label="cross mark" className="text-sm">❌</span> Delete
                    </button>
                    )}
                </div>

                {/* Comment Input Section */}
                {token && (
                  <div className="flex gap-2 items-center mb-4">
                    <label htmlFor={`modal-comment-${issueId}`} className="sr-only">Add or update comment</label>
                    <input
                      id={`modal-comment-${issueId}`}
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder={existingComment ? "Update comment..." : "Add comment..."}
                      disabled={isSubmitting}
                      className="flex-1 block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm disabled:bg-gray-100"
                    />
                    <button
                      onClick={() => handleVoteSubmit(userVote !== null ? userVote : true)} // Preserve vote or default to upvote
                      disabled={isSubmitting}
                      className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <span className="inline-block border-t-2 border-r-2 border-white rounded-full w-4 h-4 animate-spin"></span>
                      ) : (
                         <span role="img" aria-label="airplane" className="text-base mr-1">✈️</span>
                      )}
                      <span className="ml-1">{existingComment ? 'Update' : 'Submit'}</span>
                    </button>

                  </div>
                )}

                {/* Comments List */}
                 <h3 className="text-sm font-semibold text-gray-600 mb-2 pt-3 border-t">Comments ({allComments.length})</h3>
                {allComments.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                    {allComments.map((c) => (
                       // Make sure backend sends necessary comment details (id, comment, citizen.name)
                      <div key={c.id} className="p-3 border rounded-lg bg-gray-50/70 border-gray-200">
                        <p className="text-xs font-semibold text-indigo-700 mb-0.5">{c.citizen?.name || 'Anonymous'} says:</p>
                        <p className="text-sm text-gray-800 break-words">{c.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                    <p className="text-sm text-gray-400 italic text-center py-4">No comments yet.</p>
                )}


                {!token && (
                  <p className="text-xs text-center text-gray-500 pt-3 border-t mt-4">
                    Please <a href="/login" className="text-indigo-600 hover:underline font-medium">log in</a> to vote or comment.
                  </p>
                )}
            </>
        )}


      </div>
      {/* Animation classes for fade-in and scale */}
      <style>{`
        @keyframes fade-in-scale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
            animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// VoteToggle Component - Enhanced UI
const VoteToggle = ({ issueId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState({ upvotes: 0, downvotes: 0 });
  const [fetchError, setFetchError] = useState(null);

  // Fetch only counts for the toggle button
  const fetchCounts = useCallback(async () => {
    setFetchError(null);
    try {
      const countRes = await axios.get(`${API}/${issueId}/count`);
      setCounts({
        upvotes: countRes.data.upvotes || 0,
        downvotes: countRes.data.downvotes || 0,
      });
    } catch (err) {
      console.error("Failed to fetch counts:", err);
      setFetchError("!"); // Indicate error fetching counts
    }
  }, [issueId]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Refetch counts when modal is closed (in case votes changed)
  const handleCloseModal = () => {
    setIsOpen(false);
    fetchCounts(); // Refetch counts after modal interaction
  };

  return (
    <div>
      {/* Enhanced Toggle Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-150 ease-in-out bg-green-100 text-green-700 hover:bg-green-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500"
          title={`${counts.upvotes} Upvotes - Click to Vote/Comment`}
        >
          <span role="img" aria-label="thumbs up">👍</span>
          {fetchError ? '!' : counts.upvotes}
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-150 ease-in-out bg-red-100 text-red-700 hover:bg-red-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
          title={`${counts.downvotes} Downvotes - Click to Vote/Comment`}
        >
          <span role="img" aria-label="thumbs down">👎</span>
          {fetchError ? '!' : counts.downvotes}
        </button>
      </div>

      {/* Render Modal */}
      {/* Pass issueId, isOpen, and the modified onClose handler */}
      <VoteModal
        issueId={issueId}
        isOpen={isOpen}
        onClose={handleCloseModal}
       />
    </div>
  );
};

export default VoteToggle; // Export the main toggle component

