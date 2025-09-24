import { DropEvent } from "../model/DropEvent";
const API_BASE_URL = process.env.REACT_APP_API_URL;

const getDropEvents = async (): Promise<DropEvent[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Event/GetTopThreePopularEvents`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      return data as DropEvent[];
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // Re-throw the error after logging
    }
  };

  const createDropEvent = async (dropEvent: DropEvent): Promise<boolean> => {
    const token = sessionStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_URL}/Event/CreateEvent`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dropEvent),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      await response.json();
      return true;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // Re-throw the error after logging
    }
  };

  const attendDropEvent = async (eventId: string): Promise<boolean> => {
    const token = sessionStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_URL}/Event/${eventId}/Attendees`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({}), // send an empty object if you don't have extra data
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      await response.json();
      return true;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // Re-throw the error after logging
    }
  };

  export const handleCreateDropEvent = async(dropEvent: DropEvent):Promise<boolean> => {
    return await createDropEvent(dropEvent);
  }
  
  export const handleAttendDropEvent = async(eventId: string):Promise<boolean> => {
    return await attendDropEvent(eventId);
  }

  export const handleGetDropEvents = async (): Promise<DropEvent[]> => {
    return await getDropEvents();
  };
  