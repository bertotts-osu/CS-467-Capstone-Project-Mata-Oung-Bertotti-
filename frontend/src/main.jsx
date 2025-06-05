// main.jsx
// Entry point for the AI-Algorithm-Mentor React frontend application.
// Renders the App component and wraps it with context providers.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserStatsProvider } from "./contexts/UserStatsContext";
// import { TourProvider } from "./contexts/TourContext";

createRoot(document.getElementById("root")).render(
  // <StrictMode> // Uncomment for additional React checks in development
    // <TourProvider> // Uncomment if using guided tours/context
      <UserStatsProvider>
        <App />
      </UserStatsProvider>
    // </TourProvider>
);
