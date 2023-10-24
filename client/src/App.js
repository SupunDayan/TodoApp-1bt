import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {Login} from './pages/Login';
import {Register} from './pages/Register';
import { Account } from './pages/Account';
import {Home} from './pages/Home';
import {ForgotPassword} from './pages/ForgotPassword';
import {ResetPassword} from './pages/ResetPassword';


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
          <Route path="/account" element={<Account />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
