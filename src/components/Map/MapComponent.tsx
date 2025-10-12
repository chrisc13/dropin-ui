// MapComponent.tsx
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import "./MapComponent.css";
import { useState, useRef, useCallback, useEffect } from 'react';
import { formatEventDate } from '../Utils/DateUtils';
import { DropEventCard } from '../DropEventCard/DropEventCard';
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Fix Leaflet default icon paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Default marker icon
const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Recenter map component
const RecenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

interface MapProps {
  longitude?: number;
  latitude?: number;
  displayName?: string;
  isPreview?: boolean;
  onSearchFocus?: () => void;
}

export const MapComponent: React.FC<MapProps> = ({
  longitude,
  latitude,
  displayName,
  isPreview,
  onSearchFocus
}) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [radius, setRadius] = useState<number>(25);
  const { user } = useAuth();

  // Initialize user location
   // ✅ Ask user for location explicitly
   useEffect(() => {
    if (latitude && longitude) {
      setUserLocation([latitude, longitude]);
    } else if (navigator.geolocation) {
      // This triggers browser permission prompt
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => {
          console.warn("Geolocation denied:", err.message);
          setUserLocation([33.46, -112.32]); // fallback (Phoenix)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setUserLocation([33.46, -112.32]);
    }
  }, [latitude, longitude]);

  // Perform search
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) return;
    setIsLoading(true);
    try {
      const geoRes = await fetch(`${API_BASE_URL}/api/Location/geocode?address=${encodeURIComponent(query)}`);
      const geoData = await geoRes.json();
      if (!geoData.lat || !geoData.lng) return;

      const searchLat = parseFloat(geoData.lat);
      const searchLng = parseFloat(geoData.lng);
      setUserLocation([searchLat, searchLng]);

      const eventsRes = await fetch(
        `${API_BASE_URL}/Event/nearby?maxDistanceMiles=${radius}&latitude=${searchLat}&longitude=${searchLng}`
      );
      const eventsData = await eventsRes.json();
      setSearchResults(eventsData);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsLoading(false);
    }
  }, [radius]);

  // Debounced search input
  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => performSearch(value), 2500);
  }, [performSearch]);

  const handleSearchButton = () => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    performSearch(searchText);
  };

  // Scroll selected card into view
  useEffect(() => {
    if (!selectedEvent) return;
    const card = document.getElementById(`event-card-${selectedEvent.id}`);
    card?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }, [selectedEvent]);

  if (!userLocation) return <div>Loading map…</div>;

  return (
    <div className="map-wrapper">
      {!isPreview && (
        <div className="map-search">
          <input
            type="text"
            className="map-search-input"
            placeholder="Type to search nearby"
            value={searchText}
            onFocus={onSearchFocus}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button className="map-search-button" onClick={handleSearchButton}>
            Search
          </button>
          {isLoading && <span className="spinner" />}
        </div>
      )}

      <MapContainer
        center={userLocation}
        zoom={isPreview ? 14 : 11}
        className={isPreview ? "map-preview" : "map-full"}
        dragging={!isPreview && window.innerWidth > 720}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {isPreview &&
          <Marker key={displayName} position={[userLocation[0], userLocation[1]]} />
        }

        {searchResults.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            eventHandlers={{ click: () => setSelectedEvent(event) }}
            icon={defaultIcon}
          />
        ))}
          <RecenterMap lat={userLocation[0]} lng={userLocation[1]} />

        {selectedEvent && <RecenterMap lat={selectedEvent.latitude} lng={selectedEvent.longitude} />}

        <div className="map-cards-wrapper">
          {searchResults.map((e, index) => (
            <div
              id={`event-card-${e.id}`}
              key={e.id}
              style={{ "--i": index } as React.CSSProperties}
            >
                <DropEventCard
                dropEvent={e}
                isLoggedIn={!!user}
                isAttending={false}
                selected={selectedEvent?.id === e.id}
              />
            </div>
          ))}
        </div>
      </MapContainer>
    </div>
  );
};

export default MapComponent;

