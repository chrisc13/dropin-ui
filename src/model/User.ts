export interface User{
    id: string,
    username: string,
    //profile: UserProfile
}
export interface UserProfile{
    firstName: string,
    lastName: string,
    bio: string,
    profileImageUrl: string,
    sports: string[]
}

export interface AuthRequest {
    username: string;
    password: string;
  }
  