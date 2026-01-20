import {
  getOrCreateSettings,
  updateSettings,
} from "../services/settings.service.js";

export async function getMySettings(req, res, next) {
  try {
    const userId = req.user?.id;
    const doc = await getOrCreateSettings(userId);

    return res.status(200).json({
      success: true,
      store: doc.store,
      branding: doc.branding,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateMySettings(req, res, next) {
  try {
    const userId = req.user?.id;
    const updated = await updateSettings(userId, req.body || {});

    return res.status(200).json({
      success: true,
      store: updated.store,
      branding: updated.branding,
    });
  } catch (err) {
    next(err);
  }
}
