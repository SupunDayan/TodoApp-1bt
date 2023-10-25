import { Dashboard } from "./Dashboard";
import { Navigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const Home = () => {
  return (
    <div>
      <Navbar />
      {localStorage.getItem("authToken") ? (
        <Dashboard />
      ) : (
        <Navigate to="login" />
      )}
    </div>
  );
};
