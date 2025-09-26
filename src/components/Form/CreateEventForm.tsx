import React, { useState, ChangeEvent, FormEvent, useCallback, useRef } from "react";
import { DropEvent } from "../../model/DropEvent";
import { FormFields } from "../../types/FormFields";
import MapComponent from "../Map/MapComponent";
import "./CreateEventForm.css";
const API_BASE_URL = process.env.REACT_APP_API_URL;

interface CreateEventFormProps {
  initialValues: FormFields<DropEvent>;
  onSubmit: (values: FormFields<DropEvent>) => void;
  formId: string;
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({
  initialValues,
  onSubmit,
  formId,
}) => {
  const [formValues, setFormValues] = useState<FormFields<DropEvent>>(initialValues);
  const [tempAddress, setTempAddress] = useState<string>(initialValues.location || "");
  const [tempDisplayName, setTempDisplayName] = useState<string>("");
  const [tempLocation, setTempLocation] = useState<[number, number] | null>(null);
  const [confirmedLocation, setConfirmedLocation] = useState<[number, number] | null>(
    initialValues.latitude && initialValues.longitude
      ? [initialValues.latitude, initialValues.longitude]
      : null
  );

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Generic input change
  const handleChange = (key: keyof DropEvent, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  // Submit handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  // Location typing + debounce
  const handleLocationChange = useCallback((value: string) => {
    setTempAddress(value);

    // Undo previous confirmation if user starts typing again
    if (formValues.location === tempDisplayName) {
      setFormValues((prev) => ({ ...prev, location: "" }));
      setConfirmedLocation(null);
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      if (value.length < 3) return;

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/Location/geocode?address=${encodeURIComponent(value)}`
        );
        const data = await res.json();

        if (data.lat && data.lng) {
          const lat = parseFloat(data.lat);
          const lng = parseFloat(data.lng);
          setTempLocation([lat, lng]); // preview only
          setTempDisplayName(data.displayName);
        }
      } catch (err) {
        console.error("Geocoding failed", err);
      }
    }, 1000);
  }, [formValues.location, tempDisplayName]);

  // Confirm location button
  const confirmLocation = () => {
    if (!tempLocation) return;
    setConfirmedLocation(tempLocation);
    setFormValues((prev) => ({
      ...prev,
      location: tempDisplayName,
      latitude: tempLocation[0],
      longitude: tempLocation[1],
    }));
    setTempAddress(tempDisplayName);
  };

  // Decide which location to show on map: confirmed > temp > null
  const mapLatitude = confirmedLocation ? confirmedLocation[0] : tempLocation?.[0];
  const mapLongitude = confirmedLocation ? confirmedLocation[1] : tempLocation?.[1];

  return (
    <form
      id={formId}
      className="generic-form"
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        // Prevent Enter from submitting in any input except the button
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      }}
    >
      <div className="form-group">
        <label>Sport</label>
        <input
          required
          type="text"
          value={formValues.sport || ""}
          onChange={(e) => handleChange("sport", e.target.value)}
          placeholder="Sport"
        />
      </div>

      <div className="form-group">
        <label>Event Details</label>
        <textarea
          value={formValues.eventDetails || ""}
          onChange={(e) => handleChange("eventDetails", e.target.value)}
          placeholder="Event Details"
        />
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          required
          type="text"
          value={tempAddress}
          onChange={(e) => handleLocationChange(e.target.value)}
          placeholder="Type a location"
        />
      </div>

      {(mapLatitude && mapLongitude) && (
        <div className="map-preview">
          <MapComponent
            latitude={mapLatitude}
            longitude={mapLongitude}
            displayName={tempDisplayName}
            isPreview={true}
          />
          {!formValues.location && tempLocation && (
            <button type="button" className="btn confirm-btn" onClick={confirmLocation}>
              Confirm Location
            </button>
          )}
        </div>
      )}

      <div className="form-group">
        <label>Start Time</label>
        <input
          type="datetime-local"
          value={
            formValues.start
              ? new Date(formValues.start).toISOString().slice(0, 16)
              : ""
          }
          onChange={(e) => handleChange("start", new Date(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>Max Players</label>
        <input
          type="number"
          value={formValues.maxPlayers || ""}
          onChange={(e) => handleChange("maxPlayers", Number(e.target.value))}
        />
      </div>
    </form>
  );
};
