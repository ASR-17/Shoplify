export const drawInvoiceTemplate = (doc, invoice, shop) => {
  doc.fontSize(18).text(shop.name, { align: "left" });
  doc.moveDown(0.5);

  doc.fontSize(10).text(shop.address || "");
  doc.text(shop.phone || "");
  doc.text(shop.email || "");

  doc.moveDown();
  doc.fontSize(14).text("INVOICE", { align: "right" });
  doc.fontSize(10).text(invoice.invoiceNumber, { align: "right" });
  doc.text(`Date: ${new Date(invoice.invoiceDate).toDateString()}`, {
    align: "right",
  });

  doc.moveDown();
  doc.text(`Bill To: ${invoice.customerName || "Walk-in Customer"}`);
  doc.moveDown();

  doc.fontSize(10).text("Product | Qty | Price | Total");
  doc.moveDown(0.5);

  invoice.items.forEach((item) => {
    doc.text(
      `${item.productName} | ${item.quantity} | ₹${item.pricePerItem} | ₹${item.total}`
    );
  });

  doc.moveDown();
  doc.fontSize(12).text(`Grand Total: ₹${invoice.totalAmount}`, {
    align: "right",
  });

  doc.moveDown();
  doc.fontSize(9).text(
    "This is a computer generated invoice.",
    { align: "center" }
  );
};
