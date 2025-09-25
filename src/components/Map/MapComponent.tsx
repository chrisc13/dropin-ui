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
import { EventFooter } from '../Form/EventFooter';
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
  const [userLocation, setUserLocation] = useState<[number, number]>([latitude || 33.46, longitude || -112.32]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // selected event for modal
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn("Geolocation denied or unavailable, using default location.");
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

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

        setUserLocation([searchLat, searchLng]);


        // 2️⃣ Fetch nearby events
        const eventsRes = await fetch(
          `${API_BASE_URL}/Event/nearby?maxDistanceMiles=50&latitude=${searchLat}&longitude=${searchLng}`
        );
        const eventsData = await eventsRes.json();

        setSearchResults(eventsData);

      } catch (err) {
        console.error("Search failed", err);
      }
    }, 2500); // 500ms debounce
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
   {selectedEvent && (
        <ModalPopup
          title={selectedEvent.eventName}
          isOpen={!!selectedEvent}
          setClose={() => setSelectedEvent(null)}
        >
          <EventPopupBody dropEvent={selectedEvent}></EventPopupBody>
        </ModalPopup>
      )}
      
      
      <MapContainer
        center={userLocation}
        zoom={11}
        className={isPreview ? "map-preview" : "map-full"}
        scrollWheelZoom={!isPreview}
        dragging={!isPreview}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Nearby events markers */}
        {searchResults.map((event) => (
            <Marker key={event.id} position={[event.latitude, event.longitude]}>
              <Popup className="custom-popup">
                  <div className="map-pin-container">
                    <div><b>{event.sport}</b></div>
                    <div>{formatEventDate(event.start)}</div>
                    <button className="popup-button"  onClick={() => setSelectedEvent(event)}>
                      View Event
                    </button>
                  </div>
              </Popup>
            </Marker>
          ))}
          {userLocation[0] !== 0 && userLocation[1] !== 0 && (
                    <RecenterMap lat={userLocation[0]} lng={userLocation[1]} />
                  )}      </MapContainer>
    </div>
  );
};

export default MapComponent;
