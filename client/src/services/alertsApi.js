// src/services/alertsApi.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const scanInventoryAlerts = async () => {
  const token = localStorage.getItem("token"); // change key if yours is different

  const res = await axios.post(
    `${API_BASE}/api/alerts/inventory/scan`,
    {},
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    }
  );

  return res.data;
};
