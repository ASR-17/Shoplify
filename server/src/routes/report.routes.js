import express from "express";
import {
  getReports,
  getReportSummary,
  getTimeSeriesData,
  getTransactions,
  exportReports,
} from "../controllers/report.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getReports);               // ✅ MAIN
router.get("/summary", getReportSummary);
router.get("/timeseries", getTimeSeriesData);
router.get("/transactions", getTransactions);
router.post("/export/:type", exportReports);

export default router;
