 import { AUTH_TOKEN } from "./constant";

export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
};

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN);
};
// src/helpers.js
export const getCurrentUser = () => {
  try {
    // Annahme: Die Benutzerdaten sind im localStorage unter "user" als JSON gespeichert.
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  } catch (error) {
    console.error("Kein aktueller Benutzer gefunden:", error);
    return null;
  }
};
