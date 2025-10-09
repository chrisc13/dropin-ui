import { AuthRequest, User } from "../model/User";
const API_BASE_URL = process.env.REACT_APP_API_URL;


const login = async (username: string, password: string): Promise<User> => {
  try {
    const params = new URLSearchParams({ username, password });
    const response = await fetch(`${API_BASE_URL}/Authentication/Login?${params.toString()}`, {
      method: 'POST', // keep POST if your backend expects it
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid credentials");
      }
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    sessionStorage.setItem("accessToken", data.token);
    return data.appUser as User;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

  const register = async (registerRequest: AuthRequest): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Authentication/Register`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerRequest),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      await response.json();
      return true;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // Re-throw the error after logging
    }
  };

  export const handleRegisterRequest = async(registerRequest: AuthRequest):Promise<boolean> => {
    return await register(registerRequest);
  }
  
  export const handleLoginRequest = async (loginRequest: AuthRequest): Promise<User> => {
    return await login(loginRequest.username, loginRequest.password);
  };
  