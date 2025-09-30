// MapComponent.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import "./MapComponent.css";
import { useState, useRef, useCallback, useEffect } from 'react';
import { formatEventDate } from '../Utils/DateUtils';
import { Popup as ModalPopup } from "../Popup/Popup";
import { EventPopupBody } from '../Form/EventBodyPopup';
import { DropEventCard } from '../DropEventCard/DropEventCard';

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Fix Leaflet default icon paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapProps {
  longitude?: number;
  latitude?: number;
  displayName?: string;
  isPreview?: boolean;
  onSearchFocus?: () => void; // 👈 callback with no arguments
}

const RecenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  map.setView([lat, lng], map.getZoom());
  return null;
};

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
  const [radius, setRadius] = useState<number>(25); // default radius

  const radiusOptions = [5, 10, 25, 50]; // miles

  // Initialize user location: props > geolocation > fallback default
  useEffect(() => {
    if (latitude && longitude) {
      setUserLocation([latitude, longitude]);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setUserLocation([33.46, -112.32]), // fallback default
        { enableHighAccuracy: true }
      );
    } else {
      setUserLocation([33.46, -112.32]); // fallback if geolocation not available
    }
  }, [latitude, longitude]);

  // Perform search
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) return;
    setIsLoading(true);
    try {
      // Geocode
      const geoRes = await fetch(`${API_BASE_URL}/api/Location/geocode?address=${encodeURIComponent(query)}`);
      const geoData = await geoRes.json();
      if (!geoData.lat || !geoData.lng) return;

      const searchLat = parseFloat(geoData.lat);
      const searchLng = parseFloat(geoData.lng);
      setUserLocation([searchLat, searchLng]);

      // Nearby events
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

  // Debounced input search
  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      performSearch(value);
    }, 2500);
  }, [performSearch]);

  // Search button click
  const handleSearchButton = () => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    performSearch(searchText);
  };

  // Wait for userLocation before rendering map
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

      {selectedEvent && (
        <ModalPopup
          title={selectedEvent.eventName}
          isOpen={!!selectedEvent}
          setClose={() => setSelectedEvent(null)}
        >
          <EventPopupBody dropEvent={selectedEvent} />
        </ModalPopup>
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
          <Marker key={displayName} position={[userLocation[0], userLocation[1]]}>
          </Marker>
        }

        {searchResults.map((event) => (
          <Marker key={event.id} position={[event.latitude, event.longitude]}>
            <Popup className="custom-popup">
              <div className="map-pin-container">
                <div><b>{event.sport}</b></div>
                <div>{formatEventDate(event.start)}</div>
                <div>{event.organizerName}</div>
                <button className="popup-button" onClick={() => setSelectedEvent(event)}>
                  View Event
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        <RecenterMap lat={userLocation[0]} lng={userLocation[1]} />

        <div className="map-cards-wrapper">
        {searchResults.map((e, index) => {
          return (
            <div style={{ "--i": index } as React.CSSProperties} key={index}>
            <DropEventCard
              dropEvent={e}
              key={index}
              isLoggedIn={false}
              isAttending={false}
            />
            </div>
          );
        })}
      </div>

      </MapContainer>
    
    </div>
  );
};

export default MapComponent;
