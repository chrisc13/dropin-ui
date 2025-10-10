import React from "react";

interface AvatarProps {
  username: string;
  avatarUrl?: string;
  size?: number; // defaults to 150
}

export const Avatar: React.FC<AvatarProps> = ({ username, avatarUrl, size = 150 }) => {
  const firstLetter = username.charAt(0).toUpperCase();

  return avatarUrl ? (
    <img
      src={avatarUrl}
      alt={username}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #ccc",
        display: "block",
      }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#777",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size / 2,
        fontWeight: "bold",
        border: "2px solid #ccc",
        userSelect: "none",
      }}
    >
      {firstLetter}
    </div>
  );
};
