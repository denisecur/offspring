import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Profil from "./pages/Profil/Profil";
import { getToken } from "./helpers";
import Login from "./pages/Login/Login";
import ListView from "./components/ListView";
import Noten from "./pages/Noten/Noten";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ListView />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/noten"
        element={getToken() ? <Noten /> : <Navigate to="/login" />}
      />
      <Route
        path="/listView"
        element={getToken() ? <ListView /> : <Navigate to="/login" />}
      />
      <Route
        path="/profil"
        element={getToken() ? <Profil /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default AppRoutes;
