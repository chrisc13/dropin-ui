import { useState } from "react";
import { DropEvent } from "../../model/DropEvent"
import { handleAttendDropEvent } from "../../services/dropEventsService";
import { Popup } from "../Popup/Popup";
import "./DropEventCard.css";
import { shortenAddress } from "../Utils/Helpers";
import { Link } from 'react-router-dom';

export interface DropEventCardProps{
    dropEvent:  DropEvent
}

export const DropEventCard: React.FC<DropEventCardProps> = ({dropEvent}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [isAnAttendee, setIsAnAttendee] = useState(false)

    const randomSampleImage = () =>{
        let images = ["soccer1.jpg", "running3.jpg", "football1.jpg"]
        const randomIndex = Math.floor(Math.random() * 3);

        return "/images/"+images[randomIndex];
    }

    const handleShowPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);
    const handleAttendClick = () => {
      const handleAttend = async () => {
        try {
          const data = await handleAttendDropEvent(dropEvent.id ?? "");
          console.log(data)
          setIsAnAttendee(true)
          //setIsLoggedIn(true);
          //setEvents(data);
        } catch (error) {
          console.error("Error register:", error);
        }
      };
      handleAttend()
    }

    const eventCardBodyPopup = () => {
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
              <span className="label">Player Count:</span>
              <span className="value">{dropEvent.currentPlayers} / {dropEvent.maxPlayers}</span>
            </div>
            
            {dropEvent.attendees && dropEvent.attendees.length > 0 && <div className="attendeesContainer">
              <span className="label">Others going:</span>
                {dropEvent.attendees.map( (attendee, index) =>{
                  return (<Link
                    className="attendeeItem"
                    key={index}
                    to={`/profile/${attendee.username}`}
                  >
                    {attendee.username}
                  </Link>)
                }
            )}

            </div>}
          </div>
        );
      };
      
    const GetEventCardFooter = () =>{
      return <button
                className="btn"
                onClick={e => {handleAttendClick() ;  e.stopPropagation(); setShowPopup(false)}}
              >Going!
            </button>
    } 


    const image = randomSampleImage();
    return <div className={isAnAttendee ? "card-wrapper attending" : "card-wrapper"}  onClick={e => handleShowPopup()} >
        <Popup title={dropEvent.eventName} isOpen={showPopup} setClose={handleClosePopup} children={eventCardBodyPopup()} footer={GetEventCardFooter()}></Popup>

        <img src={image} alt="Location 1"/>
        <h5>{shortenAddress(dropEvent.location)}</h5>
        <h6>{dropEvent.date}</h6>
        <h6>{dropEvent.sport}</h6>
        <h6>Organized by: {dropEvent.organizerName}</h6>

        <div className="card-footer">Im Interested</div>
    </div>
}