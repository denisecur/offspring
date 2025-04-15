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
    /**
      {
      	"id": 1,
	      "username": "a.fritz",
	      "email": "azubi.fritz@sdv.ag",
	      "provider": "local",
	      "confirmed": true,
	      "blocked": false,
	      "createdAt": "2024-07-18T14:06:42.995Z",
	      "updatedAt": "2024-09-15T10:16:59.134Z"
}
     * 
     */
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  } catch (error) {
    console.error("Kein aktueller Benutzer gefunden:", error);
    return null;
  }
};


