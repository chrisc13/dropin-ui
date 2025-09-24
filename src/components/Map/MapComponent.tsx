// MapComponent.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import "./MapComponent.css";
import { useState, useRef, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Fix Leaflet's default icon paths for React + TypeScript
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapProps {
  longitude: number;
  latitude: number;
  displayName: string;
  isPreview?: boolean;
}

const RecenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  map.setView([lat, lng], map.getZoom());
  return null;
};

export const MapComponent: React.FC<MapProps> = ({ longitude, latitude, displayName, isPreview }) => {
  const location: [number, number] = [latitude, longitude];

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      if (value.length < 2) return;

      try {
        // 1️⃣ Geocode typed address
        const geoRes = await fetch(
          `${API_BASE_URL}/api/Location/geocode?address=${encodeURIComponent(value)}`
        );
        const geoData = await geoRes.json();

        if (!geoData.lat || !geoData.lng) return;

        const searchLat = parseFloat(geoData.lat);
        const searchLng = parseFloat(geoData.lng);

        // 2️⃣ Fetch nearby events
        const eventsRes = await fetch(
          `${API_BASE_URL}/Event/nearby?maxDistanceMiles=50&latitude=${searchLat}&longitude=${searchLng}`
        );
        const eventsData = await eventsRes.json();

        setSearchResults(eventsData);

      } catch (err) {
        console.error("Search failed", err);
      }
    }, 500); // 500ms debounce
  }, []);

  const handleSearchButton = () => {
    handleSearchChange(searchText);
  };

  return (
    <div className="map-wrapper">
      {!isPreview && (
        <div className="map-search">
          <input
            className="map-search-input"
            type="text"
            placeholder="Search nearby"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button className="map-search-button" onClick={handleSearchButton}>
            Search
          </button>
        </div>
      )}

      

      <MapContainer
        center={location}
        zoom={12}
        className={isPreview ? "map-preview" : "map-full"}
        scrollWheelZoom={!isPreview}
        dragging={!isPreview}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={location}>
          <Popup className="custom-popup">{displayName}</Popup>
        </Marker>

        {/* Nearby events markers */}
        {searchResults.map((event) => (
            <Marker key={event.id} position={[event.latitude, event.longitude]}>
              <Popup className="custom-popup">{event.eventName}</Popup>
            </Marker>
          ))}
        {latitude !== 0 && longitude !== 0 && <RecenterMap lat={latitude} lng={longitude} />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
