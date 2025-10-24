import React, { useState, useRef, FormEvent, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../../components/Profile/Avatar";
import { useAuth } from "../../context/AuthContext";
import { handleProfileImagesRequest } from "../../services/authService";
import { useChatHub, ChatMessage } from "../../components/Messaging/useChatHub";
import "./ChatWindow.css";

const ChatWindow: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [profileImages, setProfileImages] = useState<Record<string, string>>({});
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const user1 = user?.username ?? "";
  const user2 = username ?? "";

  // Memoize token and otherUser to avoid reconnects
  const token = useMemo(() => sessionStorage.getItem("accessToken") ?? "", []);
  const { messages, sendMessage } = useChatHub(token, user2);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch profile images for both users
  useEffect(() => {
    const fetchProfileImages = async (usernames: string[]) => {
      try {
        const data = await handleProfileImagesRequest(usernames);
        setProfileImages(data);
      } catch (error) {
        console.error("Error fetching profile images:", error);
      }
    };
    if (user1 && user2) fetchProfileImages([user1, user2]);
  }, [user1, user2]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    // Optimistically add message to UI
    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: user1,
      message: trimmed,
      timestamp: new Date().toISOString(),
    };
    // Add to messages immediately
    sendMessage(trimmed);
    setNewMessage("");
  };

  if (!user1 || !user2) return <div>Please log in to chat</div>;

  return (
    <div className="chat-window">
      <div className="chat-page-avatar" onClick={() => navigate(`/profile/${username}`)}>
        <Avatar username={user2} avatarUrl={profileImages[user2]} size={80} />
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-wrapper ${msg.sender === user1 ? "sent-wrapper" : "received-wrapper"}`}
          >
            {msg.sender !== user1 && (
              <Avatar username={msg.sender} avatarUrl={profileImages[msg.sender]} size={40} />
            )}

            <div className={`message-bubble ${msg.sender === user1 ? "sent" : "received"}`}>
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

            {msg.sender === user1 && (
              <Avatar username={msg.sender} avatarUrl={profileImages[msg.sender]} size={40} />
            )}
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
