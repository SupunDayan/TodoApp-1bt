import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/login");
  };
};
