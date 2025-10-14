import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DropEvent } from "../../model/DropEvent";
import { DropEventCard } from "../../components/DropEventCard/DropEventCard";
import { handleGetDropEvents, handleCreateDropEvent } from "../../services/dropEventsService";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { CreateEventForm } from "../../components/Form/CreateEventForm";
import { Popup } from "../../components/Popup/Popup";
import { FormFields } from "../../types/FormFields";
import "./Events.css";

// Haversine formula to calculate distance in miles
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<DropEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams<{ username?: string }>();

  const [sortOption, setSortOption] = useState<string>("date");
  const [showCreateEventPopup, setShowCreateEventPopup] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Toggle filter state: defaults to Attending if username exists
  const [userEventFilter, setUserEventFilter] = useState<"All" | "Attending" | "Organizing">(
    username ? "Organizing" : "All"
  );

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 33.46, lng: -112.32 }) // fallback
      );
    } else {
      setUserLocation({ lat: 33.46, lng: -112.32 });
    }
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await handleGetDropEvents();

        if (userLocation) {
          data.forEach((e) => {
            e.distance = getDistance(userLocation.lat, userLocation.lng, e.latitude, e.longitude);
          });
        }

        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [userLocation]);

  // Filter events based on toggle and username/user
  const userFilter = username || user?.username || "";
  const filteredEvents = events.filter((e) => {
    if (!userFilter) return true; // no user filter, show all
    switch (userEventFilter) {
      case "Attending":
        return e.attendees?.some((a) => a.username.toLowerCase() === userFilter.toLowerCase());
      case "Organizing":
        return e.organizerName?.toLowerCase() === userFilter.toLowerCase();
      case "All":
      default:
        return true;
    }
  });

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortOption) {
      case "distance":
        return (a.distance || 0) - (b.distance || 0);
      case "popularity":
        return (b.attendees?.length || 0) - (a.attendees?.length || 0);
      case "date":
      default:
        return new Date(a.start).getTime() - new Date(b.start).getTime();
    }
  });

  // Create Event
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
      organizerName: user?.username || "",
      organizerId: user?.id || "",
      latitude: values.latitude || 0,
      longitude: values.longitude || 0,
    };

    try {
      setIsLoading(true);
      await handleCreateDropEvent(newEvent);
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
    start: new Date(new Date().getTime() + 30 * 60 * 1000),
    maxPlayers: 0,
  };

  const renderEvents = () => {
    if (isLoading) return <LoadingSpinner />;
    if (!sortedEvents.length) return <p style={{ textAlign: "center" }}>No events available.</p>;

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
      <h1>{username ? `${username}'s Events` : "Events"}</h1>

      {/* Header with Create & Sort */}
      <div className="events-header">
        {user && (
          <button className="create-event-button" onClick={() => setShowCreateEventPopup(true)}>
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

      {/* User Event Filter Toggle */}
      {user && (username || user) && (
        <div className="event-filter-toggle" style={{ marginBottom: "1rem" }}>
          <label>
            <input
              type="checkbox"
              name="userEventFilter"
              value="All"
              checked={userEventFilter === "All"}
              onChange={() => setUserEventFilter("All")}
            />
            All
          </label>
          <label>
            <input
              type="checkbox"
              name="userEventFilter"
              value="Attending"
              checked={userEventFilter === "Attending"}
              onChange={() => setUserEventFilter("Attending")}
            />
            Attending
          </label>
          <label>
            <input
              type="checkbox"
              name="userEventFilter"
              value="Organizing"
              checked={userEventFilter === "Organizing"}
              onChange={() => setUserEventFilter("Organizing")}
            />
            Organizing
          </label>
        </div>
      )}

      {/* Create Event Popup */}
      {showCreateEventPopup && (
        <Popup
          title="Create Event"
          isOpen={showCreateEventPopup}
          setClose={() => setShowCreateEventPopup(false)}
          footer={
            <button className="btn" type="submit" form="create-event-form">
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
