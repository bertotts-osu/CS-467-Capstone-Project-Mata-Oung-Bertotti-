// ProblemAPIs.js
// This module provides API functions for fetching coding problems and submitting code for execution.

import axios from "axios";

const path = "/problems";

/**
 * Fetches a coding problem from the backend by pattern and difficulty.
 * @param {object} param0 - Problem query (pattern, difficulty)
 * @returns {Promise} Axios response
 */
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

/**
 * Submits user code for execution and grading for the current attempt.
 * @param {object} param0 - Code submission ({ code })
 * @returns {Promise} Axios response
 */
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
