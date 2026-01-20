import api from "./api";

/* ================= GET ================= */
const getNotifications = async () => {
  const { data } = await api.get("/notifications");
  return data.data;
};

/* ================= MARK ONE READ ================= */
const markAsRead = async (id) => {
  await api.patch(`/notifications/${id}/read`);
};

/* ================= MARK ALL READ ================= */
const markAllRead = async () => {
  await api.patch("/notifications/read-all");
};

export default {
  getNotifications,
  markAsRead,
  markAllRead,
};
