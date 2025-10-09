import React, { useEffect, useState } from "react";
import "./Home.css";
import { DropEvent } from "../../model/DropEvent";
import { DropEventCard } from "../../components/DropEventCard/DropEventCard";
import MapComponent from "../../components/Map/MapComponent";
import { handleCreateDropEvent, handleGetThreeUpcomingDropEvents } from "../../services/dropEventsService";
import { FormFields } from "../../types/FormFields";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [events, setEvents] = useState<DropEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEvents, setShowEvents] = useState(false);
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
              {showEvents ? "Hide Events" : "Browse Events"}
            </button>
             {/* New Start Thread button */}
        <button
          className="btn-primary start-thread-btn"
          onClick={() => navigate("/threads")} // 👈 or open a modal later
        >
          💬 See What People Are Saying
        </button>
          </div>
        </div>
      )}
      {showEvents && isLoading && (<LoadingSpinner />)}

      {/* EVENTS SECTION — Appears when clicking “Browse Events” or if user is logged in */}
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
          onClick={() => navigate("/threads")} // 👈 or open a modal later
        >Threads
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

    
    </div>
  );
};
