import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import components
import SignupForm from './components/Auth/SignupForm';
import LoginForm from './components/Auth/LoginForm';
import UserProfile from './components/Profile/UserProfile';
import EditProfile from './components/Profile/EditProfile';
import SkillSearch from './components/Matchmaking/SkillSearch';
import MatchesList from './components/Matchmaking/MatchesList';
import ChatWindow from './components/Messaging/ChatWindow';
import VideoCall from './components/VideoSession/VideoCall';
import CredentialList from './components/Credentials/CredentialList';
import AdminDashboard from './components/Admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Public routes
export const publicRoutes = [
  {
    path: '/signup',
    element: <SignupForm />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
];

// Protected routes (require authentication)
export const protectedRoutes = [
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/:userId',
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/edit',
    element: (
      <ProtectedRoute>
        <EditProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/search',
    element: (
      <ProtectedRoute>
        <SkillSearch />
      </ProtectedRoute>
    ),
  },
  {
    path: '/matches',
    element: (
      <ProtectedRoute>
        <MatchesList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        <ChatWindow />
      </ProtectedRoute>
    ),
  },
  {
    path: '/video',
    element: (
      <ProtectedRoute>
        <VideoCall />
      </ProtectedRoute>
    ),
  },
  {
    path: '/credentials',
    element: (
      <ProtectedRoute>
        <CredentialList />
      </ProtectedRoute>
    ),
  },
];

// Admin routes (require admin role)
export const adminRoutes = [
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
  },
];

// All routes combined
export const allRoutes = [
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes,
]; 