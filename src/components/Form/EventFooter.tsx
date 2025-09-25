import React from "react";
import { DropEvent } from "../../model/DropEvent";
import { useNavigate } from "react-router-dom";
import { handleAttendDropEvent } from "../../services/dropEventsService";

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

  const handleAttendClick = async () => {
    try {
      await handleAttendDropEvent(dropEvent.id ?? "");
      if (onAttend) onAttend();
      onClose();
    } catch (err) {
      console.error("Error attending event", err);
    }
  };

  if (isLoggedIn) {
    return (
      <button className="btn" onClick={handleAttendClick}>
        Going!
      </button>
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
