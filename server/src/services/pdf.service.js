import PDFDocument from "pdfkit";
import { drawInvoiceTemplate } from "../utils/pdfInvoiceTemplate.js";

export const generateInvoicePDF = (res, invoice) => {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${invoice.invoiceNumber}.pdf`
  );

  doc.pipe(res);

  // ✅ FIX: Dummy data hata kar real Shop Details daal di hain
  const shopDetails = {
    name: "Tech Galaxy Store",
    address: "123 Main Street, Mumbai - 400001",
    phone: "+91 98765 43210",
    email: "contact@techgalaxy.com",
    gstNumber: "27AABCU9603R1ZM",
  };

  drawInvoiceTemplate(doc, invoice, shopDetails);

  doc.end();
};