import React from 'react';
import { Navigate } from 'react-router-dom';
import authStore from '../stores/authStore';

interface AuthRedirectProps {
  children: JSX.Element;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { loggedIn} = authStore();

  if (loggedIn) {
    // Si el usuario está logueado, redirige a /
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthRedirect;