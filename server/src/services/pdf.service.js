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

  const shopDetails = {
    name: "Your Shop Name",
    address: "Your Address",
    phone: "Phone Number",
    email: "Email",
  };

  drawInvoiceTemplate(doc, invoice, shopDetails);

  doc.end();
};
