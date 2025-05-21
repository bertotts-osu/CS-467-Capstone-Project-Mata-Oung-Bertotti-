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
    return response.data.reply;
  } catch (error) {
    console.error("Error sending message to GPT:", error);
    throw error;
  }
}
