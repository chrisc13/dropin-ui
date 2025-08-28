import { useState } from "react";
import { DropEvent } from "../../model/DropEvent"
import { Popup } from "../Popup/Popup";
import "./DropEventCard.css";

export interface DropEventCardProps{
    dropEvent:  DropEvent
}

export const DropEventCard: React.FC<DropEventCardProps> = ({dropEvent}) => {
    const [showPopup, setShowPopup] = useState(false);

    const randomSampleImage = () =>{
        let images = ["soccer1.jpg", "running3.jpg", "football1.jpg"]
        const randomIndex = Math.floor(Math.random() * 3);

        return "/images/"+images[randomIndex];
    }

    const handleShowPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

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
          </div>
        );
      };
      
    const GetEventCardFooter = () =>{
      return <button
                className="btn"
                onClick={e => {console.log("interested!");  e.stopPropagation(); setShowPopup(false)}}
              >Confirm
            </button>
    } 


    const image = randomSampleImage();
    return <div className="card-wrapper"  onClick={e => handleShowPopup()} >
        <Popup title={dropEvent.eventName} isOpen={showPopup} setClose={handleClosePopup} children={eventCardBodyPopup()} footer={GetEventCardFooter()}></Popup>

        <img src={image} alt="Location 1"/>
        <h5>{dropEvent.eventName}</h5>
        <h6>{dropEvent.sportType}</h6>
        <div className="card-footer">Im Interested</div>
    </div>
}