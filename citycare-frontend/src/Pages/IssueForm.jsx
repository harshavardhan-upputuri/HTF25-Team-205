import { useState } from "react";

const IssueForm = ({ onSubmit }) => {
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [loadingLocation, setLoadingLocation] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoadingLocation(false);
      },
      (error) => {
        console.error(error);
        alert("Could not get your location. Please allow location access.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coords.latitude || !coords.longitude) {
      alert("Please fetch your location before submitting.");
      return;
    }

    const formData = new FormData(e.target); // your existing form data
    const data = {
      ...Object.fromEntries(formData.entries()),
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    onSubmit(data); // send to backend
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Existing form fields */}
      <input type="text" name="title" placeholder="Issue Title" className="input" required />
      <textarea name="description" placeholder="Issue Description" className="input" required />

      {/* Geo-tag Button */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={getLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loadingLocation ? "Fetching..." : "Get My Location"}
        </button>
        {coords.latitude && coords.longitude && (
          <span className="text-sm text-gray-700">
            Lat: {coords.latitude.toFixed(5)}, Lng: {coords.longitude.toFixed(5)}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Report Issue
      </button>
    </form>
  );
};

export default IssueForm;
