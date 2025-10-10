export interface User{
    id: string,
    username: string,
    profileImageUrl: string
}

export interface AuthRequest {
    username: string;
    password: string;
  }

export interface ProfileImage{
    username: string,
    profileImageUrl: string
}