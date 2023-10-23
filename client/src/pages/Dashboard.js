import { useNavigate } from "react-router-dom";

export const Dashboard = () => {

    const navigate = useNavigate();

const logoutHandler = () =>{
    localStorage.removeItem("authToken");
    navigate("/login")
};

  return (
    <div>
      Dashboard
      <button onClick={logoutHandler}>logout</button>

      
    </div>
  )
}

