// src/components/FullAccessRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const FullAccessRoute = ({ children }) => {
  const { user, hasFullAccess } = useAuthContext();
  console.log('FullAccessRoute: user', user, 'hasFullAccess', hasFullAccess);

  if (!user || !hasFullAccess) {
    console.log('Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default FullAccessRoute;
