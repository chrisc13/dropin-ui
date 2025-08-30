import { useState } from "react";
import { DropEvent } from "../../model/DropEvent"
import { handleAttendDropEvent } from "../../services/dropEventsService";
import { Popup } from "../Popup/Popup";
import "./DropEventCard.css";

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
              <span className="label">City:</span>
              <span className="value">{dropEvent.city}</span>
            </div>
            <div className="field">
              <span className="label">Location:</span>
              <span className="value">{dropEvent.locationName}</span>
            </div>
            <div className="field">
              <span className="label">Sport:</span>
              <span className="value">{dropEvent.sportType}</span>
            </div>
            <div className="field">
              <span className="label">Max Players:</span>
              <span className="value">{dropEvent.maxPlayers}</span>
            </div>
            <div className="field">
              <span className="label">Current Player Count:</span>
              <span className="value">{dropEvent.currentPlayers}</span>
            </div>
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
        <h5>{dropEvent.eventName}</h5>
        <h6>{dropEvent.date.toLocaleString()}</h6>
        <h6>{dropEvent.sportType}</h6>
        <h6>Organized by: {dropEvent.organizerName}</h6>

        <div className="card-footer">Im Interested</div>
    </div>
}