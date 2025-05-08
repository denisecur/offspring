// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken } from '../helpers';
import axios from 'axios';
import { API } from '../constant';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [hasFullAccess, setHasFullAccess] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      return;
    }

    axios
      .get(
        `${API}/users/me?populate=ausbildung,role.permissions,Rollen.permissions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        const userData = response.data;

        // Merge built-in role and custom Rollen relations
        const rolesArray = [
          ...(userData.role ? [userData.role] : []),
          ...(Array.isArray(userData.Rollen) ? userData.Rollen : []),
        ];

        // Determine if any permission grants full access
        const fullAccess = rolesArray.some((r) =>
          Array.isArray(r.permissions) &&
          r.permissions.some((p) => p.full_access)
        );

        setUser(userData);
        setHasFullAccess(fullAccess);
        localStorage.setItem('user', JSON.stringify(userData));
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        removeToken();
        setUser(null);
        setHasFullAccess(false);
        localStorage.removeItem('user');
      });
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
    setHasFullAccess(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, hasFullAccess, setHasFullAccess, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
