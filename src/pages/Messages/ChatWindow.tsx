import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../../components/Profile/Avatar";
import { useAuth } from "../../context/AuthContext";
import { handleProfileImagesRequest } from "../../services/authService";
import "./ChatWindow.css";

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ChatWindow: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [profileImages, setProfileImages] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const lastIdRef = useRef("0-0");

  const user1 = user?.username ?? "";
  const user2 = username ?? "";

  // Poll messages every 5s
  useEffect(() => {
    if (!user1 || !user2) return;

    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/Messaging/read?user1=${user1}&user2=${user2}&lastId=${lastIdRef.current}`
        );
        const newMessages: ChatMessage[] = await res.json();

        if (isMounted && newMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const filtered = newMessages.filter(
              (m) => !existingIds.has(m.id) && !m.id.startsWith("temp-")
            );

            // Remove optimistic messages that now exist in real list
            const withoutTemp = prev.filter(
              (m) =>
                !m.id.startsWith("temp-") ||
                !newMessages.some(
                  (nm) =>
                    nm.message === m.message &&
                    nm.sender === m.sender &&
                    Math.abs(
                      new Date(nm.timestamp).getTime() -
                        new Date(m.timestamp).getTime()
                    ) < 5000 // within 5 seconds
                )
            );

            return [...withoutTemp, ...filtered];
          });

          lastIdRef.current = newMessages[newMessages.length - 1].id;
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 16000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user1, user2]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    const fetchProfileImages = async (usernames: string[]) => {
      try {
        const data = await handleProfileImagesRequest(usernames);
        setProfileImages(data);
      } catch (error) {
        console.error("Error fetching profile images:", error);
      } finally {
      }
    };

      fetchProfileImages([user1, user2]);
  }, [user1, user2]);



  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add optimistic message immediately
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      sender: user1,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await fetch(`${API_BASE_URL}/api/Messaging/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user1,
          user2,
          sender: user1,
          message: newMessage,
        }),
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }

    setNewMessage("");
  };

  if (!user1 || !user2) return <div>Please log in to chat</div>;

  return (
    <div className="chat-window">
    <div className="chat-page-avatar" onClick={() => navigate(`/profile/${username}`)}>
        <Avatar username={user2} avatarUrl={profileImages[user2]} size={80}></Avatar>
      </div>

      <div className="messages-container">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-bubble ${
              msg.sender === user1 ? "sent" : "received"
            }`}
          >
            <div className="message-text">{msg.message}</div>
            <div className="message-meta">
              <span className="sender-name">{msg.sender}</span>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
