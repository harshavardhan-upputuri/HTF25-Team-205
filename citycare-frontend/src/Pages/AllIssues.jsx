// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import VoteToggle from "./VoteButtons"; // import your new vote buttons component

// const ISSUE_API = "http://localhost:8083/api/issues/all-public";

// const AllIssues = () => {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortOption, setSortOption] = useState("none"); // none | upvotes | downvotes

//   useEffect(() => {
//     const fetchIssues = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(ISSUE_API);
//         setIssues(res.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load public issues");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchIssues();
//   }, []);

//   // Compute votes dynamically from the votes array
//   const issuesWithVotes = useMemo(() => {
//     return issues.map(issue => ({
//       ...issue,
//       upvotes: issue.votes.filter(v => v.upvote === true).length,
//       downvotes: issue.votes.filter(v => v.upvote === false).length,
//     }));
//   }, [issues]);

//   // Sorting logic
//   const sortedIssues = useMemo(() => {
//     const arr = [...issuesWithVotes];
//     if (sortOption === "upvotes") return arr.sort((a, b) => b.upvotes - a.upvotes);
//     if (sortOption === "downvotes") return arr.sort((a, b) => b.downvotes - a.downvotes);
//     return arr;
//   }, [issuesWithVotes, sortOption]);

//   if (loading) return <div className="text-center mt-10">Loading issues...</div>;
//   if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

//   return (
//     <div className="p-4 max-w-6xl mx-auto space-y-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">All Public Issues</h1>
//         <select
//           value={sortOption}
//           onChange={e => setSortOption(e.target.value)}
//           className="px-3 py-1 border rounded-lg text-sm"
//         >
//           <option value="none">Default</option>
//           <option value="upvotes">Sort by Upvotes</option>
//           <option value="downvotes">Sort by Downvotes</option>
//         </select>
//       </div>

//       {sortedIssues.length === 0 && <p className="text-center text-gray-500">No public issues found.</p>}

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {sortedIssues.map(issue => (
//           <div key={issue.id} className="bg-white rounded-lg shadow-md border overflow-hidden">
//             {issue.attachments?.length > 0 && (
//               <div className="h-48 overflow-hidden">
//                 <img
//                   src={issue.attachments[0].imageUrl}
//                   alt="Issue Attachment"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//             <div className="p-4 space-y-2">
//               <h2 className="text-lg font-semibold">{issue.title}</h2>
//               <p className="text-gray-600 text-sm">{issue.description}</p>
//               {issue.address && (
//                 <div className="text-xs text-gray-500 mt-1">
//                   <p>{issue.address.name}</p>
//                   <p>{issue.address.streetAddress}, {issue.address.locality}</p>
//                   <p>{issue.address.city} - {issue.address.pinCode}</p>
//                   <p>{issue.address.state}</p>
//                   <p>📞 {issue.address.mobile}</p>
//                 </div>
//               )}
//               <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
//                 {issue.issueType}
//               </span>

//               {/* --- Replace static vote buttons with VoteToggle --- */}
//               <VoteToggle issueId={issue.id} />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllIssues;


// AllIssues.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import VoteToggle from "./VoteButtons";
import IssueMap from "./IssueMap";

const ISSUE_API = "http://localhost:8083/api/issues/all-public";

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null); // selected issue for map
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("none");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await axios.get(ISSUE_API);
        setIssues(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load public issues");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const issuesWithVotes = useMemo(() => {
    return issues.map(issue => ({
      ...issue,
      upvotes: issue.votes.filter(v => v.upvote === true).length,
      downvotes: issue.votes.filter(v => v.upvote === false).length,
    }));
  }, [issues]);

  const sortedIssues = useMemo(() => {
    const arr = [...issuesWithVotes];
    if (sortOption === "upvotes") return arr.sort((a, b) => b.upvotes - a.upvotes);
    if (sortOption === "downvotes") return arr.sort((a, b) => b.downvotes - a.downvotes);
    return arr;
  }, [issuesWithVotes, sortOption]);

  if (loading) return <div className="text-center mt-10">Loading issues...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Public Issues</h1>
        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className="px-3 py-1 border rounded-lg text-sm"
        >
          <option value="none">Default</option>
          <option value="upvotes">Sort by Upvotes</option>
          <option value="downvotes">Sort by Downvotes</option>
        </select>
      </div>

      {selectedIssue ? (
        <div>
          <button
            onClick={() => setSelectedIssue(null)}
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Back to Issues
          </button>
          <IssueMap
            latitude={selectedIssue.address.latitude}
            longitude={selectedIssue.address.longitude}
            title={selectedIssue.title}
            address={selectedIssue.address}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedIssues.map(issue => (
            <div
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              className="cursor-pointer bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition"
            >
              {issue.attachments?.length > 0 && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={issue.attachments[0].imageUrl}
                    alt="Issue Attachment"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold">{issue.title}</h2>
                <p className="text-gray-600 text-sm">{issue.description}</p>
                {issue.address && (
                  <div className="text-xs text-gray-500 mt-1">
                    <p>{issue.address.name}</p>
                    <p>{issue.address.streetAddress}, {issue.address.locality}</p>
                    <p>{issue.address.city} - {issue.address.pinCode}</p>
                    <p>{issue.address.state}</p>
                    <p>📞 {issue.address.mobile}</p>
                  </div>
                )}
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {issue.issueType}
                </span>
                <VoteToggle issueId={issue.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllIssues;
