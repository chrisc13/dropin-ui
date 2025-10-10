import { AuthRequest, ProfileImage, User } from "../model/User";
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const login = async (loginRequest: AuthRequest): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Authentication/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("Invalid credentials");
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();

    if (data.token) {
      sessionStorage.setItem("accessToken", data.token);
    }

    return data.appUser as User;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const register = async (registerRequest: AuthRequest): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Authentication/Register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Registration failed: ${errorText}`);
    }

    const data = await response.json();

    // store token if backend sends it
    if (data.token) {
      sessionStorage.setItem("accessToken", data.token);
    }

    return data.appUser as User;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

  const getProfileImages = async (usernames: string[]): Promise<Record<string, string>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Authentication/ProfileImages`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usernames),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      return data as Record<string,string>;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // Re-throw the error after logging
    }
  };

  export const handleRegisterRequest = async(registerRequest: AuthRequest):Promise<User> => {
    return await register(registerRequest);
  }
  
  export const handleLoginRequest = async (loginRequest: AuthRequest): Promise<User> => {
    return await login(loginRequest);
  };
  export const handleProfileImagesRequest = async (usernames: string[]): Promise<Record<string, string>> => {
    return await getProfileImages(usernames);
  };

