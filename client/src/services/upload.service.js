import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function uploadLogo(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/api/upload/logo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}
