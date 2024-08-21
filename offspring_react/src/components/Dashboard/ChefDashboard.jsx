// ChefDashboard.jsx
import React from 'react';
import { useAuthContext } from "../../context/AuthContext";

const ChefDashboard = () => {
  const { user } = useAuthContext();
  return <div>Welcome, Chef {user.username}!</div>;
};

export default ChefDashboard;
