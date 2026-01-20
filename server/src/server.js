import "./config/env.js";
import connectDB from "./config/db.js";
import app from "./app.js";
import { startInventoryAlertJob } from "./jobs/inventoryAlert.job.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();              // ✅ wait for DB
    startInventoryAlertJob();       // ✅ start cron after DB

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server start failed:", err);
    process.exit(1);
  }
};

startServer();
