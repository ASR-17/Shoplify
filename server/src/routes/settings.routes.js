import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getMySettings,
  updateMySettings,
} from "../controllers/settings.controller.js";

const router = Router();

// GET /api/settings/me
router.get("/me", authMiddleware, getMySettings);

// PUT /api/settings/me
router.put("/me", authMiddleware, updateMySettings);

export default router;
