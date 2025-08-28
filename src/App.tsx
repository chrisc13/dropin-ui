import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Welcome from './pages/Welcome/Welcome';
import {useState } from "react";
import { AuthProvider } from "./context/AuthContext";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <AuthProvider>
      <Navbar show={isLoggedIn} />
      <Welcome isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </AuthProvider>
    </div>
  );
}

export default App;
