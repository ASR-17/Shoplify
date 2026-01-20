import Invoice from "../models/Invoice.model.js";
import Sale from "../models/Sale.model.js";
import { createInvoiceFromSale } from "../services/invoice.service.js";
import { generateInvoicePDF } from "../services/pdf.service.js";

// 🔔 Notification triggers
import {
  notifyInvoiceGenerated,
} from "../utils/notificationTriggers.js";

/* ===============================
   GENERATE INVOICE FROM SALE
================================ */
export const generateInvoice = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // Prevent duplicate invoice
    const existing = await Invoice.findOne({ sale: sale._id });
    if (existing) return res.json(existing);

    const invoice = await createInvoiceFromSale(sale, req.user.id);

    // 🔔 NOTIFY: Invoice generated
    await notifyInvoiceGenerated(invoice);

    res.status(201).json(invoice);
  } catch (err) {
    console.error("Generate invoice error ❌", err);
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   GET ALL INVOICES
================================ */
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   GET INVOICE BY ID
================================ */
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice)
      return res.status(404).json({ message: "Invoice not found" });

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   DOWNLOAD INVOICE PDF
================================ */
export const downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice)
      return res.status(404).json({ message: "Invoice not found" });

    // (Optional future hook: notifyInvoiceDownloaded)
    generateInvoicePDF(res, invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
