import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import routes from "./AppRoutes";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { ThemeProviderCustom, ThemeContext } from "./context/ThemeContext";

const queryClient = new QueryClient();
const router = createBrowserRouter(routes);


const AppContent = () => {
  const { muiTheme } = useContext(ThemeContext);  // Holt das MUI-Theme aus dem Context

  return (
    <MuiThemeProvider theme={muiTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeSwitcher />
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </MuiThemeProvider>
  );
};

const App = () => (
  <ThemeProviderCustom>
    <AppContent />
  </ThemeProviderCustom>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
