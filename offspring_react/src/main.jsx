import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./components/AuthProvider/AuthProvider";
import routes from "./AppRoutes";
import "./index.css";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient()

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppPermissionsProvider>
      <RouterProvider router={router} />
      </AppPermissionsProvider>
    </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
