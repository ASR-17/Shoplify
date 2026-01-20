import axios from "axios";

// ✅ normalize base URL (remove trailing slash)
const RAW_BASE =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BASE_URL = RAW_BASE.replace(/\/$/, "");

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
