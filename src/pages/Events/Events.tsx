// src/pages/EventsPage.tsx
import React, { useEffect, useState } from "react";
import { DropEvent } from "../../model/DropEvent";
import { DropEventCard } from "../../components/DropEventCard/DropEventCard";
import { handleGetDropEvents } from "../../services/dropEventsService";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Events.css";

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<DropEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [sortOption, setSortOption] = useState<string>("date"); // default sort
  const navigate = useNavigate();

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
        <h1>All Events</h1>
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
      {renderEvents()}
    </div>
  );
};
