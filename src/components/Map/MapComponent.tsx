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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  );
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [radius, setRadius] = useState<number>(25);
  const { user } = useAuth();

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };

          // Save in React state
          setUserLocation([coords.latitude, coords.longitude]);

          // Save in localStorage for reuse later
          localStorage.setItem("userLocation", JSON.stringify(coords));
        },
        (err) => {
          console.warn("Geolocation denied:", err.message);

          // fallback Phoenix
          setUserLocation([33.46, -112.32]);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setUserLocation([33.46, -112.32]);
    }
  };


  // Perform search
  const performSearch = useCallback(
    async (query: string, coords?: [number, number]) => {
      if (query.length < 2 || !coords) return;
      setIsLoading(true);
      try {
        const [searchLat, searchLng] = coords;
         const requestBody = {
            DisplayName: query,
            Latitude: searchLat,
            Longitude: searchLng,
          };

         const geoRes = await fetch(`${API_BASE_URL}/api/Location/geocode2`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

        const geoData = await geoRes.json();
        if (!geoData.latitude || !geoData.longitude) return;

        setUserLocation([parseFloat(geoData.latitude), parseFloat(geoData.longitude)]);

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
    },
    [radius]
  );

  // Debounced search input
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchText(value);
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        if (userLocation) performSearch(value, userLocation);
      }, 2500);
    },
    [performSearch, userLocation]
  );

  const handleSearchButton = () => {
    if (!userLocation) {
      requestUserLocation();
    }
    performSearch(searchText, userLocation!);
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
            onFocus={() => {
              requestUserLocation();
              if (onSearchFocus) onSearchFocus();
            }}
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
