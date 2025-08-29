import { DropEvent } from "../model/DropEvent";

const getDropEvents = async (): Promise<DropEvent[]> => {
    try {
      const response = await fetch("http://localhost:5084/Event/GetTopThreePopularEvents");
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
      const response = await fetch("http://localhost:5084/Event/CreateEvent",{
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

  export const handleCreateDropEvent = async(dropEvent: DropEvent):Promise<boolean> => {
    return await createDropEvent(dropEvent);
  }
  
  export const handleGetDropEvents = async (): Promise<DropEvent[]> => {
    return await getDropEvents();
  };
  