import axios from "axios";

// If you already have an axios instance, replace this with your instance import.
// Example: import api from "@/services/api";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Attach token (your app uses Authorization: Bearer <token>)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // adjust if you store differently
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const settingsApi = {
  // GET /api/settings/me
  async getSettings() {
    const res = await api.get("/api/settings/me");
    // backend returns: { success:true, store, branding }
    return res.data;
  },

  // PUT /api/settings/me
  async updateSettings(payload) {
    const res = await api.put("/api/settings/me", payload);
    return res.data;
  },

  // GET /api/notification-preferences/me
  async getNotificationPreferences() {
    const res = await api.get("/api/notification-preferences/me");
    // backend returns: { success:true, alertsEnabled, lowStockThreshold, notifications }
    return res.data;
  },

  // PUT /api/notification-preferences/me
  async updateNotificationPreferences(payload) {
    const res = await api.put("/api/notification-preferences/me", payload);
    return res.data;
  },
};
