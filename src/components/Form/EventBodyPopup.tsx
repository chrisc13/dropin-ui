import React from "react";
import { DropEvent } from "../../model/DropEvent";
import { Link } from "react-router-dom";
import { shortenAddress } from "../Utils/Helpers";
import { formatEventDate } from "../Utils/DateUtils";

interface EventPopupBodyProps {
  dropEvent: DropEvent;
}

export const EventPopupBody: React.FC<EventPopupBodyProps> = ({ dropEvent }) => {
  return (
    <div className="popup-content">
      <div className="field">
        <span className="label">Location:</span>
        <span className="value">{shortenAddress(dropEvent.location)}</span>
      </div>

      <div className="field">
        <span className="label">Sport:</span>
        <span className="value">{dropEvent.sport}</span>
      </div>

      <div className="field">
        <span className="label">Details:</span>
        <span className="value">{dropEvent.eventDetails}</span>
      </div>
      <div className="form-group">
        <label>Start Time</label>
        <input
          type="datetime-local"
          value={
            dropEvent.start
              ? new Date(dropEvent.start).toISOString().slice(0, 16)
              : ""
          }
        />
      </div>
      <div className="field">
        <span className="label">Player Count:</span>
        <span className="value">
          {dropEvent.currentPlayers} / {dropEvent.maxPlayers}
        </span>
      </div>

      {dropEvent.attendees && dropEvent.attendees.length > 0 && (
        <div className="attendeesContainer">
          <span className="label">Others going:</span>
          {dropEvent.attendees.map((attendee, index) => (
            <Link
              className="attendeeItem"
              key={index}
              to={`/profile/${attendee.username}`}
            >
              {attendee.username}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
