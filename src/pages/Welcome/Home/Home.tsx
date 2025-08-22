import React, { useEffect, useState } from "react"
import './Home.css';
import { DropEvent } from "../../../model/DropEvent";
import { DropEventCard } from "../../../components/DropEventCard/DropEventCard";
//import { SampleDropEvents } from "../../../model/SampleDropEvents";
import MapComponent from "../../../components/Map/MapComponent";
import { handleGetDropEvents, handleCreateDropEvent } from "../../../services/dropEventsService";
import { GenericForm } from "../../../components/Form/Form";
import { FormFields } from "../../../types/FormFields";
import { Popup } from "../../../components/Popup/Popup";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";

export const Home = () =>{
    const [events, setEvents] = useState<DropEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateEventPopup, setShowCreateEventPopup] = useState<boolean>(false);

    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const data = await handleGetDropEvents();
            console.log(data)
            setEvents(data);
          } catch (error) {
            console.error("Error fetching drop events:", error);
          }
        };
    
        fetchEvents();
      }, []);

    const initialDropEvent: FormFields<DropEvent> = {
      event_name: '',
      location_name: '',
      max_players: ''
    };
    
    const handleClosePopup = () => {
      setShowCreateEventPopup(false)
    }

    const handleCreateEventSubmit = async (values: FormFields<DropEvent>) => {
      const newEvent: DropEvent = {
        event_id: crypto.randomUUID(),
        event_name: values.event_name || "",
        sport_type: values.sport_type || "",
        location_name: values.location_name || "",
        city: values.city || "",
        date: values.date || "",
        start_time: values.start_time || "",
        end_time: values.end_time || "",
        max_players: values.max_players || "",
        current_players: "0",
        organizer_name: values.organizer_name || "",
        organizer_ui: values.organizer_ui || "",
        latitude: values.latitude || "",
        longitude: values.longitude || "",
      };
    
      console.log('Submitted', values);
      setShowCreateEventPopup(false)
      setIsLoading(true);
      try {
        const data = await handleCreateDropEvent(newEvent);
        console.log("created event response", data);
        setEvents((prev) => [...prev, newEvent]); // use functional update
      } catch (err) {
        console.error("Error creating drop event:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    
    const GetCreateEventForm = () => {
      return (
        <GenericForm<DropEvent>
          formId="create-event-form"
          initialValues={initialDropEvent}
          onSubmit={handleCreateEventSubmit}
        />
      );
    };
    

    const GetCreateEventFormFooter = () =>{
      return <button
                className="btn"
                type="submit"
                form="create-event-form"
              >Post
            </button>
    }
    
    return(
        <React.Fragment>
            <div className="top-wrapper">
                <div className="top-banner">
                    <div className="banner-text">
                    What's happening nearby:
                    </div>
                    <button className="create-event-button" onClick={e => setShowCreateEventPopup(true)}>Create Event</button>
                </div>
                {showCreateEventPopup && <Popup title={"Create Event"} isOpen={showCreateEventPopup} setClose={handleClosePopup} footer={GetCreateEventFormFooter()}>
                  {GetCreateEventForm()}
                  </Popup>}
                {!isLoading ? <div className="event-cards-wrapper">
                {events.map((e, index) => {
                    return <DropEventCard dropEvent={e} key={index}></DropEventCard>
                })}
                </div>
                : <LoadingSpinner></LoadingSpinner>
                }
                <h2>Up for a pickup game? Search for a nearby session and drop in.</h2>
            </div>
            <div className="body-wrapper">
                <MapComponent></MapComponent>
            </div>
        </React.Fragment>
    )
}
