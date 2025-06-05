// App.jsx
// Main React component for the AI-Algorithm-Mentor frontend application.
// Handles authentication state and sets up routing for all pages.

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
import Problem from "./pages/Problem.jsx";
import { devMode } from "./config";
import ChatTest from './pages/ChatTest';
import Roadmap from "./pages/Roadmap.jsx";
import About from "./pages/About.jsx";

export default function App() {
  /**
   * Main App component. Handles authentication state and routing.
   */

  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State to track if authentication check is loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * On mount, check authentication and set up localStorage event listener.
     * In devMode, simulate login by setting a dummy token.
     */
    if (devMode && !localStorage.getItem("authToken")) {
      localStorage.setItem("authToken", "dev-token");
    }

    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    setIsLoading(false);

    // Listen for changes to authToken in localStorage
    window.addEventListener("storage", (event) => {
      if (event.key === "authToken") {
        checkAuth();
      }
    });

    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, []);

  // Show loading spinner or message while determining if user is authenticated
  if (isLoading) return <div>Loading...</div>;

  // Define the app's routes using React Router
  const router = createBrowserRouter([
      /* public routes */
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/contact", element: <ContactUs /> },

      { path: "/chat-test", element: <ChatTest /> },

      /* temp dev/test route */
      { path: "/chat-test", element: <ChatTest /> },

      /* protected routes */
      {
        path: "/",
        children: [
          {
            index: true, // This is the root path "/"
            element: devMode || isAuthenticated 
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />,
          },
          {
            path: "dashboard",
            element: devMode || isAuthenticated
              ? <Dashboard />
              : <Navigate to="/login" replace />,
          },
          {
            path: "problem",
            element: devMode || isAuthenticated
              ? <Problem />
              : <Navigate to="/login" replace />,
          },
          {
            path: "roadmap",
            element: devMode || isAuthenticated
              ? <Roadmap />
              : <Navigate to="/login" replace />,
          },
        ],
      },
      { path: "/about", element: <About /> },
  ]);

  // Render the router provider
  return <RouterProvider router={router} />;
}
