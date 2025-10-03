import React, { useState } from "react";
import { Home } from "../Home/Home";
import "./Welcome.css";
import { handleRegisterRequest, handleLoginRequest } from "../../services/authService";
import { AuthRequest, User } from "../../model/User";
import { useAuth } from "../../context/AuthContext"; // hook to access context
import { useNavigate } from "react-router-dom";
import { Attribution } from "../../components/Attribution";

const Welcome: React.FC = () =>{
    const { user, login } = useAuth(); // get login function from context

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showRegister, setShowRegister] = useState(false)
    const [showLogin, setShowLogin] = useState(true)
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const switchToRegister = () => {
      setShowLogin(false);
      setShowRegister(true);
    };
    
    const switchToLogin = () => {
      setShowLogin(true);
      setShowRegister(false);
    };

    const handleLogin = async () => {
      const loginRequest: AuthRequest = {
        username: username.toLowerCase().trim(),
        password: password.trim()
      }

      try {
        const loggedInUser = await handleLoginRequest(loginRequest);
        login(loggedInUser); 
        setLoading(false);
        navigate("/home", { replace: true }); 

      } catch (error: any) {
        if (error.message === "Invalid credentials") {
          setError("Username or password is incorrect");
        } else {
          setError("Something went wrong, please try again");
        }
  
      }
    };

    const handleRegister = async () => {
      const registerRequest: AuthRequest = {
        username: username.toLowerCase().trim(),
        password: password.trim()
      }

      try {
        await handleRegisterRequest(registerRequest);
        await handleLogin(); // auto-login after registration
        const user: User = {
          id: "",
          username: registerRequest.username,
        }
        login(user)
        setLoading(false);
      } catch (error) {
        console.error("Error register:", error);
      }
    };


    const handleSubmitLogin = () =>{
      setLoading(true);
      handleLogin()
    }


    const handleSubmitRegister = () => {
      setLoading(true);
      if (username.length < 3) {
        alert("Username must be at least 3 characters");
        setLoading(false);
        return;
      }
  
      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        setLoading(false);
        return;
      }
      setLoading(true);

      console.log("Username:", username);
      console.log("Password:", password);

      handleRegister()
    };
    

    if (user) {
      // Only show Home when logged in
      return <Home />;
    }

    return <div className="landing-page">
      {error && <p style={{ color: "red" }}>{error}</p>} {}
              <section className="landing-top">
                <h1>Drop In</h1>
                <p>Find your next pick-up game or workout buddy with ease.</p>
                
                        
                {showLogin && (
                  <div className="login-form">
                    {loading && <p className="loading-text">Logging in...</p>}
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      onClick={handleSubmitLogin}
                    >
                      Log In
                    </button>
                    <div className="login-link" onClick={switchToRegister}>
                      Don't have an account? Click here to Register
                    </div>
                  </div>
                )}

                {showRegister && (
                  <div className="register-form">
                    {loading && <p className="loading-text">Creating account...</p>}
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      minLength={4}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      onClick={handleSubmitRegister}
                    >
                      Register
                    </button>
                    <div className="register-link" onClick={switchToLogin}>
                      Already have an account? Click here to Login
                    </div>
                  </div>
                )}

            </section> 
        
              <section className="landing-bottom">
                <h2 className="bottom-text">Why Drop In?</h2>
                <div className="features">
                  <div className="feature-card">
                    <img className="white-icon" src="images/sports.png" alt="Feature 1" />
                    <p>Quickly find local games happening near you and join instantly.</p>
                  </div>
                  <div className="feature-card">
                    <img className="white-icon" src="images/support.png" alt="Feature 2" />
                    <p>Connect with workout buddies and friends who share your schedule.</p>
                  </div>
                  <div className="feature-card">
                    <img className="white-icon" src="images/reminder.png" alt="Feature 3" />
                    <p>Plan ahead with event notifications and reminders for your favorite games.</p>
                  </div>
                </div>
              </section>
              <Attribution></Attribution>
            </div>
    
}

export default Welcome;