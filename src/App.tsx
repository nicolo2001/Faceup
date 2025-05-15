import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ActorSearch from './pages/ActorSearch';
import ActorProfile from './pages/ActorProfile';
import OrderPage from './pages/OrderPage';
import ActorDashboard from './pages/actor/Dashboard';
import ActorRegister from './pages/actor/Register';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import SignupSuccess from './pages/auth/SignupSuccess';
import Messages from './pages/Messages';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<ActorSearch />} />
        <Route path="/actor/:actorId" element={<ActorProfile />} />
        <Route path="/order/:actorId" element={<OrderPage />} />
        <Route path="/actor/dashboard" element={<ActorDashboard />} />
        <Route path="/become-actor" element={<ActorRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-success" element={<SignupSuccess />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </Router>
  );
}

export default App;