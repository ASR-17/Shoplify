// src/context/NotificationContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { scanInventoryAlerts } from "@/services/alertsApi";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastScanResult, setLastScanResult] = useState(null);

  useEffect(() => {
    const KEY = "lastInventoryScanAt";
    const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

    const last = Number(localStorage.getItem(KEY) || 0);
    const now = Date.now();

    if (now - last < COOLDOWN_MS) return;

    scanInventoryAlerts()
      .then((data) => {
        localStorage.setItem(KEY, String(now));
        setLastScanResult(data);
      })
      .catch(() => {
        // ignore errors - app should still work even if scan fails
      });
  }, []);

  const value = useMemo(
    () => ({
      unreadCount,
      setUnreadCount,
      lastScanResult, // optional: useful for debugging / showing toast later
    }),
    [unreadCount, lastScanResult]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotificationContext must be used inside NotificationProvider"
    );
  }
  return ctx;
};
