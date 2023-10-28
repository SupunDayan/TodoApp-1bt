import { Link } from "react-router-dom";
import "./Navbar.css";
import { useLogout } from "../hooks/useLogout";

export const Navbar = () => {
  const logout = useLogout();

  return (
    <div className="navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/account">Account</Link>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
