// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken } from '../helpers';
import axios from 'axios';
import { API } from '../constant';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [hasFullAccess, setHasFullAccess] = useState(false);

  useEffect(() => {
    const token = getToken();
    console.log('Token:', token);

    if (token) {
      axios.get(`${API}/users/me?populate=Rollen.permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          const userData = response.data;
          console.log('User Data:', userData);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));

          const fullAccess = userData.Rollen.some(role => 
            role.permissions.some(permission => permission.full_access)
          );
          console.log('Has Full Access:', fullAccess);
          setHasFullAccess(fullAccess);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setUser(null);
          setHasFullAccess(false);
          localStorage.removeItem('user');
        });
    }
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
    setHasFullAccess(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, hasFullAccess, setHasFullAccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
