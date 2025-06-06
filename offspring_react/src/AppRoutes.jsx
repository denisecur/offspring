// src/AppRoutes.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ListView from "./components/ListView";
import Berichtshefte from "./pages/Berichtshefte/Berichtshefte";
import Layout from "./Layout";
import Orders from "./components/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import FullAccessRoute from "./components/FullAccessRoute";
import ChefDashboard from "./components/Dashboard/ChefDashboard";
import AzubiDashboard from "./components/Dashboard/AzubiDashboard";
import Logout from "./components/Logout";
import NotenPage from "./pages/Noten/NotenPage";
import Ranking from "./pages/ChefView/Ranking";
import Profile from "./pages/ChefView/Profile";
import AusbildungsstartPrompt from "./pages/Login/AusbildungsstartPrompt";

const AppRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/" /> },
      { path: "noten", element: <ProtectedRoute><NotenPage /></ProtectedRoute> },
      { path: "listView", element: <ProtectedRoute><ListView /></ProtectedRoute> },
      { path: "berichtshefte", element: <ProtectedRoute><Berichtshefte /></ProtectedRoute> },
      { path: "azubi-dashboard", element: <ProtectedRoute><AzubiDashboard /></ProtectedRoute> },
      { path: "ausbildungsstart", element: <ProtectedRoute><AusbildungsstartPrompt /></ProtectedRoute> },

      { path: "chef-dashboard", element: <FullAccessRoute><ChefDashboard /></FullAccessRoute> },
      { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "ranking", element: <ProtectedRoute><Ranking /></ProtectedRoute> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
];

export default AppRoutes;
