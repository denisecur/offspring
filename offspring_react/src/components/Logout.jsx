// src/components/Logout.jsx
import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useAuthContext();

  React.useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/login" replace />;
};

export default Logout;
