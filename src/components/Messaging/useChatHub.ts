import { useEffect, useState, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
const API_BASE_URL = process.env.REACT_APP_API_URL;

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

export const useChatHub = (token: string, otherUser: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!token || !otherUser) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/chathub`, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    const handleReceiveMessage = (id: string, sender: string, message: string, timestamp: string) => {
      setMessages((prev) => [...prev, { id, sender, message, timestamp }]);
    };

    connection.on("ReceiveMessage", handleReceiveMessage);

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("Connected to ChatHub");

        const oldMessages: ChatMessage[] = await connection.invoke("JoinConversation", otherUser);
        //const oldMessages: ChatMessage[] = await connection.invoke("GetMessages", otherUser);
      setMessages(oldMessages);
      } catch (err) {
        console.error("SignalR connection error:", err);
      }
    };

    startConnection();

    return () => {
      connection.off("ReceiveMessage", handleReceiveMessage); // remove handler
      connection.stop();
    };
  }, [token, otherUser]);

  const sendMessage = useCallback(async (message: string) => {
    if (!connectionRef.current) return;
    try {
      await connectionRef.current.invoke("SendMessage", otherUser, message);
    } catch (err) {
      console.error("SendMessage error:", err);
    }
  }, [otherUser]);

  return { messages, sendMessage };
};
