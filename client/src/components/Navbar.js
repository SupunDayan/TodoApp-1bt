import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"

export const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("userName");
    navigate("/login");
  };
  return (
    <div className="navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/account">Account</Link>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
