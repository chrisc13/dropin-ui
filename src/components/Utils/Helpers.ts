import { Profile } from "../../model/Profile";

export function shortenAddress(full: string, maxParts: number = 2): string {
    const parts = full.split(",");
    if (parts.length > maxParts) return parts.slice(0, maxParts).join(","); 
    return full;
  }
  

export const isProfileComplete = (profile: Profile | null): boolean => {
  if (!profile) return false;
  return !!profile.firstName &&
         !!profile.lastName &&
         !!profile.bio &&
         !!profile.profileImageUrl &&
         profile.sportLevel && Object.keys(profile.sportLevel).length > 0;
};