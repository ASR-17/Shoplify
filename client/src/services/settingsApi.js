import axios from "axios";

// ✅ normalize base URL (remove trailing slash)
const RAW_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE_URL = RAW_BASE.replace(/\/$/, "");

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token (Authorization: Bearer <token>)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const settingsApi = {
  async getSettings() {
    const res = await api.get("/api/settings/me");
    return res.data;
  },

  async updateSettings(payload) {
    const res = await api.put("/api/settings/me", payload);
    return res.data;
  },

  async getNotificationPreferences() {
    const res = await api.get("/api/notification-preferences/me");
    return res.data;
  },

  async updateNotificationPreferences(payload) {
    const res = await api.put("/api/notification-preferences/me", payload);
    return res.data;
  },
};
