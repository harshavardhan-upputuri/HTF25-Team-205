import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import { fetchMyIssues, createIssue, deleteIssue } from "../../State/IssueSlice";
import { UploadToCloudinary } from "../../Util/UploadToCloudinary";

// Heroicons
import {
  ArrowPathIcon,
  PlusCircleIcon,
  TrashIcon,
  MapPinIcon,
  TagIcon,
  Bars3BottomLeftIcon,
  CameraIcon,
  PaperClipIcon,
  ListBulletIcon,
  HomeIcon,
  BuildingOfficeIcon,
  DevicePhoneMobileIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";

const issueTypes = [
  "POTHOLE", "BROKEN_STREETLIGHT", "GARBAGE_OVERFLOW", "WATER_LEAK",
  "ROAD_DAMAGE", "VANDALISM", "NOISE_POLLUTION", "TRAFFIC_SIGNAL_ISSUE",
  "PUBLIC_TOILET_ISSUE", "ILLEGAL_PARKING", "STREET_FLOODING", "OTHER"
];

// Reusable Input Field
const InputField = ({ id, name, type = "text", placeholder, icon: Icon, value, onChange, required = false, disabled = false, as = "input", rows = 3 }) => (
  <div className="relative w-full">
    <label htmlFor={id} className="sr-only">{placeholder}</label>
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      {Icon && <Icon className="h-5 w-5 text-gray-400" />}
    </div>
    {as === "textarea" ? (
      <textarea
        id={id} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required} disabled={disabled} rows={rows}
        className={`block w-full rounded-md border-0 py-2.5 ${Icon ? "pl-10" : "pl-3"} pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm resize-none ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />
    ) : (
      <input
        id={id} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} disabled={disabled}
        className={`block w-full rounded-md border-0 py-2.5 ${Icon ? "pl-10" : "pl-3"} pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />
    )}
  </div>
);

const CitizenIssues = () => {
  const dispatch = useAppDispatch();
  const { myIssues = [], loading, error } = useAppSelector(state => state.issues);
  const token = localStorage.getItem("jwt");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issueForm, setIssueForm] = useState({
    title: "", description: "", issueType: "", imageUrls: [],
    addressName: "", locality: "", streetAddress: "", city: "",
    state: "", pinCode: "", mobile: "",
    latitude: null,
    longitude: null
  });

  // Fetch user's current location
  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIssueForm(prev => ({ ...prev, latitude, longitude }));
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Could not get your location. Please allow location access or enter address manually.");
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    fetchUserLocation(); // auto-fetch coordinates on mount
    if (token) dispatch(fetchMyIssues(token));
  }, [dispatch, token]);

  // Handle form input change
  const handleChange = e => {
    const { name, value } = e.target;
    setIssueForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleFileChange = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map(file => UploadToCloudinary(file)));
      setIssueForm(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...urls] }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("One or more images failed to upload.");
    } finally {
      e.target.value = null;
    }
  };

  const removeImage = idx => {
    setIssueForm(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== idx) }));
  };

  // Submit new issue
  const handleSubmit = async e => {
    e.preventDefault();
    if (!token || isSubmitting) return;

    if (!issueForm.title || !issueForm.description || !issueForm.issueType) {
      alert("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    dispatch(createIssue({ token, issueData: issueForm }))
      .unwrap()
      .then(() => {
        setIssueForm({
          title: "", description: "", issueType: "", imageUrls: [],
          addressName: "", locality: "", streetAddress: "", city: "",
          state: "", pinCode: "", mobile: "",
          latitude: null, longitude: null
        });
        document.getElementById("file-upload").value = null;
      })
      .catch(err => {
        console.error("Failed to create issue:", err);
        alert(`Failed to create issue: ${err.message || JSON.stringify(err)}`);
      })
      .finally(() => setIsSubmitting(false));
  };

  // Delete issue
  const handleDelete = id => {
    if (!id || !token || loading) return;
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    dispatch(deleteIssue({ token, issueId: id }))
      .unwrap()
      .catch(err => {
        console.error("Failed to delete issue:", err);
        alert(`Failed to delete issue: ${err.message || JSON.stringify(err)}`);
      });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <ListBulletIcon className="h-8 w-8 mr-3 text-indigo-600" />
        Report & Manage My Issues
      </h1>

      {/* Create Issue Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">Report a New Issue</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField id="title" name="title" value={issueForm.title} onChange={handleChange} placeholder="Issue Title" icon={TagIcon} required disabled={isSubmitting} />
          <div className="relative">
            <label htmlFor="issueType" className="sr-only">Select Issue Type</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <TagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select id="issueType" name="issueType" value={issueForm.issueType} onChange={handleChange} required disabled={isSubmitting}
              className="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            >
              <option value="" disabled>Select Issue Type...</option>
              {issueTypes.map(type => <option key={type} value={type}>{type.replace(/_/g, " ")}</option>)}
            </select>
          </div>
        </div>

        <InputField id="description" name="description" value={issueForm.description} onChange={handleChange} placeholder="Description" icon={Bars3BottomLeftIcon} as="textarea" rows={4} required disabled={isSubmitting} />

        {/* Address & Coordinates */}
        <fieldset className="border rounded-lg p-4 pt-2 space-y-4 border-gray-300">
          <legend className="text-sm font-medium text-gray-700 px-2 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-1 text-gray-500" /> Issue Location
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField id="addressName" name="addressName" value={issueForm.addressName} onChange={handleChange} placeholder="Address Label" icon={HomeIcon} disabled={isSubmitting} />
            <InputField id="locality" name="locality" value={issueForm.locality} onChange={handleChange} placeholder="Landmark/Locality" icon={BuildingOfficeIcon} disabled={isSubmitting} />
          </div>
          <InputField id="streetAddress" name="streetAddress" value={issueForm.streetAddress} onChange={handleChange} placeholder="Street Address" icon={MapPinIcon} disabled={isSubmitting} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField id="city" name="city" value={issueForm.city} onChange={handleChange} placeholder="City" icon={BuildingOfficeIcon} disabled={isSubmitting} />
            <InputField id="state" name="state" value={issueForm.state} onChange={handleChange} placeholder="State" icon={BuildingOfficeIcon} disabled={isSubmitting} />
            <InputField id="pinCode" name="pinCode" value={issueForm.pinCode} onChange={handleChange} placeholder="Pin Code" icon={MapPinIcon} disabled={isSubmitting} type="number" />
          </div>
          <InputField id="mobile" name="mobile" value={issueForm.mobile} onChange={handleChange} placeholder="Mobile (Optional)" icon={DevicePhoneMobileIcon} disabled={isSubmitting} type="tel" />

          {/* Latitude & Longitude */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <InputField
              id="latitude"
              name="latitude"
              value={issueForm.latitude !== null ? issueForm.latitude.toFixed(6) : ""}
              placeholder="Latitude"
              disabled={true}
            />
            <InputField
              id="longitude"
              name="longitude"
              value={issueForm.longitude !== null ? issueForm.longitude.toFixed(6) : ""}
              placeholder="Longitude"
              disabled={true}
            />
          </div>

          {/* Button to refresh location */}
          <button
            type="button"
            onClick={fetchUserLocation}
            className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
          >
            Use My Current Location
          </button>
        </fieldset>

        {/* Image Upload */}
        <div className="space-y-2">
          <label htmlFor="file-upload" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-indigo-600 w-fit">
            <CameraIcon className="h-5 w-5" />
            Upload Images (Optional)
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" multiple disabled={isSubmitting} />
          {issueForm.imageUrls.length > 0 && (
            <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg">
              <h3 className="text-xs font-semibold text-gray-600 mb-2 flex items-center">
                <PaperClipIcon className="h-4 w-4 mr-1" /> Attachments ({issueForm.imageUrls.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {issueForm.imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url} alt={`attachment-${idx}`} className="w-24 h-24 object-cover rounded-md border border-gray-200" />
                    <button type="button" onClick={() => removeImage(idx)} disabled={isSubmitting}
                      className="absolute top-0 right-0 m-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                      aria-label="Remove image"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting || loading}
          className={`w-full flex justify-center items-center rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
        >
          {isSubmitting ? <><ArrowPathIcon className="animate-spin h-5 w-5 mr-2" /> Submitting...</> : <><PlusCircleIcon className="h-5 w-5 mr-2" /> Create Issue</>}
        </button>
        {error && !loading && <p className="text-sm text-red-600 text-center mt-2">Error: {JSON.stringify(error)}</p>}
      </form>

      {/* My Issues Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {myIssues.length > 0 ? myIssues.map(issue => (
              <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2">{issue.title}</td>
                <td className="px-4 py-2">{issue.issueType.replace(/_/g, " ")}</td>
                <td className="px-4 py-2">{issue.description}</td>
                <td className="px-4 py-2">{issue.status}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleDelete(issue.id)} disabled={loading}>
                    <TrashIcon className="h-5 w-5 text-red-600" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">No issues reported yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CitizenIssues;
