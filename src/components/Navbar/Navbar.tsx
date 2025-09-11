import ProfileBadge from "../Profile/ProfileBadge";
import "./Navbar.css";

interface NavbarProps {
  show?: boolean;
  isLoggedIn: boolean;
  profileIncomplete?: boolean; // add this to show badge
  onProfileClick?: () => void; // callback when user clicks badge
}

const Navbar = ({ show = true, isLoggedIn, profileIncomplete = true, onProfileClick }: NavbarProps) => {
  if (!show) return null; // hide navbar

  return (
    <div className="nav-bar">
      <div className="logo">Drop In</div>
      <ul>
        {!isLoggedIn && <li>Log In</li>}
      </ul>

      {isLoggedIn && (
        <ProfileBadge
          incomplete={profileIncomplete}
        />
      )}
    </div>
  );
};

export default Navbar;
