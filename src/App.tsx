import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Welcome from './pages/Welcome/Welcome';
import {useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Profile } from "./pages/Welcome/Profile";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!sessionStorage.getItem("accessToken");
  });
  
  return (
    <AuthProvider>
    <Router>
      <Navbar show={isLoggedIn} isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;
