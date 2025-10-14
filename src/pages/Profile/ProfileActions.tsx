import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropEvents } from "../../context/DropEventContext";
import { Profile } from "../../model/Profile";
import "./Profile.css"

interface ProfileActionsProps {
  profile: Profile;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({ profile }) => {
  const navigate = useNavigate();

  return (
    <div className="profile-user-wrapper">
        <div className="profile-user-actions-wrapper">
            <button
                className="btn"
                onClick={() => navigate(`/events/${profile.username}`)}
            >
                Events Info
            </button>
            <button
                className="btn"
                onClick={() => navigate(`/editprofile/${profile.username}`)}
            >
                Edit Profile
            </button>
        </div>
    </div>
  );
};
