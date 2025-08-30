export interface DropEvent {
    id?: string;        // keep as string (GUID or ObjectId)
    eventName: string;
    sportType: string;
    locationName: string;
    city: string;
    date: Date;             // corresponds to DateTime in C#
    startTime: string;
    endTime: string;
    maxPlayers: number;
    currentPlayers: number;
    organizerName: string;    // reference to User by ID
    organizerId: string;    // reference to User by ID
    latitude: number;
    longitude: number;
  }
  