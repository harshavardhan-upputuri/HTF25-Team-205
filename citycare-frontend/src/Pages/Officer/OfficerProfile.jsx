import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import {
  fetchOfficerProfile,
  updateOfficerProfile,
  updateOfficerPassword,
  clearPasswordMessage,
} from "../../State/Officer/OfficerSlice";

const OfficerProfile = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error, passwordMessage } = useAppSelector(
    (state) => state.officer
  );
  const  token =localStorage.getItem("jwt");

  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch officer profile when component mounts
  useEffect(() => {
    if (!profile && token) {
      dispatch(fetchOfficerProfile(token));
    } else if (profile) {
      setProfileData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, dispatch, token]);

  // Handle profile update
  const handleProfileUpdate = () => {
    if (!profileData.name || !profileData.email || !profileData.phone) {
      alert("All fields are required!");
      return;
    }

    dispatch(updateOfficerProfile({ token, data: profileData }))
      .unwrap()
      .then(() => {
        alert("Profile updated successfully!");
        setEditMode(false);
      })
      .catch((err) => alert("Failed to update profile: " + err));
  };

  // Handle password update
  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    dispatch(
      updateOfficerPassword({
        token,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
    )
      .unwrap()
      .then(() => {
        alert("Password updated successfully!");
        setPasswordMode(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        dispatch(clearPasswordMessage());
      })
      .catch((err) => alert("Failed to update password: " + err));
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  if (!profile)
    return (
      <div className="text-center p-6">
        <p>No profile data found. Please log in again.</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6 max-w-lg bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Officer Profile
      </h1>

      {editMode ? (
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
            placeholder="Name"
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            placeholder="Email"
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            name="phone"
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
            placeholder="Phone"
            className="w-full border px-3 py-2 rounded-md"
          />
          <div className="flex justify-between">
            <button
              onClick={handleProfileUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Phone:</strong> {profile.phone}
          </p>
          <p>
            <strong>Role:</strong> {profile.role.replace("ROLE_", "")}
          </p>

          <button
            onClick={() => setEditMode(true)}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Edit Profile
          </button>
        </div>
      )}

      {passwordMode && (
        <div className="space-y-4 mt-6 border-t pt-4">
          <h2 className="font-semibold text-lg">Change Password</h2>
          <input
            type="password"
            value={passwordData.oldPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, oldPassword: e.target.value })
            }
            placeholder="Old Password"
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            placeholder="New Password"
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
            placeholder="Confirm Password"
            className="w-full border px-3 py-2 rounded-md"
          />
          {passwordMessage && (
            <p className="text-green-600">{passwordMessage}</p>
          )}
          <div className="flex justify-between">
            <button
              onClick={handlePasswordUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Update Password
            </button>
            <button
              onClick={() => setPasswordMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setPasswordMode(!passwordMode)}
        className="mt-4 w-full bg-yellow-500 text-white px-4 py-2 rounded-md"
      >
        {passwordMode ? "Hide Password Section" : "Change Password"}
      </button>
    </div>
  );
};

export default OfficerProfile;
