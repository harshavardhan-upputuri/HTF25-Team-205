import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const IssueMap = ({ latitude, longitude, title, address }) => {
  if (!latitude || !longitude) return <div>No coordinates available for this issue</div>;

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={16}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          <strong>{title}</strong>
          <br />
          {address?.streetAddress}, {address?.locality}, {address?.city}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default IssueMap;
