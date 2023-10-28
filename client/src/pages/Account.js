import "../pages/Account.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserId } from "../hooks/useGetUserId";
import { useGetUserName } from "../hooks/useGetUserName";
import { useLogout } from "../hooks/useLogout";

export const Account = () => {
  const [popupActive, setPopupActive] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [user, setUser] = useState({});

  const userId = useGetUserId();
  const userName = useGetUserName();
  const logout = useLogout();
  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/auth/get-user/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        console.error(error.response.data.error);
      }
    };

    getUserById();
  }, []);

  const closePopup = () => {
    setPopupActive(false);
    setOldPassword("");
    setNewPassword("");
  };

  const changePassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3001/auth/change-password",
        { userId, oldPassword, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      alert(response.data.message);
      closePopup();
      logout();
    } catch (error) {
      alert(error.response.data.error);
      setOldPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="Account">
      <h1>Welcome, {userName}</h1>
      <h4>Your Details</h4>

      <div className="fields">
        <div className="field field-grid-container">
          <div className="box">
            <div id="text" className="text">
              Username
            </div>
          </div>
          <div className="box">
            <div id="text" className="text">
              {user.username}
            </div>
          </div>
        </div>

        <div className="field field-grid-container">
          <div className="box">
            <div id="text" className="text">
              Email
            </div>
          </div>
          <div className="box">
            <div id="text" className="text">
              {user.email}
            </div>
          </div>
        </div>
      </div>

      <div className="addPopupAccount">
        <button onClick={() => setPopupActive(true)}>Change Password</button>
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
                className="add-password-input"
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
                className="add-password-input"
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
  );
};
