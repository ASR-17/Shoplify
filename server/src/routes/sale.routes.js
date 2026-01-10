import express from "express";
import {
  createSale,
  getSales,
  updateSale,
  deleteSale,
  getSaleById,
} from "../controllers/sale.controller.js";

// ✅ default imports (MATCH your middleware)
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * Admin + Employee
 */
router.post("/", authMiddleware, createSale);
router.get("/", authMiddleware, getSales);

/**
 * Admin only
 */
router.get("/:id", authMiddleware, roleMiddleware("admin"), getSaleById);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateSale);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteSale);

export default router;
