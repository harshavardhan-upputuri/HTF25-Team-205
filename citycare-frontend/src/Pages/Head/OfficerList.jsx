import React, { useState } from "react";
import {
  UserPlusIcon,
  TrashIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon, // Added for empty/error state
  UsersIcon, // Added for header
} from "@heroicons/react/24/solid"; // Use solid icons

// Reusable Input Component with Icon (copied for self-containment)
const InputWithIcon = ({ id, name, type, placeholder, icon: Icon, value, onChange, disabled = false, required = false, ...props }) => (
    <div className="relative flex-grow"> {/* Added flex-grow */}
      <label htmlFor={id} className="sr-only">{placeholder}</label>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {Icon && <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
      </div>
      <input
        id={id} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} required={required}
        className={`block w-full rounded-md border-0 py-2.5 ${Icon ? 'pl-10' : 'pl-3'} pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500 ring-gray-200" : ""}`}
        {...props}
      />
    </div>
);


const OfficerList = ({ officers = [], loading, onCreate, onDelete, errorMessage = "" }) => { // Default officers to empty array, added errorMessage prop
  const [officerForm, setOfficerForm] = useState({ name: "", email: "", phone: "" });

  const handleChange = e => setOfficerForm({ ...officerForm, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    if (!officerForm.name || !officerForm.email || !officerForm.phone) {
        alert("Please fill in all officer details."); // Basic validation
        return;
    }
    onCreate(officerForm);
    setOfficerForm({ name: "", email: "", phone: "" }); // Reset form
  };

  return (
    // Removed bg-white from the main container to let the parent handle card styling if needed
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <UsersIcon className="h-7 w-7 text-indigo-500" />
        Manage Officers
      </h2>

       {/* Display Error Message */}
        {errorMessage && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
                 <p className="text-sm font-medium text-red-700">{errorMessage}</p>
            </div>
       )}

      {/* Create Officer Form - Improved Layout and Styling */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
        <InputWithIcon
          id="officer-name" name="name" type="text" placeholder="Officer Name"
          icon={UserCircleIcon} value={officerForm.name} onChange={handleChange}
          required disabled={loading}
        />
        <InputWithIcon
          id="officer-email" name="email" type="email" placeholder="Officer Email"
          icon={EnvelopeIcon} value={officerForm.email} onChange={handleChange}
          required disabled={loading}
        />
        <InputWithIcon
          id="officer-phone" name="phone" type="tel" placeholder="Officer Phone"
          icon={PhoneIcon} value={officerForm.phone} onChange={handleChange}
          required disabled={loading}
        />
        <button
            type="submit"
            disabled={loading}
            // Consistent button style
            className="w-full md:w-auto flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 whitespace-nowrap" // Added whitespace-nowrap
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          {loading ? 'Adding...' : 'Add Officer'}
        </button>
      </form>

      {/* Officer Table - Enhanced Styling */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && !officers.length ? ( // Show loading indicator within table body only if officers aren't loaded yet
                <tr>
                    <td colSpan="4" className="text-center py-10">
                        <div className="flex justify-center items-center text-gray-500">
                            <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                            <span>Loading officers...</span>
                        </div>
                    </td>
                </tr>
            ) : officers.length === 0 ? ( // Handle empty state
                <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                         <div className="flex flex-col items-center">
                            <ExclamationTriangleIcon className="h-8 w-8 text-gray-400 mb-2"/>
                            <span>No officers found. Add one using the form above.</span>
                        </div>
                    </td>
                </tr>
            ) : (
              officers.map(o => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{o.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{o.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{o.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                        onClick={() => onDelete(o.id)}
                        disabled={loading} // Disable delete button during general loading
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors p-1 rounded-md hover:bg-red-100"
                        aria-label={`Delete officer ${o.name}`}
                    >
                      <TrashIcon className="h-5 w-5"/>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficerList;
