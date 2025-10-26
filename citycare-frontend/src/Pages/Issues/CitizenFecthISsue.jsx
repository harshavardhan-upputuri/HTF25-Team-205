import React, { useEffect } from "react";
import { ArrowPathIcon, ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/24/solid";

import { useAppDispatch, useAppSelector } from "../../State/Store";
import { fetchMyIssues, deleteIssue } from "../../State/IssueSlice";
import VoteButtons from "../VoteButtons";

const CitizenFetchIssue = () => {
    const dispatch = useAppDispatch();
    const { myIssues = [], loading, error, fetched } = useAppSelector(state => state.issues); // fetched flag to prevent infinite fetch
    const token = localStorage.getItem("jwt");

    // Fetch issues only once
    useEffect(() => {
        if (token && !fetched) {
            dispatch(fetchMyIssues(token));
        }
    }, [dispatch, token, fetched]);

    const handleDelete = (id) => {
        const isValidId = id !== null && id !== undefined && !isNaN(Number(id));

        if (!isValidId || !token || loading) {
            alert("Cannot delete issue: Invalid issue ID or action blocked.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this issue?")) {
            dispatch(deleteIssue({ token, issueId: Number(id) }))
                .unwrap()
                .catch(err => alert(`Failed to delete issue: ${err.message || JSON.stringify(err)}`));
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">My Reported Issues</h2>

            {/* Loading */}
            {loading && !myIssues.length && (
                <div className="flex justify-center items-center py-10 text-gray-500">
                    <ArrowPathIcon className="animate-spin h-6 w-6 mr-3" /> Loading your issues...
                </div>
            )}

            {/* Error */}
            {error && !myIssues.length && (
                <div className="text-center py-10 text-red-600">
                    <ExclamationTriangleIcon className="mx-auto h-8 w-8 text-red-400 mb-2" />
                    Failed to load issues: {typeof error === "object" ? JSON.stringify(error) : String(error)}
                </div>
            )}

            {/* Empty */}
            {!loading && myIssues.length === 0 && !error && (
                <div className="text-center py-10 text-gray-500">
                    <ExclamationTriangleIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    You haven't reported any issues yet.
                </div>
            )}

            {/* Table */}
            {myIssues.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {myIssues.map(issue => (
                                <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{issue.issueType?.replace(/_/g, " ")}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell max-w-xs truncate" title={issue.description}>{issue.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${issue.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                                                issue.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {issue.status?.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="border px-2 py-1">
                                        <VoteButtons issueId={issue.id} token={token} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(issue.id)}
                                            disabled={loading}
                                            className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors p-1 rounded-md hover:bg-red-100"
                                            aria-label={`Delete issue ${issue.title}`}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CitizenFetchIssue;
