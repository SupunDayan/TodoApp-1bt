import React from 'react';
import { Dashboard } from "./Dashboard"
import { Navigate } from 'react-router-dom';

export const Home = () => {
// isAuthenticated = localStorage.getItem("authToken");
   
  return (
    
    <div>
      {localStorage.getItem("authToken") ? <Dashboard/> : <Navigate to = "login"/>}  
    </div>
  )
}

