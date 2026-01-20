// server/src/services/inventoryAlert.service.js
import JobRun from "../models/JobRun.model.js";
import Notification from "../models/Notification.model.js";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js"; // ✅ adjust path if different

const DEFAULT_LOW_STOCK_THRESHOLD = 5;

const JOB_NAME = "inventory_scan";

/**
 * Find all recipients for inventory alerts.
 * Default: all admins.
 */
async function getRecipients() {
  // If your role values differ, change this query.
  const admins = await User.find({ role: "admin" }, { _id: 1 }).lean();
  return admins.map((u) => u._id);
}

/**
 * Dedup rule:
 * Don't create another UNREAD low_stock notification for the same user+product+kind.
 * We store kind in metadata.kind: "out_of_stock" | "low_stock"
 */
async function existsUnread({ userId, productId, kind }) {
  return Notification.exists({
    user: userId,
    type: "low_stock",
    isRead: false,
    "metadata.productId": String(productId),
    "metadata.kind": kind,
  });
}

async function createLowStockNotification({
  userId,
  product,
  quantity,
  threshold,
  kind, // "out_of_stock" | "low_stock"
}) {
  const already = await existsUnread({
    userId,
    productId: product._id,
    kind,
  });
  if (already) return { created: false };

  const isOut = kind === "out_of_stock";

  const title = isOut ? "Out of stock" : "Low stock";
  const description = isOut
    ? `${product.name} is out of stock.`
    : `${product.name} is low on stock (${quantity} left, threshold ${threshold}).`;

  const severity = isOut ? "critical" : "warning";

  const doc = await Notification.create({
    user: userId,
    type: "low_stock", // ✅ valid enum
    title,
    description,
    severity,
    actionLabel: "View Product",
    actionUrl: `/inventory/edit/${product._id}`,   // ✅ exists in InventoryRoutes
    isRead: false,
    metadata: {
      productId: String(product._id),
      productName: product.name,
      quantity,
      threshold,
      kind, // ✅ helps dedupe and UI
    },
  });

  return { created: true, notification: doc };
}

/**
 * Scan inventory and create alerts.
 * - out_of_stock: quantity === 0
 * - low_stock: 1..threshold
 *
 * cooldownMinutes: server-side cooldown shared globally
 * force: bypass cooldown (cron uses force=true)
 */
export async function scanInventoryAndCreateAlerts({
  cooldownMinutes = 10,
  force = false,
} = {}) {
  const now = new Date();

  // ---- cooldown check ----
  const job = await JobRun.findOne({ name: JOB_NAME }).lean();
  if (!force && job?.lastRunAt) {
    const diffMs = now.getTime() - new Date(job.lastRunAt).getTime();
    const diffMin = diffMs / (1000 * 60);
    if (diffMin < cooldownMinutes) {
      return {
        skipped: true,
        reason: `Cooldown active. Last run ${diffMin.toFixed(1)} minutes ago.`,
        createdCount: 0,
        checkedCount: 0,
      };
    }
  }

  // Recipients (admins)
  const recipients = await getRecipients();
  if (recipients.length === 0) {
    // Still update JobRun to avoid loops spamming logs
    await JobRun.findOneAndUpdate(
      { name: JOB_NAME },
      { $set: { lastRunAt: now } },
      { upsert: true, new: true }
    );

    return {
      skipped: false,
      createdCount: 0,
      checkedCount: 0,
      note: "No admin users found to notify.",
      lastRunAt: now,
    };
  }

  // Pull candidate products
  // If you have per-product threshold, we support it via lowStockThreshold
  const products = await Product.find(
    { quantity: { $lte: DEFAULT_LOW_STOCK_THRESHOLD } },
    { name: 1, quantity: 1, lowStockThreshold: 1 }
  ).lean();

  let createdCount = 0;

  for (const p of products) {
    const threshold = Number.isFinite(p.lowStockThreshold)
      ? p.lowStockThreshold
      : DEFAULT_LOW_STOCK_THRESHOLD;

    // If threshold differs, re-check using threshold:
    if (p.quantity === 0) {
      for (const userId of recipients) {
        const res = await createLowStockNotification({
          userId,
          product: p,
          quantity: p.quantity,
          threshold,
          kind: "out_of_stock",
        });
        if (res.created) createdCount += 1;
      }
    } else if (p.quantity > 0 && p.quantity <= threshold) {
      for (const userId of recipients) {
        const res = await createLowStockNotification({
          userId,
          product: p,
          quantity: p.quantity,
          threshold,
          kind: "low_stock",
        });
        if (res.created) createdCount += 1;
      }
    }
  }

  await JobRun.findOneAndUpdate(
    { name: JOB_NAME },
    { $set: { lastRunAt: now } },
    { upsert: true, new: true }
  );

  return {
    skipped: false,
    createdCount,
    checkedCount: products.length,
    recipients: recipients.length,
    lastRunAt: now,
  };
}
