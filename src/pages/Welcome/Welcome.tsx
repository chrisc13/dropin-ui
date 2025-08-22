import React, { useState } from "react";
import { Home } from "./Home/Home";
import "./Welcome.css";

const Welcome = () =>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);


    const updateUsername = (value: string) =>{
        setUsername(value);
    }

    const updatePassword = (value: string) =>{
        setPassword(value);
    }

    const handleSubmitLogin = (e: any) =>{
        e.preventDefault();
        setLoading(true);
        console.log("loading")
        setTimeout(() => {setLoading(false); setIsLoggedIn(true)}, 5000);
    }

    return (
        <React.Fragment>
        {isLoggedIn && <Home></Home> }
        {!isLoggedIn && (<div className="welcome-div">
        {loading && <h1>LOADING MY BOI</h1>} 
        <h1>Welcome to Drop In</h1>
        <form className="welcome-form" onSubmit={handleSubmitLogin}>  
            <label htmlFor="username_input">Username:</label>
            <input placeholder="Username" id="username_input" onChange={e => updateUsername(e.target.value)} required></input>
            <label htmlFor="password_input">Password:</label>
            <input placeholder="Password" id="password_input" onChange={e => updatePassword(e.target.value)} type="password" required></input>
            <div id="register-btn">Don't have account? Click here to Register</div>
            <button id="submit-btn-welcome" type="submit">Log In</button>
        </form>
        </div>)}
    </React.Fragment>
    )
}

export default Welcome;