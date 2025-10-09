import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./TabBar.css";

export const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: "/profile", icon: "/images/user.png", alt: "Profile" },
    { path: "/", icon: "/images/home.png", alt: "Home" },
    { path: "/messages", icon: "/images/chat.png", alt: "Chat" }
  ];

  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          onClick={() => navigate(tab.path)}
          className={location.pathname === tab.path ? "active" : ""}
        >
          <img src={tab.icon} alt={tab.alt} className="tab-icon" />
        </button>
      ))}
    </div>
  );
}

