import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  console.log('ProtectedRoute: user', user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
