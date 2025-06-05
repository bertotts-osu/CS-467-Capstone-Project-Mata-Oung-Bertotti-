// ChatGptAPI.js
// This module provides an API function for sending messages to the backend ChatGPT integration and receiving replies.

import axios from "axios";

/**
 * Sends a message payload to the backend ChatGPT API and returns the assistant's reply.
 * @param {object} payload - The message payload (messages, problem, code, etc.)
 * @returns {Promise<string>} The assistant's reply
 */
export async function sendMessageToGPT(payload) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/chat`,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.reply;
  } catch (error) {
    console.error("Error sending message to GPT:", error);
    throw error;
  }
}
