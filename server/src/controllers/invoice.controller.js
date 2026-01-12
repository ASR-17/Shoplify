import Invoice from "../models/Invoice.model.js";
import Sale from "../models/Sale.model.js";
import { createInvoiceFromSale } from "../services/invoice.service.js";
import { generateInvoicePDF } from "../services/pdf.service.js";

export const generateInvoice = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const existing = await Invoice.findOne({ sale: sale._id });
    if (existing) return res.json(existing);

    const invoice = await createInvoiceFromSale(sale, req.user.id);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInvoices = async (req, res) => {
  const invoices = await Invoice.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name");

  res.json(invoices);
};

export const getInvoiceById = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });

  res.json(invoice);
};

export const downloadInvoicePDF = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });

  generateInvoicePDF(res, invoice);
};
