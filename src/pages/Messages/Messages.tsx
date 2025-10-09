import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ConversationPreview } from "../../model/ChatMessage";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Messages: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);

  const currentUser = user?.username;

  useEffect(() => {
    if (!currentUser) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/Messaging/conversations?username=${currentUser}`);
        const data: ConversationPreview[] = await res.json();
        setConversations(data);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      }
    };

    fetchConversations();
  }, [currentUser]);

  const handleOpenChat = (otherUser: string) => {
    navigate(`/chat/${otherUser}`);
  };

  if (!currentUser) return <div>Please log in to view messages</div>;

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", paddingTop: "75px" }}>
      <h2>Messages</h2>
      {conversations.length === 0 ? (
        <p>No conversations yet</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {conversations.map((conv) => (
            <li
              key={conv.otherUser}
              onClick={() => handleOpenChat(conv.otherUser)}
              style={{
                padding: "10px 15px",
                border: "1px solid #ccc",
                marginBottom: 10,
                cursor: "pointer",
                borderRadius: 5,
              }}
            >
              <b>{conv.otherUser}</b>
              <div style={{ fontSize: 14, color: "#555" }}>
                {conv.lastMessage.message}
              </div>
              <div style={{ fontSize: 10, color: "#888" }}>{conv.lastMessage.timestamp}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
