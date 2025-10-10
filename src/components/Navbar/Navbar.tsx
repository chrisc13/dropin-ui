import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileBadge from "../Profile/ProfileBadge";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../Profile/Avatar";
interface NavbarProps {
  show?: boolean;
  profileIncomplete?: boolean;
  onProfileClick?: () => void;
}

const Navbar = ({
  show = true,
  profileIncomplete = true,
  onProfileClick,
}: NavbarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!show) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isLoggedIn = !!user;

  const SetNavBarIcon = () =>{
    if (isLoggedIn){
      return <Avatar username={user.username} avatarUrl={user.profileImageUrl} size={60} />   // Large
    }

    return <>☰</>
  }

  const SetNavBar = () =>{
    {/* Hamburger button for mobile */}
    return (<><button
    className="hamburger"
    onClick={() => setMenuOpen((prev) => !prev)}
  >
    {SetNavBarIcon()}
  </button>

  <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
    {isLoggedIn ? (
      <>
        <li onClick={onProfileClick}>
          <ProfileBadge incomplete={profileIncomplete} />
        </li>
        <li className="logOutBtn" onClick={handleLogout}>
          Log Out
        </li>
      </>
    ) : (
      <li className="logInBtn" onClick={() => navigate("/welcome")}>
        Log In
      </li>
    )}
  </ul></>)
  }

  return (
    <nav className="nav-bar">
      <Link to="/home" className="logo">
        Drop In
      </Link>

      {!isLoggedIn ?  <li className="logInBtn" onClick={() => navigate("/welcome")}>Log In
      </li> :SetNavBar()}
      
    </nav>
  );
};

export default Navbar;
