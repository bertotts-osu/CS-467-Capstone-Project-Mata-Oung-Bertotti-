import axios from "axios";

const path = "/problems";

export async function fetchProblem({ pattern, difficulty }) {
  const token = localStorage.getItem("authToken");
  try {
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
  } catch (err) {
    throw err;
  }
}

export async function executeCode({ code }) {
  const token = localStorage.getItem("authToken");
  const attemptId = localStorage.getItem("attemptId");
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_SERVER_URL}/attempts/${attemptId}`,
      { code },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return response;
  } catch (err) {
    throw err;
  }
}
