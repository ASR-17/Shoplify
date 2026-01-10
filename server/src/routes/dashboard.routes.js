import express from "express";
import {
  getDashboardKPIs,
  getIncomeExpenseChart,
  getTopProducts,
  getDashboardAlerts,
} from "../controllers/dashboard.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= DASHBOARD DATA ================= */
router.get("/kpis", authMiddleware, getDashboardKPIs);
router.get("/income-expense", authMiddleware, getIncomeExpenseChart);
router.get("/top-products", authMiddleware, getTopProducts);
router.get("/alerts", authMiddleware, getDashboardAlerts);

export default router;
