import React, { useState, useEffect } from "react";
import {
  KeyIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid"; // Import necessary icons

// Reusable Password Input with Show/Hide Toggle (copied for self-containment)
const PasswordInput = ({ id, name, placeholder, value, onChange, disabled = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
            <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 mb-1">
                {placeholder}
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 top-7 flex items-center pl-3.5">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                id={id} name={name} type={showPassword ? "text" : "password"} placeholder={`Enter ${placeholder.toLowerCase()}`} value={value} onChange={onChange} disabled={disabled}
                className={`block w-full rounded-lg border-0 py-2.5 pl-11 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500 ring-gray-200" : ""}`}
                required
            />
            <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-7 flex items-center pr-3.5 text-gray-400 hover:text-gray-600" // Adjusted top-7
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
        </div>
    );
};


// PasswordForm component with enhanced UI
const PasswordForm = ({ onUpdate, isLoading = false, successMessage = "", errorMessage = "" }) => {
  // State remains the same
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Added confirmPassword state

  const handleChange = e => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!"); // Simple validation
      return;
    }
    // Pass only old and new password to the update function
    onUpdate({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
    // Don't clear form here, let the parent/slice handle state reset on success if needed
  };

   // Clear form when success message appears (indicates successful update)
   useEffect(() => {
     if (successMessage) {
       setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
     }
   }, [successMessage]);

  return (
    // Use consistent container styling
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-100 space-y-6 w-full max-w-lg mx-auto" // Added max-width and centering
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 flex items-center justify-center gap-2">
        <KeyIcon className="h-7 w-7 text-indigo-500" />
        Change Password
      </h2>

      {/* Display Success/Error Messages */}
      {successMessage && !isLoading && (
            <div className="rounded-md bg-green-50 p-4 border border-green-200">
                <p className="text-sm font-medium text-green-700">{successMessage}</p>
            </div>
      )}
      {errorMessage && !isLoading && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
                 <p className="text-sm font-medium text-red-700">{errorMessage}</p>
            </div>
       )}


      {/* Use PasswordInput component */}
      <PasswordInput
        id="oldPassword"
        name="oldPassword"
        value={passwordData.oldPassword}
        onChange={handleChange}
        placeholder="Current Password"
        disabled={isLoading}
      />
      <PasswordInput
        id="newPassword"
        name="newPassword"
        value={passwordData.newPassword}
        onChange={handleChange}
        placeholder="New Password"
        disabled={isLoading}
      />
       <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        value={passwordData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm New Password"
        disabled={isLoading}
      />

      {/* Enhanced button with loading state */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center items-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
          isLoading
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'
        }`}
      >
        {isLoading ? (
          <>
            <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
            Updating Password...
          </>
        ) : (
          <>
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Update Password
          </>
        )}
      </button>
    </form>
  );
};

export default PasswordForm;
