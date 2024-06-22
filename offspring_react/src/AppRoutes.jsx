import React from "react";
import { Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Profil from "./pages/Profil/Profil";
import Login from "./pages/Login/Login";
import ListView from "./components/ListView";
import Noten from "./pages/Noten/Noten";
import Berichtshefte from "./pages/Berichtshefte/Berichtshefte";
import Layout from "./Layout";
import { getToken } from "./helpers";
import NotenPage from "./pages/Noten/NotenPage";

const isAuthenticated = getToken();

const AppRoutes = [
  {
    path: "/",
    element: isAuthenticated ? <Layout /> : <Navigate to="/login" />,
    children: [
      { path: "/", element: isAuthenticated ? <Home /> : <Navigate to="/login" /> },
      { path: "noten", element: isAuthenticated ? <NotenPage /> : <Navigate to="/login" /> },
      { path: "listView", element: isAuthenticated ? <ListView /> : <Navigate to="/login" /> },
      { path: "profil", element: isAuthenticated ? <Profil /> : <Navigate to="/login" /> },
      { path: "berichtshefte", element: isAuthenticated ? <Berichtshefte /> : <Navigate to="/login" /> },
    ],
  },
  {
    path: "/login",
    element: <Login />
  },
];

export default AppRoutes;
