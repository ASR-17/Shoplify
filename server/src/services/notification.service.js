import Notification from "../models/Notification.model.js";

export const createNotification = async ({
  user,
  type,
  title,
  description,
  severity = "info",
  actionLabel,
  actionUrl,
  metadata = {},
}) => {
  try {
    await Notification.create({
      user,
      type,
      title,
      description,
      severity,
      actionLabel,
      actionUrl,
      metadata,
    });
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};
