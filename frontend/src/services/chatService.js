import axios from "axios";

const API_URL = "http://localhost:8080/api/chat";

export async function getChatHistory(userId) {
  const res = await axios.get(`${API_URL}/${userId}`);
  return res.data;
}

export async function saveMessage({ userId, sender, text }) {
  return axios.post(API_URL, {
    userId,
    sender,
    text,
  });
}

// New function to fetch the last N messages for context
export async function getRecentMessages(userId, limit) {
  const res = await axios.get(`${API_URL}/${userId}/recent/${limit}`);
  return res.data;
}