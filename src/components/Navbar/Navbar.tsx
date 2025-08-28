import "./Navbar.css";

interface NavbarProps {
  show?: boolean;
}

const Navbar = ({ show = true }: NavbarProps) => {
    if (!show) return null; // hide navbar
  return (
    <div className="nav-bar">
      <div className="logo">Drop In</div>
      <ul>
        <li>Log In</li>
      </ul>
    </div>
  );
};

export default Navbar;
