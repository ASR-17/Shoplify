import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  generateInvoice,
  getInvoices,
  getInvoiceById,
  downloadInvoicePDF,
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/from-sale/:saleId", generateInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.get("/:id/pdf", downloadInvoicePDF);

export default router;
