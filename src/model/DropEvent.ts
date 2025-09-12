export interface DropEvent {
    id?: string;        // keep as string (GUID or ObjectId)
    eventName: string;
    eventDetails: string;
    sport: string;
    location: string;
    locationDetails: string;
    start: Date;             // corresponds to DateTime in C#
    end: Date;
    maxPlayers: number;
    currentPlayers: number;
    attendees: Attendee[],
    organizerName: string;    // reference to User by ID
    organizerId: string;    // reference to User by ID
    latitude: number;
    longitude: number;
    [key: string]: any; 
  }
  export interface Attendee{
    username: string,
    id: string
  }