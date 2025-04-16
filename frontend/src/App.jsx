import React, { useState, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {

  // determine if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated (e.g., check if a token exists in localStorage)
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);  // Done loading
  }, []);

  // Show loading spinner or message while determining if user is authenticated
  if (isLoading) return <div>Loading...</div>;

  const router = createBrowserRouter([
    /*public routes */
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },

    /*protected routes */
    {
      path: "/",
      children: [
        { path: "/", 
          element: isAuthenticated ? <Dashboard/> : <Navigate to="/login" replace /> 
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
