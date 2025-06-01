import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchUserStats } from "../http_requests/AuthenticationAPIs";

const UserStatsContext = createContext();

export function UserStatsProvider({ children }) {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    refreshUserStats();
  }, [refreshUserStats]);

  return (
    <UserStatsContext.Provider value={{ userStats, loading, error, refreshUserStats }}>
      {children}
    </UserStatsContext.Provider>
  );
}

export function useUserStats() {
  return useContext(UserStatsContext);
} 