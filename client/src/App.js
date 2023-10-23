import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// import PrivateRoute from './utils/PrivateRoute.js';
import {Login} from './pages/Login';
import {Register} from './pages/Register';
import {Dashboard} from './pages/Dashboard';
import {Home} from './pages/Home';
import {ForgotPassword} from './pages/ForgotPassword';
import {ResetPassword} from './pages/ResetPassword';
import { AddTask } from './components/AddTask';
import { UpdateTask } from './components/UpdateTask';


const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home /> }/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route path="/reset-password/:resetToken" element={<ResetPassword />}/>
          <Route path="/task/create" element={<AddTask />}/>
          <Route path="/task/update" element={<UpdateTask />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
