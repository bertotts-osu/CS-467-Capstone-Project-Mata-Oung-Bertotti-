import React, { useState, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import { devMode } from "./config";

export default function App() {

  // determine if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  // Simulate login in devMode
  if (devMode && !localStorage.getItem("authToken")) {
    localStorage.setItem("authToken", "dev-token");
  }

  const token = localStorage.getItem("authToken");
  if (token) {
    setIsAuthenticated(true);
  }

  setIsLoading(false);
}, []);

  // Show loading spinner or message while determining if user is authenticated
  if (isLoading) return <div>Loading...</div>;

  const router = createBrowserRouter([
      /* public routes */
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/contact", element: <ContactUs /> }, // ✅ Added here

      /* protected routes */
      {
        path: "/",
        children: [
          {
            path: "/dashboard",
            element: devMode || isAuthenticated
            ? <Dashboard />
            : <Navigate to="/login" replace />,
          },
        ],
      },
  ]);

  return <RouterProvider router={router} />;
}
