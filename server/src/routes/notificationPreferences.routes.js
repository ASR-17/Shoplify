import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getMyNotificationPreferences,
  updateMyNotificationPreferences,
} from "../controllers/notificationPreferences.controller.js";

const router = Router();

// GET /api/notification-preferences/me
router.get("/me", authMiddleware, getMyNotificationPreferences);

// PUT /api/notification-preferences/me
router.put("/me", authMiddleware, updateMyNotificationPreferences);

export default router;
