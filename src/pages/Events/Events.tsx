// src/pages/EventsPage.tsx
import React, { useEffect, useState } from "react";
import { DropEvent } from "../../model/DropEvent";
import { DropEventCard } from "../../components/DropEventCard/DropEventCard";
import { handleGetDropEvents } from "../../services/dropEventsService";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Events.css";
import { CreateEventForm } from "../../components/Form/CreateEventForm";
import { Popup } from "../../components/Popup/Popup";
import { handleCreateDropEvent, handleGetThreeUpcomingDropEvents } from "../../services/dropEventsService";
import { FormFields } from "../../types/FormFields";

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<DropEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [sortOption, setSortOption] = useState<string>("date"); // default sort
  const navigate = useNavigate();
  const [showCreateEventPopup, setShowCreateEventPopup] = useState(false);


  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await handleGetDropEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);
  const sortedEvents = [...events].sort((a, b) => {
    switch (sortOption) {
      case "distance":
        return a.distance - b.distance; // assuming each event has `distance` property
      case "popularity":
        return (b.attendees?.length || 0) - (a.attendees?.length || 0);
      case "date":
      default:
        return new Date(a.start).getTime() - new Date(b.start).getTime();
    }
  });

  const handleCreateEventSubmit = async (values: FormFields<DropEvent>) => {
    const newEvent: DropEvent = {
      eventName: values.eventName || "",
      eventDetails: values.eventDetails || "",
      sport: values.sport || "",
      location: values.location || "",
      locationDetails: values.locationDetails || "",
      start: values.start || new Date(),
      end: values.date || new Date(),
      maxPlayers: values.maxPlayers || 0,
      currentPlayers: values.currentPlayers || 1,
      attendees: values.attendees || [],
      organizerName: "",
      organizerId: "",
      latitude: values.latitude || 0,
      longitude: values.longitude || 0,
    };

    try {
      setIsLoading(true);
      const data = await handleCreateDropEvent(newEvent);
      console.log("Created event:", data);
      setEvents((prev) => [...prev, newEvent]);
    } catch (err) {
      console.error("Error creating drop event:", err);
    } finally {
      setShowCreateEventPopup(false);
      setIsLoading(false);
    }
  };
  const initialDropEvent: FormFields<DropEvent> = {
    sport: "",
    eventDetails: "",
    location: "",
    start: new Date(),
    maxPlayers: 0,
  };

  
  const renderEvents = () => {
    if (isLoading) return <LoadingSpinner />;
    if (!events.length)
      return <p style={{ textAlign: "center" }}>No events available.</p>;

    return (
      <div className="events-grid">
        {sortedEvents.map((e, idx) => {
          const isAttending =
            e.attendees?.some(
              (a) => a.username.toLowerCase() === user?.username?.toLowerCase()
            ) ?? false;
          return (
            <DropEventCard
              key={idx}
              dropEvent={e}
              isLoggedIn={!!user}
              isAttending={isAttending}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Events</h1>
        {user && (
              <button
                className="create-event-button"
                onClick={() => setShowCreateEventPopup(true)}
              >
                Create Event
              </button>
            )}
        <select
        className="events-sort-select"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        >
        <option value="date">Date (Soonest)</option>
        <option value="distance">Distance</option>
        <option value="popularity">Popularity</option>
        </select>
      </div>
      {showCreateEventPopup && (
            <Popup
              title="Create Event"
              isOpen={showCreateEventPopup}
              setClose={() => setShowCreateEventPopup(false)}
              footer={
                <button
                  className="btn"
                  type="submit"
                  form="create-event-form"
                >
                  Post
                </button>
              }
            >
              <CreateEventForm
                initialValues={initialDropEvent}
                onSubmit={handleCreateEventSubmit}
                formId="create-event-form"
              />
            </Popup>
          )}
      {renderEvents()}
    </div>
  );
};
