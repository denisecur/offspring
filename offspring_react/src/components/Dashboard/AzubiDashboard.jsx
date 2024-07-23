// AzubiDashboard.jsx
import React from 'react';
import { useAuthContext } from "../../context/AuthContext";

const AzubiDashboard = () => {
  const { user } = useAuthContext();
  return <div>Welcome, Azubi {user.username}!</div>;
};

export default AzubiDashboard;
