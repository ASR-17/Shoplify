// server/src/jobs/inventoryAlert.job.js
import cron from "node-cron";
import { scanInventoryAndCreateAlerts } from "../services/inventoryAlert.service.js";

/**
 * Starts an hourly job to scan inventory and create alerts.
 * Call this ONCE when your server boots (in server.js/app.js).
 */
export function startInventoryAlertJob() {
  // Every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    try {
      const result = await scanInventoryAndCreateAlerts({
        cooldownMinutes: 0, // cron can run regardless
        force: true,
      });
      console.log("[InventoryAlertJob] Scan result:", result);
    } catch (err) {
      console.error("[InventoryAlertJob] Error:", err);
    }
  });

  console.log("[InventoryAlertJob] Scheduled: every hour");
}
