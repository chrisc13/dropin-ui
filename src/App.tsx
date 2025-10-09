import React, { useState} from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Welcome from "./pages/Welcome/Welcome";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import { ProfilePage } from "./pages/Profile/Profile";
import { EditProfilePage } from "./pages/Profile/EditProfilePage";
import { Home } from "./pages/Home/Home";
import { isProfileComplete } from "./components/Utils/Helpers";
import { Profile } from "./model/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import {Helmet} from "react-helmet";
import { EventsPage } from "./pages/Events/Events";
import { ThreadsPage } from "./pages/Threads/Threads";
import { ThreadDetails } from "./pages/Threads/ThreadDetails";
import ChatWindow from "./components/Messaging/ChatWindow";
import Messages from "./pages/Messages/Messages";
import { TabBar } from "./components/TabBar/TabBar";

function App() {
  return (
    <AuthProvider>
      <Helmet>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Helmet>
      <Router>
        <AppContent />  {/* <-- Move logic into here */}
      </Router>
    </AuthProvider>
  );
}


function AppContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const profileIncomplete = profile ? !isProfileComplete(profile) : true;
  const location = useLocation();

  // Hide Navbar on /welcome
  const hideNavbarRoutes = ["/welcome"]; 
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname.toLowerCase());
  return (
    <>
      {!shouldHideNavbar && (
        <Navbar show={true} profileIncomplete={profileIncomplete} />
      )}
      <Routes>
        {/* Root route */}
        <Route
          path="/"
          element={
            <Home />
        }
        />
        <Route
          path="/welcome"
          element={
              <Welcome />
          }
        />
        <Route
          path="/events"
          element={
              <EventsPage />
          }
        />
         <Route
          path="/threads"
          element={
              <ThreadsPage />
          }
        />
         <Route
          path="/threads/:id"
          element={
              <ThreadDetails />
          }
        />
        {/* Protected routes */}
        <Route
          path="/home"
          element={
              <Home />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
              </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
              <ProfilePage />
          }
        />
         <Route
          path="/chat/:username"
          element={
              <ChatWindow />
          }
        />
        <Route
          path="/messages/"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editprofile/:username"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!shouldHideNavbar  && <TabBar></TabBar>}
    </>
  );
}
export default App;
