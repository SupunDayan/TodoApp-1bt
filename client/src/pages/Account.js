import "../pages/Account.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserId } from "../hooks/useGetUserId";
import { Navbar } from "../components/Navbar";
import { useGetUserName } from "../hooks/useGetUserName";

export const Account = () => {
  const [popupActive, setPopupActive] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [user, setUser] = useState({});

  const userId = useGetUserId();
  const userName = useGetUserName();

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/auth/get-user/${userId}`
        );
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getUserById();
  }, [userId]);

  const changePassword = async () => {

    try {
      const response = await axios.put(
        "http://localhost:3001/auth/change-password",
        { userId: userId, oldPassword: oldPassword, newPassword: newPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      alert(response.data.message);
      setPopupActive(false);
      setOldPassword("");
      setNewPassword("");
      
    } catch (err) {
      console.error(err);
    }
  };

  const closePopup = () => {
    setPopupActive(false);
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <>
      <Navbar />
      <div className="Account">
        <h1>Welcome, {userName}</h1>
        <h4>Your Details</h4>

        <div className="tasks">
          <div className="task">
            <div className="box">
              <div id="task" className="task">
                Username
              </div>
            </div>
            <div className="box">
              <div id="task" className="task">
                {user.username}
              </div>
            </div>
          </div>

          <div className="task">
            <div className="box">
              <div id="task" className="task">
                Email
              </div>
            </div>
            <div className="box">
              <div id="task" className="task">
                {user.email}
              </div>
            </div>
          </div>
        </div>

        <div className="addPopupAccount" onClick={() => setPopupActive(true)}>
          <button>Change Password</button>
        </div>

        {popupActive ? (
          <div className="popupAccount">
            <div className="closePopupAccount" onClick={() => closePopup()}>
              x
            </div>
            <div className="content">
              <h3>Change Password</h3>
              <form className="changePasswordForm">
              <input
                type="password"
                className="add-task-input"
                id="oldPassword"
                name="oldPassword"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
                autoComplete="on"
              />

              <div style={{ padding: "20px" }}></div>
              <input
                type="password"
                className="add-task-input"
                id="newPassword"
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="on"
              />
              </form> 
              <div className="button" onClick={changePassword}>
              
                Change
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
