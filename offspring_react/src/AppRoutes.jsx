// src/AppRoutes.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Profil from "./pages/Profil/Profil";
import Login from "./pages/Login/Login";
import ListView from "./components/ListView";
import Noten from "./pages/Noten/Noten";
import Berichtshefte from "./pages/Berichtshefte/Berichtshefte";
import Layout from "./Layout";
import Orders from "./components/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import FullAccessRoute from "./components/FullAccessRoute";
import ChefDashboard from "./components/Dashboard/ChefDashboard";
import AzubiDashboard from "./components/Dashboard/AzubiDashboard";

const AppRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "noten", element: <ProtectedRoute><Noten /></ProtectedRoute> },
      { path: "listView", element: <ProtectedRoute><ListView /></ProtectedRoute> },
      { path: "profil", element: <ProtectedRoute><Profil /></ProtectedRoute> },
      { path: "berichtshefte", element: <ProtectedRoute><Berichtshefte /></ProtectedRoute> },
      { path: "orders", element: <ProtectedRoute><Orders /></ProtectedRoute> },
      { path: "chef-dashboard", element: <FullAccessRoute><ChefDashboard /></FullAccessRoute> },
      { path: "azubi-dashboard", element: <ProtectedRoute><AzubiDashboard /></ProtectedRoute> },
    ],
  },
  {
    path: "/login",
    element: <Login />
  },
];

export default AppRoutes;
