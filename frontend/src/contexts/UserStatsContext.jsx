// UserStatsContext.jsx
// This context provides user statistics and progress throughout the app, including loading, error, and refresh logic.

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchUserStats } from "../http_requests/AuthenticationAPIs";

const UserStatsContext = createContext();

/**
 * UserStatsProvider component.
 * Provides user statistics, loading, error, and refresh logic to its children via context.
 */
export function UserStatsProvider({ children }) {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches and updates user statistics from the backend.
   */
  const refreshUserStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUserStats();
      setUserStats(response.data);
    } catch (err) {
      setError("Failed to load user stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user stats on mount and when refreshUserStats changes
  useEffect(() => {
    refreshUserStats();
  }, [refreshUserStats]);

  return (
    <UserStatsContext.Provider value={{ userStats, loading, error, refreshUserStats }}>
      {children}
    </UserStatsContext.Provider>
  );
}

/**
 * useUserStats hook.
 * Returns the user statistics context value.
 */
export function useUserStats() {
  return useContext(UserStatsContext);
} 