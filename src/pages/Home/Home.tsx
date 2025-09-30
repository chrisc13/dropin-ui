import React, { useEffect, useState } from "react";
import "./Home.css";
import { DropEvent } from "../../model/DropEvent";
import { DropEventCard } from "../../components/DropEventCard/DropEventCard";
import MapComponent from "../../components/Map/MapComponent";
import { handleCreateDropEvent, handleGetThreeUpcomingDropEvents } from "../../services/dropEventsService";
import { FormFields } from "../../types/FormFields";
import { Popup } from "../../components/Popup/Popup";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { CreateEventForm } from "../../components/Form/CreateEventForm";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [events, setEvents] = useState<DropEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEvents, setShowEvents] = useState(false);
  const [showCreateEventPopup, setShowCreateEventPopup] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await handleGetThreeUpcomingDropEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching drop events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const initialDropEvent: FormFields<DropEvent> = {
    sport: "",
    eventDetails: "",
    location: "",
    start: new Date(),
    maxPlayers: 0,
  };

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

  const renderEventsList = () => {
    if (isLoading) return <LoadingSpinner />;

    return (
      <div className="event-cards-wrapper">
        {events.map((e, index) => {
          const isAttending =
            e.attendees?.some(
              (a) =>
                a.username.toLowerCase() === user?.username?.toLowerCase()
            ) ?? false;
          return (
            <div style={{ "--i": index } as React.CSSProperties} key={index}>
            <DropEventCard
              dropEvent={e}
              key={index}
              isLoggedIn={!!user}
              isAttending={isAttending}
            />
            </div>
          );
        })}
      </div>
    );
  };

  const handleSearchFocus = () => {
    setShowWelcome(false); // hide the welcome section
  };

  return (
    <div className="home-layout">
      {/* WELCOME SECTION */}
      {!user && (
        <div className={`welcome-wrapper ${showWelcome ? "show" : "hide"}`}>
          <div className="welcome-content">
            <h1 className="welcome-title">Welcome to Drop In!</h1>
            <p className="welcome-subtitle">
              Find local pickup sports near you — play anytime, anywhere.
            </p>
            <button
              className="btn-secondary"
              onClick={() => setShowEvents((prev) => !prev)}
            >
              {showEvents ? "Hide Events" : "Browse Upcoming Events"}
            </button>
          </div>
        </div>
      )}

      {/* EVENTS SECTION — Appears when clicking “Browse Events” or if user is logged in */}
      {(showEvents || user) && (
      <div className={`event-list-container show ${user ? "loggedin" : ""}`}>
      <div className="event-actions">
            <button
              className="create-event-button"
              onClick={() => navigate("/events")}
            >
              View All Events
            </button>

            {user && (
              <button
                className="create-event-button"
                onClick={() => setShowCreateEventPopup(true)}
              >
                Create Event
              </button>
            )}
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

          {renderEventsList()}
        </div>
      )}

      {/* MAP SECTION */}
      <div className="body-wrapper">
        <MapComponent
          latitude={33.46156025}
          longitude={-112.32191100688232}
          displayName="Phoenix"
          onSearchFocus={handleSearchFocus}
        />
      </div>
    </div>
  );
};
