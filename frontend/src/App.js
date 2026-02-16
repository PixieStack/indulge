import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import Discovery from './pages/Discovery';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <div className="logo-pulse">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M30 5L35.5 25H55L39.5 37.5L45 57.5L30 45L15 57.5L20.5 37.5L5 25H24.5L30 5Z" fill="url(#gold-gradient)"/>
              <defs>
                <linearGradient id="gold-gradient" x1="5" y1="5" x2="55" y2="57.5">
                  <stop stopColor="#F4D03F"/>
                  <stop offset="0.5" stopColor="#D4AF37"/>
                  <stop offset="1" stopColor="#B8860B"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <style>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #030508;
          }
          .logo-pulse {
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route path="/setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
          <Route path="/messages/:matchId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
