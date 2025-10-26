import React, { useState, useEffect } from "react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowPathIcon // Added for loading state
} from "@heroicons/react/24/solid";

// Reusable Input Component with Icon (Slightly refined focus)
const InputWithIcon = ({ id, name, type, placeholder, icon: Icon, value, onChange, disabled = false, required = false, ...props }) => (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 mb-1">
        {placeholder}
      </label>
      <div className="pointer-events-none absolute inset-y-0 left-0 top-7 flex items-center pl-3.5"> {/* Fine-tuned position */}
        {Icon && <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
      </div>
      <input
        id={id} name={name} type={type} placeholder={`Enter ${placeholder.toLowerCase()}`} value={value} onChange={onChange} disabled={disabled} required={required}
        className={`block w-full rounded-lg border-0 py-2.5 ${Icon ? 'pl-11' : 'pl-3.5'} pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500 ring-gray-200" : ""}`}
        {...props}
      />
    </div>
);

// ProfileForm component with further enhanced UI
const ProfileForm = ({ headInfo, onUpdate, isLoading = false }) => { // Added isLoading prop for button state
  const [profileData, setProfileData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (headInfo) {
        setProfileData({
            name: headInfo.name || "",
            email: headInfo.email || "",
            phone: headInfo.phone || ""
        });
    }
  }, [headInfo]);

  const handleChange = e => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handleSubmit = e => { e.preventDefault(); onUpdate(profileData); };

  return (
     // Add a subtle background to the page area
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10 px-4">
        <form
            onSubmit={handleSubmit}
            // More refined form container: softer shadow, slightly more padding
            className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-100 space-y-6 w-full max-w-lg" // Consistent max-width
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 flex items-center justify-center gap-2"> {/* Adjusted font-weight */}
            <UserCircleIcon className="h-7 w-7 text-indigo-500"/>
            Profile Information
          </h2>

          <InputWithIcon
            id="profile-name"
            name="name"
            type="text"
            value={profileData.name}
            onChange={handleChange}
            placeholder="Name"
            icon={UserCircleIcon}
            required
            disabled={isLoading} // Disable input while loading
          />
          <InputWithIcon
            id="profile-email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleChange}
            placeholder="Email"
            icon={EnvelopeIcon}
            required
            disabled={true} // Explicitly disable email
          />
           <p className="-mt-4 text-xs text-gray-500 pl-1">Email cannot be changed.</p> {/* Info text for email */}

          <InputWithIcon
            id="profile-phone"
            name="phone"
            type="tel"
            value={profileData.phone}
            onChange={handleChange}
            placeholder="Phone"
            icon={PhoneIcon}
            required
            disabled={isLoading} // Disable input while loading
          />

          {/* Enhanced button with loading state */}
          <button
            type="submit"
            disabled={isLoading} // Disable button when loading
            className={`w-full flex justify-center items-center rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              isLoading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Update Profile
              </>
            )}
          </button>
        </form>
    </div>
  );
};

export default ProfileForm;

