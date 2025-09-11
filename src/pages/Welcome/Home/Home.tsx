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
import { useAuth } from "../../../context/AuthContext";
import { CreateEventForm } from "../../../components/Form/CreateEventForm";
export const Home = () =>{
    const [events, setEvents] = useState<DropEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateEventPopup, setShowCreateEventPopup] = useState<boolean>(false);
    const { user, logout } = useAuth();

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
      sport: '',
      eventDetails: '',
      location: '',
      start: new Date(),
      maxPlayers: 0
    };
    
    const handleClosePopup = () => {
      setShowCreateEventPopup(false)
    }

    const handleCreateEventSubmit = async (values: FormFields<DropEvent>) => {
      const newEvent: DropEvent = {
        eventName: values.eventName || "",
        eventDetails: values.eventDetails || "",
        sport: values.sport || "",
        location: values.location || "",
        locationDetails: values.locationDetails || "",
        start: values.date || new Date(),
        end: values.date || new Date(),
        maxPlayers: values.maxPlayers || 0,
        currentPlayers: values.currentPlayers || 0,
        attendees: values.attendees || [],
        organizerName: "",
        organizerId: "",
        latitude: values.latitude || 0,
        longitude: values.longitude || 0
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
            <button onClick={logout}>Logout</button>
                <div className="top-banner">
                    <div className="banner-text">
                    Hello {user?.username}!
                    What's happening nearby:
                    </div>
                    <button className="create-event-button" onClick={e => setShowCreateEventPopup(true)}>Create Event</button>
                </div>
                {showCreateEventPopup && (
                  <Popup
                    title="Create Event"
                    isOpen={showCreateEventPopup}
                    setClose={() => setShowCreateEventPopup(false)}
                    footer={GetCreateEventFormFooter()}
                  >
                    <CreateEventForm
                      initialValues={initialDropEvent}
                      onSubmit={handleCreateEventSubmit}
                      formId="create-event-form"
                    />
                  </Popup>
                )}
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
                <MapComponent latitude={33.46156025} longitude={-112.32191100688232} displayName="Phoenix"></MapComponent>
            </div>
        </React.Fragment>
    )
}
