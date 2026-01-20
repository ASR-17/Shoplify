// server/src/controllers/inventoryAlert.controller.js
import { scanInventoryAndCreateAlerts } from "../services/inventoryAlert.service.js";

/**
 * POST /api/alerts/inventory/scan
 * Cooldown is enforced server-side.
 * Protect with auth middleware in routes.
 */
export async function scanInventoryAlertsController(req, res) {
  try {
    const result = await scanInventoryAndCreateAlerts({
      cooldownMinutes: 10,
      force: false,
    });

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("Inventory scan error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to scan inventory alerts",
    });
  }
}
