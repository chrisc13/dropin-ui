import React, { useState} from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Welcome from "./pages/Welcome/Welcome";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProfilePage } from "./pages/Profile/Profile";
import { EditProfilePage } from "./pages/Profile/EditProfilePage";
import { Home } from "./pages/Home/Home";
import { isProfileComplete } from "./components/Utils/Helpers";
import { Profile } from "./model/Profile";

function AppContent() {
  const { user } = useAuth(); // use auth context
  const isLoggedIn = !!user;
  const [profile, setProfile] = useState<Profile | null>(null);
  const profileIncomplete = profile ? !isProfileComplete(profile) : true;

  return (
    <>
      <Navbar show={true} profileIncomplete={profileIncomplete} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} /> {/* view profile */}
        <Route path="/editprofile/:username" element={<EditProfilePage />} /> {/* edit profile */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
