import "./ProfileBadge.css";
import React from "react";
import { useNavigate } from "react-router-dom";

interface AvatarWithUsernameProps{
    username: string,
    avatarUrl: string
}

export const AvatarWithUsername: React.FC<AvatarWithUsernameProps>= ({username, avatarUrl}) =>{
    const navigate = useNavigate();
    
    return (<div className="avatar-name-wrapper" onClick={() => navigate(`/profile/${username}}`)}>
        <img className="avatar"> src={avatarUrl}</img>
        <div className="username">{username}</div>
    </div>)
}
