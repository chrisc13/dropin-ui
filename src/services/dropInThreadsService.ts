import { Comment, DropInThread, Like } from "../model/DropInThread";
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

  const getDropInThreadById = async (threadId: string): Promise<DropInThread> => {
    try {
      const response = await fetch(`${API_BASE_URL}/DropInThread/${threadId}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      return data as DropInThread;
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

  const addThreadComment = async (comment: Comment, threadId: string): Promise<boolean> => {
    const token = sessionStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_URL}/DropInThread/${threadId}/comments`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(comment),
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

  const addThreadLike = async (like: Like, threadId: string): Promise<boolean> => {
    const token = sessionStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_URL}/DropInThread/${threadId}/likes`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(like),
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
  const removeThreadLike = async (likeId: string): Promise<boolean> => {
    const token = sessionStorage.getItem("accessToken");
    try {
      const response = await fetch(`${API_BASE_URL}/DropInThread/likes/${likeId}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        }
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

  export const handleGetDropInThreadById = async (threadId: string): Promise<DropInThread> => {
    return await getDropInThreadById(threadId);
  };
  
  export const handleAddThreadComment = async(comment: Comment, threadId: string):Promise<boolean> => {
    return await addThreadComment(comment, threadId);
  }

  export const handleRemoveThreadLike = async(likeid: string):Promise<boolean> => {
    return await removeThreadLike(likeid);
  }

  export const handleAddThreadLike = async(like: Like, threadId: string):Promise<boolean> => {
    return await addThreadLike(like, threadId);
  }
  