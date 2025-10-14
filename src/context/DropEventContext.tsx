import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DropEvent } from "../model/DropEvent";
import {
  handleGetDropEvents,
  handleGetThreeUpcomingDropEvents,
  handleCreateDropEvent,
  handleAttendDropEvent,
} from "../services/dropEventsService";

interface DropEventContextType {
  dropEvents: DropEvent[] | null;
  topThreeEvents: DropEvent[] | null;
  refreshEvents: (location?: { lat: number; lng: number; radius?: number }) => Promise<void>;
  refreshTopThree: () => Promise<void>;
  createEvent: (event: DropEvent) => Promise<void>;
  attendEvent: (eventId: string) => Promise<void>;
}

const DropEventContext = createContext<DropEventContextType | undefined>(undefined);

export const DropEventProvider = ({ children }: { children: React.ReactNode }) => {
  const [dropEvents, setDropEvents] = useState<DropEvent[] | null>(null);
  const [topThreeEvents, setTopThreeEvents] = useState<DropEvent[] | null>(null);

  // 🧭 Location-aware fetch
  const refreshEvents = async (location?: { lat: number; lng: number; radius?: number }) => {
    try {
      let data: DropEvent[];
      if (location?.lat && location?.lng) {
        const radius = location.radius ?? 50; // default radius (e.g. 10 miles)
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/Event/nearby?maxDistanceMiles=${radius}&latitude=${location.lat}&longitude=${location.lng}`
        );
        if (!response.ok) throw new Error(`Nearby fetch failed: ${response.status}`);
        data = await response.json();
      } else {
        data = await handleGetDropEvents();
      }

      setDropEvents(data);
    } catch (error) {
      console.error("Failed to fetch drop events:", error);
    }
  };

  const refreshTopThree = async () => {
    try {
      const data = await handleGetThreeUpcomingDropEvents();
      setTopThreeEvents(data);
    } catch (error) {
      console.error("Failed to fetch top three events:", error);
    }
  };

  const createEvent = async (dropEvent: DropEvent) => {
    try {
      await handleCreateDropEvent(dropEvent);
      await refreshEvents(); // refresh after create
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const attendEvent = async (eventId: string) => {
    try {
      await handleAttendDropEvent(eventId);
      await refreshEvents(); // refresh after attending
    } catch (error) {
      console.error("Error attending event:", error);
    }
  };

  useEffect(() => {
    refreshEvents();
    refreshTopThree();
  }, []);

  const value = useMemo(
    () => ({
      dropEvents,
      topThreeEvents,
      refreshEvents,
      refreshTopThree,
      createEvent,
      attendEvent,
    }),
    [dropEvents, topThreeEvents]
  );

  return <DropEventContext.Provider value={value}>{children}</DropEventContext.Provider>;
};

export const useDropEvents = () => {
  const context = useContext(DropEventContext);
  if (!context) throw new Error("useDropEvents must be used within DropEventProvider");
  return context;
};
