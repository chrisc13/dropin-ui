// MapComponent.js
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import "./MapComponent.css"
import { useState } from 'react';

// Fix Leaflet's default icon paths for React + TypeScript (CRA)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapProps{
  longitude: number,
  latitude: number,
  displayName: string,
  isPreview?: boolean; 
}

const RecenterMap: React.FC<{lat: number, lng: number}> = ({ lat, lng }) => {
  const map = useMap();
  map.setView([lat, lng], map.getZoom());
  return null;
};

export const MapComponent: React.FC<MapProps> = ({longitude, latitude, displayName, isPreview}) => {
  const location: [number, number] = [latitude, longitude];
  const [search, setSearch] = useState("")

  return (
    <div className='map-wrapper'>
    {!isPreview ? <div className="map-search">
        <input className="map-search-input" placeholder="Search nearby"/>
    </div> : <></>}
    <MapContainer
      center={location}
      zoom={13}
      className={isPreview ? "map-preview" : "map-full"}
      scrollWheelZoom={!isPreview}
      dragging={!isPreview}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={location}>
        <Popup className="custom-popup" >{displayName}</Popup>
      </Marker>
      {latitude !== 0 && longitude !== 0 && <RecenterMap lat={latitude} lng={longitude} />}
    </MapContainer>
    </div>
  );
}

export default MapComponent;
