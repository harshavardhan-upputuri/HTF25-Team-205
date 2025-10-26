import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import { fetchAssignedIssues, updateStatus } from "../../State/IssueSlice";

const TechnicianIssues = () => {
  const dispatch = useAppDispatch();
  const { assignedIssues = [], loading, error, statusMessage } = useAppSelector(
    (state) => state.issues
  );
  const token = localStorage.getItem("jwt");

  const [sortByVotes, setSortByVotes] = useState(false);

  useEffect(() => {
    if (token) dispatch(fetchAssignedIssues(token));
  }, [dispatch, token]);

  const handleStatusChange = (issueId, status) => {
    if (window.confirm(`Change status to ${status}?`)) {
      dispatch(updateStatus({ token, issueId, status }));
    }
  };

  const getStatusBadge = (status) => {
    const colorMap = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-300",
      RESOLVED: "bg-green-100 text-green-800 border-green-300",
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold border rounded-full ${colorMap[status]}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  // Sort issues by number of upvotes
  const sortedIssues = [...assignedIssues].sort((a, b) => {
    const votesA = a.votes ? a.votes.filter(v => v.upvote).length : 0;
    const votesB = b.votes ? b.votes.filter(v => v.upvote).length : 0;
    return sortByVotes ? votesB - votesA : 0;
  });

  return (
    <div className="p-6 max-w-8xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-xl shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-wide">
          My Assigned Issues
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm bg-white/20 px-3 py-1 rounded-lg">
            Total: {assignedIssues.length}
          </span>
          <button
            onClick={() => setSortByVotes(!sortByVotes)}
            className="text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition"
          >
            {sortByVotes ? "Sorted by Votes" : "Sort by Votes"}
          </button>
        </div>
      </div>

      {/* Success / Error Message */}
      {statusMessage && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-lg">
          ✅ {statusMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-600">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm font-medium">Loading your issues...</p>
        </div>
      ) : sortedIssues.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Votes</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedIssues.map((issue) => (
                <tr
                  key={issue.id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {issue.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{issue.issueType}</td>
                  <td className="px-4 py-3 text-gray-600">{issue.description}</td>
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {issue.votes ? issue.votes.filter(v => v.upvote).length : 0} 👍
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(issue.status)}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    {["PENDING", "IN_PROGRESS", "RESOLVED"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(issue.id, status)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md text-white shadow-sm transition-transform transform hover:scale-105 ${
                          status === "PENDING"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : status === "IN_PROGRESS"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="text-5xl mb-2">🧾</div>
          <p className="text-lg font-medium">No Assigned Issues Found</p>
          <p className="text-sm text-gray-400">
            You’ll see your issues here once assigned by the officer.
          </p>
        </div>
      )}
    </div>
  );
};

export default TechnicianIssues;
