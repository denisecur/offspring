import React from "react";
import AuthProvider from "./components/AuthProvider/AuthProvider";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import App from "./App";
import Profil from "./pages/Profil/Profil";
import Berichtshefte from "./pages/Berichtshefte/Berichtshefte";
import Noten from "./pages/Noten/Noten";
import Login from "./pages/Login/Login";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, //TODO: Home.jsx
  },
  {
    path: "/login",
    element: <Login />, //TODO: Home.jsx
  },
  {
    path: "/profil",
    element: <Profil />,
  },
  {
    path: "/berichtshefte",
    element: <Berichtshefte />,
  },
  {
    path: "/noten",
    element: <Noten />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
