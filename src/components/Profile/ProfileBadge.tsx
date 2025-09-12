import React from "react";
import "./ProfileBadge.css";
import { useNavigate } from "react-router-dom";

interface ProfileBadgeProps {
  incomplete: boolean; // show badge only if profile is incomplete
}

const ProfileBadge: React.FC<ProfileBadgeProps> = ({ incomplete }) => {
    const navigate = useNavigate();
    

  if (!incomplete) return null;

  return (
    <div className="profile-badge" title="Complete your profile!"  onClick={() => navigate("/profile")}>
      <span className="badge-dot"></span>
      Complete Profile
    </div>
  );
};

export default ProfileBadge;
