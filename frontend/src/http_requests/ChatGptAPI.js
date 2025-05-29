import axios from "axios";

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
    if (response.status === 401 || response.data?.error === "Invalid token") {
      throw new Error("AUTH_ERROR");
    }
    return response.data.reply;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.data?.error === "Invalid token") {
      throw new Error("AUTH_ERROR");
    }
    console.error("Error sending message to GPT:", error);
    throw error;
  }
}
