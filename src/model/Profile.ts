export interface Profile {
    id?: string;                     // FK to AppUserEntity
    firstName: string;
    lastName: string;
    username: string;                // public handle
    bio: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    profileImageUrl: string;
    sportLevel: Record<string, string>; // equivalent of Dictionary<string, string>
  }
  