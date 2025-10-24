import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DropEvent } from "../model/DropEvent";
import {
  handleGetDropEvents,
  handleGetThreeUpcomingDropEvents,
  handleCreateDropEvent,
  handleAttendDropEvent,
} from "../services/dropEventsService";

interface DropEventContextType {
  dropEvents: DropEvent[];
  topThreeEvents: DropEvent[] | null;
  refreshEvents: (location?: { lat: number; lng: number; radius?: number }) => Promise<void>;
  refreshTopThree: () => Promise<void>;
  createEvent: (event: DropEvent) => Promise<void>;
  attendEvent: (eventId: string, username: string) => Promise<void>;
}

const DropEventContext = createContext<DropEventContextType | undefined>(undefined);

export const DropEventProvider = ({ children }: { children: React.ReactNode }) => {
  const [dropEvents, setDropEvents] = useState<DropEvent[]>([]);
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
      const response = await handleCreateDropEvent(dropEvent);
      if (!response) throw new Error(`Failed to create event: ${response}`);
  
      setDropEvents(prev => [...prev, dropEvent]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const attendEvent = async (eventId: string, username: string) => {
    if (!eventId || !username){return}
    try {
      // 1️⃣ Call backend
      const response = await handleAttendDropEvent(eventId);
      if (!response) throw new Error(`Failed to attend event: ${response}`);
  
      // 2️⃣ Update dropEvents locally
      setDropEvents(prev =>
        prev?.map(e =>
          e.id === eventId
            ? { ...e, attendees: [...(e.attendees ?? []), { id: "temp-id", username }] }
            : e
        ) ?? null
      );
      
  
      // 3️⃣ Update topThreeEvents if relevant
      setTopThreeEvents((prev) =>
        prev?.map((e) =>
          e.id === eventId
            ? { ...e, attendees: [...(e.attendees ?? []), { id: "temp-id", username }] }
            : e
        ) ?? null
      );
  
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
