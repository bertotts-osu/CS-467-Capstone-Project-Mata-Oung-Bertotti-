import axios from "axios";

const path = "/problems";

export async function fetchProblem({ pattern, difficulty }) {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}${path}`,
    {
      params: { pattern, difficulty },
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  return response;
} 