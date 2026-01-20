import Settings from "../models/Settings.model.js";

export async function getOrCreateSettings(userId) {
  let doc = await Settings.findOne({ user: userId }).lean();
  if (doc) return doc;

  const created = await Settings.create({ user: userId });
  return created.toObject();
}

export async function updateSettings(userId, partial) {
  // Only allow store/branding updates via /settings
  const update = {};
  if (partial.store) update.store = partial.store;
  if (partial.branding) update.branding = partial.branding;

  const doc = await Settings.findOneAndUpdate(
    { user: userId },
    { $set: update },
    { new: true, upsert: true }
  ).lean();

  return doc;
}

export async function getNotificationPreferences(userId) {
  const doc = await getOrCreateSettings(userId);
  return doc.notificationPreferences;
}

export async function updateNotificationPreferences(userId, prefsPartial) {
  // Merge notifications object safely
  const doc = await Settings.findOne({ user: userId });
  if (!doc) {
    const created = await Settings.create({ user: userId });
    return created.notificationPreferences;
  }

  if (typeof prefsPartial.alertsEnabled === "boolean") {
    doc.notificationPreferences.alertsEnabled = prefsPartial.alertsEnabled;
  }
  if (Number.isFinite(prefsPartial.lowStockThreshold)) {
    doc.notificationPreferences.lowStockThreshold = prefsPartial.lowStockThreshold;
  }
  if (prefsPartial.notifications && typeof prefsPartial.notifications === "object") {
    doc.notificationPreferences.notifications = {
      ...doc.notificationPreferences.notifications,
      ...prefsPartial.notifications,
    };
  }

  await doc.save();
  return doc.notificationPreferences.toObject
    ? doc.notificationPreferences.toObject()
    : doc.notificationPreferences;
}
