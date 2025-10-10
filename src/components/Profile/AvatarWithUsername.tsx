import "./ProfileBadge.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";

interface AvatarWithUsernameProps {
  username: string;
  avatarUrl: string;
}

export const AvatarWithUsername: React.FC<AvatarWithUsernameProps> = ({ username, avatarUrl }) => {
  const navigate = useNavigate();

  return (
    <div className="avatar-name-wrapper" onClick={() => navigate(`/profile/${username}`)}>
      <Avatar username={username} avatarUrl={avatarUrl} size={45} />
      <div className="username">{username}</div>
    </div>
  );
};
