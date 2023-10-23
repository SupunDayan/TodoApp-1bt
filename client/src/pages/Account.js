import "../pages/Account.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useGetUserId } from "../hooks/useGetUserId";
import { Navbar } from "../components/Navbar";
import { useGetUserName } from "../hooks/useGetUserName";


export const Account = () => {
  const [popupActive, setPopupActive] = useState(false);
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [user, setUser] = useState({});
  

  const navigate = useNavigate();
  const userId = useGetUserId();
  const userName = useGetUserName();

 useEffect(() => {

    const getUserById = async ()=> {
        try{
          const response = await axios.get(`http://localhost:3001/auth/get-user/${userId}`);
          setUser(response.data);
        }catch(err){
          console.error(err);
        }
    }
    getUserById();
  }, [userId]);

  const changePassword = async () => {
    try{
      const response = await axios.post("http://localhost:3001/auth/change-password",{"userId":userId, "oldPassword": oldPassword, "newPassword": newPassword}, {headers:{"Content-Type": "application/json"}});
      setPopupActive(false);
    }catch(err){
      console.error(err);
    }
    
  }


  const closePopup = () =>{
    setPopupActive(false);
    setOldPassword("");
    setNewPassword("");
  }

  return (
    <><Navbar/>
    <div className="Account"> 
      <h1>Welcome, {userName}</h1>
      <h4>Your Details</h4>
      
      <div className="tasks">
        
        <div className="task" >
            <div className="box">
                <div id = "task" className="task">Username</div>
            </div>
            <div className="box">
                <div id = "task" className="task">{user.username}</div>
            </div>             
        </div>

        <div className="task" >
              <div className="box">
                <div id = "task" className="task">Email</div>
              </div>
              <div className="box">
                <div id = "task" className="task">{user.email}</div>
              </div>             
        </div>
               
      </div>

      <div 
        className="addPopupAccount" 
        onClick={() => setPopupActive(true)}
      ><button>Change Password</button></div>

      {popupActive ? (
        <div className="popupAccount">
          <div className="closePopupAccount" 
            onClick={()=> closePopup()}
            >x</div>
          <div className="content">
            <h3>Change Password</h3> 
    
            <input 
              type="password" 
              className="add-task-input"
              value = {oldPassword} 
              onChange = {(event) => setOldPassword(event.target.value)}            
              />

            <div style={{ padding: '20px' }}>
              </div>
            <input
                type="password"
                className="add-task-input"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            <div 
              className="button" 
              onClick={changePassword}>Change</div>
          </div>
        </div>
      ): ""}

    </div>
    </>
  );
}
