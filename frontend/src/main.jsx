import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserStatsProvider } from "./contexts/UserStatsContext";
// import { TourProvider } from "./contexts/TourContext";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    // <TourProvider>
      <UserStatsProvider>
        <App />
      </UserStatsProvider>
    // </TourProvider>
);
