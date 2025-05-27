import axios from "axios";
import { jwtDecode } from "jwt-decode";

const path = "/auth";

export async function signup({ name, username, email, password }) {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}${path}/signup`, // api endpoint
    { name: name, username: username, password: password, email: email }, // fields passed in HTTP body
    { headers: { "Content-Type": "application/json" } } // HTTP header(s)
  );
  return response;
}

export async function login({ username, password }) {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}${path}/login`, // api endpoint
    {  username: username, password: password }, // fields passed in HTTP body
    { headers: { "Content-Type": "application/json" } } // HTTP header(s)
  );
  return response;
}

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