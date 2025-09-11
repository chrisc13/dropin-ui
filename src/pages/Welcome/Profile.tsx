import React from "react";
import { useAuth } from "../../context/AuthContext";

export const Profile: React.FC = () => {
  const { user } = useAuth(); // get user from context

  if (!user) return <>You must log in to view your profile.</>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {user.username}</p>
      {/* Add more user fields as needed */}
    </div>
  );
};
