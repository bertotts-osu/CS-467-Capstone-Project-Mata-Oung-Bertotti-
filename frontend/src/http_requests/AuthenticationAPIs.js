// AuthenticationAPIs.js
// This module provides API functions for user authentication, signup, login, and fetching user stats, including token management and error handling.

import axios from "axios";
import { jwtDecode } from "jwt-decode";

const path = "/auth";

// Global Axios interceptor for token expiry and invalid token errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.status === 403 ||
        error.response.data?.error === "Invalid token")
    ) {
      // Remove tokens and redirect to login on auth error
      localStorage.removeItem("authToken");
      localStorage.removeItem("authRefreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * Registers a new user with the provided details.
 * @param {object} param0 - User details (name, username, email, password)
 * @returns {Promise} Axios response
 */
export async function signup({ name, username, email, password }) {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}${path}/signup`, // api endpoint
    { name: name, username: username, password: password, email: email }, // fields passed in HTTP body
    { headers: { "Content-Type": "application/json" } } // HTTP header(s)
  );
  return response;
}

/**
 * Logs in a user with the provided credentials.
 * @param {object} param0 - User credentials (username, password)
 * @returns {Promise} Axios response
 */
export async function login({ username, password }) {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}${path}/login`, // api endpoint
    {  username: username, password: password }, // fields passed in HTTP body
    { headers: { "Content-Type": "application/json" } } // HTTP header(s)
  );
  return response;
}

/**
 * Decodes the JWT token from localStorage and returns the user ID (sub claim).
 * @returns {string|null} User ID or null if not found/invalid
 */
export function getUserIdFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub || null;
  } catch (e) {
    return null;
  }
}

/**
 * Fetches user statistics from the backend using the stored JWT token.
 * @returns {Promise} Axios response
 */
export async function fetchUserStats() {
  const userId = getUserIdFromToken();
  const token = localStorage.getItem("authToken");
  if (!userId || !token) throw new Error("User not authenticated");
  const response = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/users/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}