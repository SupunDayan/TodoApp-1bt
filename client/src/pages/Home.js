// import React from 'react';
import { Dashboard } from "./Dashboard"
import { Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const Home = () => {
 
  return (
    
    <div>
      <Navbar/>
      {localStorage.getItem("authToken") ? <Dashboard/> : <Navigate to = "login"/>}
    </div>
  )
}

