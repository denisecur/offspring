import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import routes from "./AppRoutes";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ThemeSwitcher from "./ThemeSwitcher";
import getThemeColors from "./theme"; // Holt das aktive Theme

const queryClient = new QueryClient();
const router = createBrowserRouter(routes);

const App = () => {
  const [theme, setTheme] = useState(getThemeColors()); // Theme aus Storage laden

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(getThemeColors()); // Theme updaten, wenn sich `data-theme` ändert
    };

    window.addEventListener("themeChange", handleThemeChange); // Custom Event für Theme-Wechsel
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeSwitcher /> {/* Theme wechseln */}
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
