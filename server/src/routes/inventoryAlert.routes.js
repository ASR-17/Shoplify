// server/src/routes/inventoryAlert.routes.js
import { Router } from "express";
import { scanInventoryAlertsController } from "../controllers/inventoryAlert.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"; // ✅ default import

const router = Router();

// POST /api/alerts/inventory/scan
router.post("/scan", authMiddleware, scanInventoryAlertsController);

export default router;
