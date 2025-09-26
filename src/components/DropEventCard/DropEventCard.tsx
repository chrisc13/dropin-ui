import { useState } from "react";
import { DropEvent } from "../../model/DropEvent"
import { handleAttendDropEvent } from "../../services/dropEventsService";
import { Popup } from "../Popup/Popup";
import "./DropEventCard.css";
import { shortenAddress } from "../Utils/Helpers";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { EventPopupBody } from "../Form/EventBodyPopup";
import { EventFooter } from "../Form/EventFooter";
import { formatEventDate } from "../Utils/DateUtils";

export interface DropEventCardProps{
    dropEvent:  DropEvent,
    isLoggedIn: boolean, 
    isAttending: boolean
}

export const DropEventCard: React.FC<DropEventCardProps> = ({dropEvent, isLoggedIn, isAttending}) => {
    const [showPopup, setShowPopup] = useState(false);

    const randomSampleImage = () =>{
        let images = ["soccer1.jpg", "running3.jpg", "football1.jpg"]
        const randomIndex = Math.floor(Math.random() * 3);

        return "/images/"+images[randomIndex];
    }

    const handleShowPopup = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);


    const image = randomSampleImage();
    return <div className={isAttending ? "card-wrapper attending" : "card-wrapper"} onClick={e => handleShowPopup()} >
        <Popup title={dropEvent.eventName} isOpen={showPopup} setClose={handleClosePopup} children={<EventPopupBody dropEvent={dropEvent} />} 
           footer={
            <EventFooter
              dropEvent={dropEvent}
              isLoggedIn={isLoggedIn}
              onClose={() => setShowPopup(false)}
            />
          }  
      ></Popup>

        <img src={image} alt="Location 1"/>
        <h5>{shortenAddress(dropEvent.location)}</h5>
        <h6>{dropEvent.sport} - {formatEventDate(dropEvent.start as any)}</h6>
        <h6>Organized by: {dropEvent.organizerName}</h6>

        <div className="card-footer">Im Interested</div>
    </div>
}