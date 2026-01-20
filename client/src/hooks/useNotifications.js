import { useEffect, useMemo, useState } from "react";
import notificationService from "@/services/notification.service";
import { useNotificationContext } from "@/context/NotificationContext";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const { setUnreadCount } = useNotificationContext();

  /* ================= FETCH ================= */
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data || []);

      // 🔔 sync global unread count
      const unread = (data || []).filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* ================= FILTER ================= */
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    return notifications.filter((n) => n.severity === activeFilter);
  }, [notifications, activeFilter]);

  /* ================= UNREAD ================= */
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  /* ================= ACTIONS ================= */
  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );

      setUnreadCount((c) => Math.max(c - 1, 0));
    } catch (err) {
      console.error("Mark as read failed", err);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all read failed", err);
    }
  };

  return {
    notifications,
    filteredNotifications,
    activeFilter,
    setActiveFilter,
    unreadCount,
    isLoading,
    markAsRead,
    markAllRead,
    refetch: fetchNotifications,
  };
};

export default useNotifications;
