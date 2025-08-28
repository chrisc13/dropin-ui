import { AuthRequest, User } from "../model/User";

const login = async (loginRequest: AuthRequest): Promise<User> => {
    try {
      const response = await fetch("http://localhost:5084/Authentication/Login",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
      });
      if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Invalid credentials");
          }
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      return data as User;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // Re-throw the error after logging
    }
  };

  const register = async (registerRequest: AuthRequest): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:5084/Authentication/Register",{
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
    return await login(loginRequest);
  };
  