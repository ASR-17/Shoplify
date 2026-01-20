import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../services/settings.service.js";

export async function getMyNotificationPreferences(req, res, next) {
  try {
    const userId = req.user?.id;
    const prefs = await getNotificationPreferences(userId);

    return res.status(200).json({
      success: true,
      ...prefs,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateMyNotificationPreferences(req, res, next) {
  try {
    const userId = req.user?.id;
    const prefs = await updateNotificationPreferences(userId, req.body || {});

    return res.status(200).json({
      success: true,
      ...prefs,
    });
  } catch (err) {
    next(err);
  }
}
