import React, { useState } from "react";
// Assuming Store and Slice paths are correct relative to this component
import { useAppDispatch } from "../../State/Store";
import { createTechnician } from "../../State/Officer/OffTechnicianSlice"; // Adjust path if needed
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  WrenchScrewdriverIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid"; // Import necessary icons

const skillOptions = [
  "POTHOLE",
  "BROKEN_STREETLIGHT",
  "GARBAGE_OVERFLOW",
  "WATER_LEAK",
  "ROAD_DAMAGE",
  "VANDALISM",
  "NOISE_POLLUTION",
  "TRAFFIC_SIGNAL_ISSUE",
  "PUBLIC_TOILET_ISSUE",
  "ILLEGAL_PARKING",
  "STREET_FLOODING", // Corrected typo
];

// Reusable Input Component with Icon (copied for self-containment)
const InputWithIcon = ({ id, name, type, placeholder, icon: Icon, value, onChange, disabled = false, required = false, ...props }) => (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{placeholder}</label> {/* Added label for accessibility */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {Icon && <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
      </div>
      <input
        id={id} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} required={required}
        className={`block w-full rounded-md border-0 py-2.5 ${Icon ? 'pl-10' : 'pl-3'} pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500 ring-gray-200" : ""}`}
        {...props}
      />
    </div>
);


const CreateTechnicianForm = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("jwt");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [],
  });

  // State specific to this component, no changes here
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, skills: selected });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming createTechnician expects { token, data }
    // Dispatch logic remains the same
    dispatch(createTechnician({ token, data: formData }));
    // Reset form after submission
    setFormData({ name: "", email: "", phone: "", skills: [] });
  };

  return (
    // Centered container with a subtle background
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        // Enhanced styling for the form card
        className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border border-gray-100 space-y-6"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
             <UserIcon className="h-8 w-8 mr-3 text-indigo-600"/>
             Create New Technician
        </h2>

        {/* Use InputWithIcon component */}
        <InputWithIcon
          id="name" type="text" name="name" value={formData.name}
          onChange={handleInputChange} placeholder="Technician Name"
          icon={UserIcon} required
        />

        <InputWithIcon
           id="email" type="email" name="email" value={formData.email}
           onChange={handleInputChange} placeholder="Technician Email"
           icon={EnvelopeIcon} required
        />

        <InputWithIcon
           id="phone" type="tel" name="phone" value={formData.phone}
           onChange={handleInputChange} placeholder="Technician Phone"
           icon={PhoneIcon} required
        />

        {/* Skills Section */}
        <div className="space-y-2">
          <label htmlFor="skills-select" className="block text-sm font-medium text-gray-700 flex items-center">
            <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-gray-500"/>
            Assign Skills (Hold Ctrl/Cmd to select multiple)
          </label>
          <select
            id="skills-select"
            multiple
            value={formData.skills}
            onChange={handleSkillChange}
            // Enhanced styling for select multiple
            className="block w-full h-48 rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          >
            {skillOptions.map((skill) => (
              <option key={skill} value={skill} className="p-2 hover:bg-indigo-50">
                {skill.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          {/* Display selected skills as enhanced badges */}
          {formData.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
               <span className="text-xs font-medium text-gray-500 self-center mr-1">Selected:</span>
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  // Enhanced badge styling
                  className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 ring-1 ring-inset ring-indigo-200"
                >
                  {skill.replaceAll("_", " ")}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center items-center rounded-md bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create Technician Account
        </button>
      </form>
    </div>
  );
};

export default CreateTechnicianForm;
