import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileBadge from "../Profile/ProfileBadge";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  show?: boolean;
  profileIncomplete?: boolean; // controls badge
  onProfileClick?: () => void; // callback when user clicks badge
}

const Navbar = ({
  show = true,
  profileIncomplete = true,
  onProfileClick,
}: NavbarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // get auth state and logout

  if (!show) return null;

  const handleLogout = () => {
    logout(); // clears sessionStorage and context
    navigate("/"); // redirect to login page
  };

  const isLoggedIn = !!user;

  return (
<div className="nav-bar">
  <Link to="/Home" className="logo">
    Drop In
  </Link>

  <ul>
    {isLoggedIn ? (
      <>
        <li>
          <ProfileBadge
            incomplete={profileIncomplete}
          />
        </li>
        <li className="logOutBtn" onClick={handleLogout}>Log Out</li>
      </>
    ) : (
      <li className="logInBtn" onClick={() => navigate("/")}>Log In</li>
    )}
  </ul>
</div>

  );
};

export default Navbar;
