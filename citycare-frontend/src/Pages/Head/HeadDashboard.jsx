import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import { fetchHead, fetchOfficers, updateHead, updatePassword, createOfficer, deleteOfficer } from "../../State/Head/HeadSlice";
import ProfileForm from "./ProfileForm.jsx";
import PasswordForm from "./PasswordForm.jsx";
import OfficerList from "./OfficerList.jsx";
import {
  UserCircleIcon,
  KeyIcon,
  UsersIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

const HeadDashboard = () => {
  const dispatch = useAppDispatch();
  const { headInfo, officers, loading, error, passwordMessage } = useAppSelector(state => state.head);

  const [selectedFeature, setSelectedFeature] = useState("profile");

  // Fetch data on mount
  useEffect(() => {
    if (!headInfo && !loading) dispatch(fetchHead());
    if ((!officers || officers.length === 0) && !loading) dispatch(fetchOfficers());
  }, [dispatch, headInfo, officers, loading]);

  // Sidebar button component
  const SidebarButton = ({ featureName, currentFeature, setFeature, icon: Icon, label }) => (
    <button
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out ${
        currentFeature === featureName
        ? "bg-indigo-600 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
      onClick={() => setFeature(featureName)}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  // Show loading page if both headInfo and officers missing
  if (loading && !headInfo && (!officers || officers.length === 0)) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <ArrowPathIcon className="animate-spin h-8 w-8 text-indigo-600 mr-3"/>
        <p className="text-lg text-gray-700">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-4 border-r border-gray-200">
        <div className="px-2 py-4 mb-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Head Dashboard</h1>
          {headInfo && <p className="text-xs text-gray-500 text-center mt-1">Welcome, {headInfo.name}</p>}
        </div>
        <nav className="flex-1 space-y-3">
          <SidebarButton featureName="profile" currentFeature={selectedFeature} setFeature={setSelectedFeature} icon={UserCircleIcon} label="My Profile"/>
          <SidebarButton featureName="password" currentFeature={selectedFeature} setFeature={setSelectedFeature} icon={KeyIcon} label="Change Password"/>
          <SidebarButton featureName="officers" currentFeature={selectedFeature} setFeature={setSelectedFeature} icon={UsersIcon} label="Manage Officers"/>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {error && (
          <div className="mb-6 rounded-md bg-red-100 p-4 border border-red-200 shadow-sm">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3"/>
              <p className="text-sm font-medium text-red-700">
                Error: {typeof error === 'object' && error !== null ? error.message || JSON.stringify(error) : String(error)}
              </p>
            </div>
          </div>
        )}

        {passwordMessage && selectedFeature !== 'password' && (
          <div className="mb-6 rounded-md bg-green-100 p-4 border border-green-200 shadow-sm">
            <p className="text-sm font-medium text-green-700">{passwordMessage}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
          {selectedFeature === "profile" && headInfo && (
            <ProfileForm
              headInfo={headInfo}
              isLoading={loading && selectedFeature === "profile"}
              onUpdate={(data) => dispatch(updateHead(data)).unwrap().catch(console.error)}
            />
          )}

          {selectedFeature === "password" && (
            <PasswordForm
              isLoading={loading && selectedFeature === "password"}
              onUpdate={(data) => dispatch(updatePassword(data)).unwrap().catch(console.error)}
              successMessage={passwordMessage}
              errorMessage={error && selectedFeature === 'password' ? (typeof error === 'object' ? JSON.stringify(error) : String(error)) : null}
            />
          )}

          {selectedFeature === "officers" && (
            <OfficerList
              officers={officers || []}
              loading={loading && selectedFeature === "officers"}
              onCreate={(data) => dispatch(createOfficer(data)).unwrap().catch(console.error)}
              onDelete={(id) => {
                if (window.confirm("Are you sure you want to delete this officer?")) {
                  dispatch(deleteOfficer(id)).unwrap().catch(console.error);
                }
              }}
              errorMessage={error && selectedFeature === 'officers' ? (typeof error === 'object' ? JSON.stringify(error) : String(error)) : null}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default HeadDashboard;
