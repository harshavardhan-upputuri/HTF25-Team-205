import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import {
  fetchTechnicianProfile,
  updateTechnicianProfile,
  updateTechnicianPassword,
  clearTechnicianError,
  clearPasswordSuccessMessage,
} from "../../State/Technician/TechnicianSlice";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  WrenchScrewdriverIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid"; // Import icons

// Reusable Input Component with Icon
const InputWithIcon = ({
  id,
  name,
  type,
  placeholder,
  icon: Icon,
  value,
  onChange,
  disabled = false,
  ...props
}) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      {Icon && <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
    </div>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`block w-full rounded-md border-0 py-2.5 ${Icon ? 'pl-10' : 'pl-3'} pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm ${
        disabled
          ? "cursor-not-allowed bg-gray-100 text-gray-500 ring-gray-200"
          : ""
      }`}
      {...props}
    />
  </div>
);

// Reusable Password Input with Show/Hide Toggle
const PasswordInput = ({ id, name, placeholder, value, onChange, disabled = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                id={id}
                name={name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="block w-full rounded-md border-0 py-2.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                ) : (
                    <EyeIcon className="h-5 w-5" />
                )}
            </button>
        </div>
    );
};


const TechnicianProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { profile, loading, error, updatePasswordSuccessMessage } =
    useAppSelector((state) => state.technician);
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "", // Keep email display but maybe disallow editing
    phone: "",
    skills: "", // Keep as comma-separated string for input
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

   // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    // Fetch only if logged in and profile is not already loaded/being loaded
    if (isLoggedIn && !profile && !loading) {
      dispatch(fetchTechnicianProfile());
    }
  }, [dispatch, profile, isLoggedIn, navigate, loading]);

  // Populate profile form when profile is loaded
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        email: profile.email || "", // Email usually not editable
        phone: profile.phone || "",
        skills: profile.skills ? profile.skills.join(", ") : "", // Join skills array for display/edit
      });
    }
  }, [profile]);

  // Clear errors or success messages on mode change
  useEffect(() => {
    dispatch(clearTechnicianError());
    dispatch(clearPasswordSuccessMessage());
  }, [editMode, passwordMode, dispatch]);

  // Handle form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

   const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };


  const handleUpdateProfile = () => {
    // Basic validation
    if (!profileData.name || !profileData.phone) {
        alert("Name and Phone cannot be empty.");
        return;
    }

    const updatedProfilePayload = {
      // Send only fields that can be updated
      name: profileData.name,
      phone: profileData.phone,
      // Convert skills string back to array, filter empty strings
      skills: profileData.skills.split(",").map((s) => s.trim()).filter(s => s),
    };

    // Assuming updateTechnicianProfile expects the profile data directly
    dispatch(updateTechnicianProfile(updatedProfilePayload))
      .unwrap()
      .then(() => {
          setEditMode(false);
          // Profile state in Redux will be updated by the slice
      })
      .catch((err) => {
          console.error("Profile update failed:", err);
          // Error is handled by the slice and displayed via `error` selector
      });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
         alert("Please fill in all password fields.");
         return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    dispatch(
      updateTechnicianPassword({
        // No need for ID if backend gets it from JWT
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
    )
      .unwrap()
      .then(() => {
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Clear fields
        setPasswordMode(false); // Close password section on success
        // Success message is handled by the slice state
         setTimeout(() => dispatch(clearPasswordSuccessMessage()), 3000); // Clear message after 3s
      })
      .catch((err) => {
          console.error("Password update failed:", err);
          // Error is handled by the slice
      });
  };

  // Render Loading state
   if (loading && !profile) {
       return (
           <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-gray-600">Loading profile...</p>
                {/* Add a spinner here if desired */}
           </div>
       );
   }

   // Render error if profile fetch failed (and not logged out)
   if (!profile && !loading && error && isLoggedIn) {
       return (
          <div className="flex flex-col justify-center items-center h-screen text-center p-4">
              <p className="text-xl text-red-600 mb-4">Failed to load profile.</p>
              <p className="text-sm text-gray-500 mb-4">
                  Error: {typeof error === 'object' ? JSON.stringify(error) : String(error)}
               </p>
              <button
                onClick={() => dispatch(fetchTechnicianProfile())}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
              >
                Retry
              </button>
          </div>
       );
   }

   // Should not render if not logged in (due to redirect effect)
   if (!isLoggedIn || !profile) {
       return null; // Or a minimal placeholder
   }


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
       <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <UserCircleIcon className="h-8 w-8 mr-3 text-indigo-600"/>
                Technician Profile
            </h1>
            {!editMode && !passwordMode && (
                <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition duration-150 ease-in-out"
                >
                    <PencilIcon className="h-4 w-4 mr-2"/>
                    Edit Profile
                </button>
            )}
        </div>

        {/* Display General Errors */}
        {error && (editMode || passwordMode) && (
            <div className="mb-6 rounded-md bg-red-100 p-4 border border-red-200">
                <p className="text-sm font-medium text-red-700">
                    Error: {typeof error === 'object' && error !== null ? error.message || JSON.stringify(error) : String(error)}
                </p>
            </div>
        )}

        {/* Display Password Success Message */}
         {updatePasswordSuccessMessage && !passwordMode && (
            <div className="mb-6 rounded-md bg-green-100 p-4 border border-green-200">
                <p className="text-sm font-medium text-green-700">
                    {updatePasswordSuccessMessage}
                </p>
            </div>
        )}

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">Personal Information</h2>
        <div className="space-y-4">
          <InputWithIcon
            id="name" name="name" type="text" placeholder="Full Name"
            icon={UserCircleIcon} value={profileData.name}
            onChange={handleProfileChange} disabled={!editMode} required
          />
          <InputWithIcon
            id="email" name="email" type="email" placeholder="Email"
            icon={EnvelopeIcon} value={profileData.email}
            disabled // Email typically not editable
          />
          <InputWithIcon
            id="phone" name="phone" type="tel" placeholder="Phone Number"
            icon={PhoneIcon} value={profileData.phone}
            onChange={handleProfileChange} disabled={!editMode} required
          />
          <InputWithIcon
            id="skills" name="skills" type="text" placeholder="Skills (e.g., Plumbing, Electrical, HVAC)"
            icon={WrenchScrewdriverIcon} value={profileData.skills}
            onChange={handleProfileChange} disabled={!editMode}
          />
           <p className="text-xs text-gray-500 pl-1">Enter skills separated by commas.</p>
        </div>

        {editMode && (
          <div className="flex space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="flex items-center justify-center rounded-md bg-green-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-70"
            >
              <CheckIcon className="h-4 w-4 mr-2"/>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => {
                  setEditMode(false);
                  // Reset local state to match Redux state on cancel
                  if (profile) {
                     setProfileData({
                          name: profile.name || "",
                          email: profile.email || "",
                          phone: profile.phone || "",
                          skills: profile.skills ? profile.skills.join(", ") : "",
                     });
                  }
                   dispatch(clearTechnicianError());
              }}
              disabled={loading}
              className="flex items-center justify-center rounded-md bg-gray-400 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            >
              <XMarkIcon className="h-4 w-4 mr-2"/>
              Cancel
            </button>
          </div>
        )}
      </div>


      {/* Password Change Section */}
        {!editMode && ( // Only show change password button if not editing profile
             <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-3">Security</h2>
                {!passwordMode ? (
                     <button
                        onClick={() => setPasswordMode(true)}
                        className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition duration-150 ease-in-out"
                    >
                         <KeyIcon className="h-4 w-4 mr-2"/>
                        Change Password
                    </button>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                         <PasswordInput
                             id="oldPassword"
                             name="oldPassword"
                             placeholder="Current Password"
                             value={passwordData.oldPassword}
                             onChange={handlePasswordChange}
                             disabled={loading}
                         />
                         <PasswordInput
                             id="newPassword"
                             name="newPassword"
                             placeholder="New Password"
                             value={passwordData.newPassword}
                             onChange={handlePasswordChange}
                             disabled={loading}
                         />
                         <PasswordInput
                             id="confirmPassword"
                             name="confirmPassword"
                             placeholder="Confirm New Password"
                             value={passwordData.confirmPassword}
                             onChange={handlePasswordChange}
                             disabled={loading}
                         />

                        <div className="flex space-x-3 pt-4 border-t">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                            >
                                <CheckIcon className="h-4 w-4 mr-2"/>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                             <button
                                type="button" // Important: type="button" to prevent form submission
                                onClick={() => {
                                    setPasswordMode(false);
                                    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Clear fields on cancel
                                     dispatch(clearTechnicianError()); // Clear potential errors
                                }}
                                disabled={loading}
                                className="flex items-center justify-center rounded-md bg-gray-400 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                            >
                                <XMarkIcon className="h-4 w-4 mr-2"/>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        )}
    </div>
  );
};

export default TechnicianProfile;