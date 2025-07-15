import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';

import { AuthContext } from '../context/AuthContext';
import Footer from './components/Footer';   // <-- new line

const App = () => {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-[url('/bgImage.svg')] bg-contain">
      <Toaster />
      {/* Main content grows to push footer to bottom if needed */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </div>

      {/* Footer always visible */}
      <Footer />
    </div>
  );
};

export default App;
