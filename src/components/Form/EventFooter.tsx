import React from "react";
import { DropEvent } from "../../model/DropEvent";
import { useNavigate } from "react-router-dom";
import { handleAttendDropEvent } from "../../services/dropEventsService";
import { useDropEvents } from "../../context/DropEventContext";
import { useAuth } from "../../context/AuthContext";

interface EventFooterProps {
  dropEvent: DropEvent;
  isLoggedIn: boolean;
  onClose: () => void;
  onAttend?: () => void; // optional callback if parent wants to track attendance
}

export const EventFooter: React.FC<EventFooterProps> = ({
  dropEvent,
  isLoggedIn,
  onClose,
  onAttend,
}) => {
  const navigate = useNavigate();
  const { attendEvent } = useDropEvents();
  const { user } = useAuth()

  const handleAttendClick = async () => {
    if (!user){return}
    try {
      await attendEvent(dropEvent.id ?? "", user.username)
      if (onAttend) onAttend();
      onClose();
    } catch (err) {
      console.error("Error attending event", err);
    }
  };
  const handleMessageClick = () => {
    // Navigate to chat page with the organizer
    navigate(`/chat/${dropEvent.organizerName}`);
  };


  if (isLoggedIn) {
    return (<div className="message-attend-wrapper">
    <button className="btn second" onClick={handleMessageClick}>
        Message {dropEvent.organizerName}
      </button>
      <button className="btn" onClick={handleAttendClick}>
        Going!
      </button>
      </div>
    );
  } else {
    return (
      <div className="login-footer">
        <span
          className="login-link-alert"
          onClick={() => navigate("/welcome")}
        >
          Sign in to Attend
        </span>
      </div>
    );
  }
};
