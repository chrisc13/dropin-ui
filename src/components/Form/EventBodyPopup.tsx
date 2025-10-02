import React from "react";
import { DropEvent } from "../../model/DropEvent";
import { Link } from "react-router-dom";
import { shortenAddress } from "../Utils/Helpers";
import { formatToLocalDate } from "../Utils/DateUtils";
import { AvatarWithUsername } from "../Profile/AvatarWithUsername";

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
      <div className="field">
        <span className="label">When:</span>
        <span className="value">{ dropEvent.start
              ? formatToLocalDate(dropEvent.start)
              : ""}</span>
      </div>
      <div className="host-count-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
        <div>
        <span className="label">Organizer:</span>
            <Link className="hostItem" to={`/profile/${dropEvent.organizerName}`}>
                      {dropEvent.organizerName}
                    </Link>
        </div>
        <div className="field">
        <span className="label">Participant Count:</span>
        <span className="value">
          {dropEvent.currentPlayers} / {dropEvent.maxPlayers}
        </span>
        </div>
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
