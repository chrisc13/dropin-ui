import React, { useState } from "react";
import "./Home.css";
import { DropEventCard } from "../../components/DropEventCard/DropEventCard";
import MapComponent from "../../components/Map/MapComponent";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDropEvents } from "../../context/DropEventContext";

export const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEvents, setShowEvents] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // 👇 use context data instead of fetching manually
  const { topThreeEvents: events, refreshTopThree } = useDropEvents();

  // optional: if you want loading feedback based on null state
  const isLoading = !events;

  const renderEventsList = () => {
    if (isLoading) return <LoadingSpinner />;

    return (
      <div className="event-cards-wrapper">
        {events?.map((e, index) => {
          const isAttending =
            e.attendees?.some(
              (a) =>
                a.username.toLowerCase() === user?.username?.toLowerCase()
            ) ?? false;
          return (
            <div style={{ "--i": index } as React.CSSProperties} key={e.id ?? index}>
              <DropEventCard
                dropEvent={e}
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
    setShowWelcome(false);
  };

  return (
    <div className="home-layout">
      {/* WELCOME SECTION */}
      {!user && (
        <div className={`welcome-wrapper ${showWelcome ? "show" : "hide"}`}>
          <div className="welcome-content">
            <h1 className={`welcome-title ${showWelcome ? "show" : "hide"}`}>
              Welcome to Drop In!
            </h1>
            <p className={`welcome-subtitle ${showWelcome ? "show" : "hide"}`}>
              Find local pickup sports near you — play anytime, anywhere.
            </p>
            <button
              className="btn-secondary"
              onClick={() => setShowEvents((prev) => !prev)}
            >
              {showEvents ? "Hide Events" : "Browse Events"}
            </button>

            {/* Threads Button */}
            <button
              className="btn-primary start-thread-btn"
              onClick={() => navigate("/threads")}
            >
              💬 See What People Are Saying
            </button>
          </div>
        </div>
      )}

      {/* EVENTS SECTION */}
      {(showEvents || user) && (
        <div className={`event-list-container show ${user ? "loggedin" : ""}`}>
          <div className="event-actions">
            <button
              className="create-event-button"
              onClick={() => navigate("/events")}
            >
              Events
            </button>

            <button
              className="create-event-button"
              onClick={() => navigate("/threads")}
            >
              Threads
            </button>

            {user && (
              <button
                id="messages-button"
                className="create-event-button"
                onClick={() => navigate("/messages")}
              >
                Messages
              </button>
            )}
          </div>

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
