import React from 'react';
import { Navigate } from 'react-router-dom';
import authStore from '../stores/authStore';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const loggedIn = authStore((state) => state.loggedIn);

  if (!loggedIn) {
    // Si el usuario no está logueado, redirige a /login
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;