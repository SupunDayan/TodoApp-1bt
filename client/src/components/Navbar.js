import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"
// import { useCookies } from "react-cookie";

export const Navbar = () => {
//   const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    // setCookies("access_token", "");
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("userId");
    navigate("/");
  };
  return (
    <div className="navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/account">Account</Link>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
