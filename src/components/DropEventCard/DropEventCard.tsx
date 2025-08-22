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
              <span className="value">{dropEvent.location_name}</span>
            </div>
            <div className="field">
              <span className="label">Sport:</span>
              <span className="value">{dropEvent.sport_type}</span>
            </div>
            <div className="field">
              <span className="label">Max Players:</span>
              <span className="value">{dropEvent.max_players}</span>
            </div>
          </div>
        );
      };
      
      const GetEventCardFooter = () =>{
        return <button
                  className="btn"
                  onClick={e => {console.log("interested!"); setShowPopup(false)}}
                >Confirm
              </button>
      } 


    const image = randomSampleImage();
    return <div className="card-wrapper">
        <Popup title={dropEvent.event_name} isOpen={showPopup} setClose={handleClosePopup} children={eventCardBodyPopup()} footer={GetEventCardFooter()}></Popup>

        <img src={image} alt="Location 1"/>
        <h5>{dropEvent.event_name}</h5>
        <h6>{dropEvent.sport_type}</h6>
        <button className="card-button" onClick={e => handleShowPopup()}>Im Interested</button>
    </div>
}