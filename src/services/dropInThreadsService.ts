import { DropInThread } from "../model/DropInThread";
const API_BASE_URL = process.env.REACT_APP_API_URL;

const getDropInThreads = async (): Promise<DropInThread[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/DropInThread`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      return data as DropInThread[];
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // Re-throw the error after logging
    }
  };
  const createDropInThread = async (DropInThread: DropInThread): Promise<boolean> => {
    const token = sessionStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_URL}/DropInThread/CreateDropInThread`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(DropInThread),
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

  export const handleCreateDropInThread = async(DropInThread: DropInThread):Promise<boolean> => {
    return await createDropInThread(DropInThread);
  }
  
  export const handleGetDropInThreads = async (): Promise<DropInThread[]> => {
    return await getDropInThreads();
  };

  