import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import { fetchAllIssues, assignTechnicians } from "../../State/IssueSlice";
import { fetchTechnicians } from "../../State/Officer/OffTechnicianSlice";

const OfficerIssues = () => {
  const dispatch = useAppDispatch();
  const { issues = [], loading, error } = useAppSelector(state => state.issues);
  const { technicians = [] } = useAppSelector(state => state.offtechnician);
  const token = localStorage.getItem("jwt");

  const [selectedTechs, setSelectedTechs] = useState({}); // { issueId: [techIds] }
  const [sortOption, setSortOption] = useState("none"); // none | upvotes | downvotes

  useEffect(() => {
    if (token) {
      dispatch(fetchAllIssues(token));
      dispatch(fetchTechnicians(token));
    }
  }, [dispatch, token]);

  const handleAssign = (issueId) => {
    const techIds = selectedTechs[issueId] || [];
    if (!techIds.length) return alert("Select at least one technician.");
    dispatch(assignTechnicians({ token, issueId, techIds }));
  };

  const handleTechSelect = (issueId, techId) => {
    setSelectedTechs(prev => {
      const current = prev[issueId] || [];
      return {
        ...prev,
        [issueId]: current.includes(techId)
          ? current.filter(id => id !== techId)
          : [...current, techId],
      };
    });
  };

  // Compute vote counts
  const issuesWithVotes = useMemo(() => {
    return issues.map(issue => ({
      ...issue,
      upvotes: issue.votes?.filter(v => v.upvote === true).length || 0,
      downvotes: issue.votes?.filter(v => v.upvote === false).length || 0,
    }));
  }, [issues]);

  // Sorting logic
  const sortedIssues = useMemo(() => {
    const arr = [...issuesWithVotes];
    if (sortOption === "upvotes") return arr.sort((a, b) => b.upvotes - a.upvotes);
    if (sortOption === "downvotes") return arr.sort((a, b) => b.downvotes - a.downvotes);
    return arr;
  }, [issuesWithVotes, sortOption]);

  if (loading) return <div className="text-center mt-10">Loading issues...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">All Issues (Officer View)</h1>

      <div className="mb-4 flex items-center gap-2">
        <span>Sort by:</span>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className="px-2 py-1 border rounded text-sm"
        >
          <option value="none">Default</option>
          <option value="upvotes">Upvotes</option>
          <option value="downvotes">Downvotes</option>
        </select>
      </div>

      <table className="min-w-full border rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Location</th>
            <th className="border px-2 py-1">Votes</th>
            <th className="border px-2 py-1">Assigned / Assign Technicians</th>
          </tr>
        </thead>
        <tbody>
          {sortedIssues.length > 0 ? sortedIssues.map(issue => (
            <tr key={issue.id} className="hover:bg-gray-100">
              <td className="border px-2 py-1">{issue.title}</td>
              <td className="border px-2 py-1">{issue.issueType.replace(/_/g, " ")}</td>
              <td className="border px-2 py-1">{issue.description}</td>
              <td className="border px-2 py-1 font-semibold">{issue.status}</td>
              <td className="border px-2 py-1">
                {issue.address?.streetAddress}, {issue.address?.city}, {issue.address?.state} - {issue.address?.pinCode}
              </td>
              <td className="border px-2 py-1 font-medium flex flex-wrap gap-2">
                <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm">
                  👍 {issue.upvotes}
                </span>
                <span className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-sm">
                  👎 {issue.downvotes}
                </span>
              </td>

              <td className="border px-2 py-1 space-y-1">
                {issue.assignedTechnicians?.length > 0 ? (
                  <ul className="text-sm">
                    {issue.assignedTechnicians.map(t => (
                      <li key={t.id} className="font-medium">{t.name}</li>
                    ))}
                  </ul>
                ) : (
                  <>
                    {technicians.length > 0 ? (
                      <>
                        {technicians.map(t => (
                          <label key={t.id} className="inline-flex items-center gap-1 mr-2">
                            <input
                              type="checkbox"
                              checked={(selectedTechs[issue.id] || []).includes(t.id)}
                              onChange={() => handleTechSelect(issue.id, t.id)}
                              className="rounded"
                            />
                            {t.name}
                          </label>
                        ))}
                        <button
                          onClick={() => handleAssign(issue.id)}
                          className="ml-2 px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                        >
                          Assign
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No technicians available</p>
                    )}
                  </>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                Nothing found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OfficerIssues;
