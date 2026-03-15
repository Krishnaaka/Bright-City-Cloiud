import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MainLayout from './components/MainLayout';
import Navbar from './components/Navbar'; // Keep for public pages if needed, or remove later

import Settings from './pages/Settings';

const AppContent = () => {
  const location = useLocation();
  const publicPaths = ['/login', '/register', '/'];
  const isPublic = publicPaths.includes(location.pathname);

  const content = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<CitizenDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Settings />} /> {/* Fallback to settings or a 404 */}
    </Routes>
  );

  if (isPublic) {
    return (
      <div className="min-h-screen">
        {location.pathname !== '/' && <Navbar />} {/* Optional Navbar for auth pages */}
        {content}
      </div>
    );
  }

  return <MainLayout>{content}</MainLayout>;
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
