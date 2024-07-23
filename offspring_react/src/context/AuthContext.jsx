// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../helpers';
import axios from 'axios';
import { API } from '../constant';

const AuthContext = createContext({
  user: undefined,
  isLoading: false,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasFullAccess, setHasFullAccess] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      axios.get(`${API}/users/me?populate=Rollen.permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          const userData = response.data;
          setUser(userData);
          const fullAccess = userData.Rollen.some(role =>
            role.permissions.some(permission => permission.full_access)
          );
          setHasFullAccess(fullAccess);
        })
        .catch(() => {
          setUser(null);
          setHasFullAccess(false);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, hasFullAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
