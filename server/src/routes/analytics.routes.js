import express from "express";
import { getAnalyticsSummary } from "../controllers/analytics.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/summary", getAnalyticsSummary);

export default router;