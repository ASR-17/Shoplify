export const drawInvoiceTemplate = (doc, invoice, shop) => {
  // Page ke margins aur positions set kar rahe hain
  const leftX = 50;
  const endX = 550;

  // ================= HEADER =================
  // Shop ka naam bada aur bold
  doc.fontSize(22).font('Helvetica-Bold').fillColor('#111827').text(shop?.name || "Tech Galaxy Store", leftX, 50);
  
  // Shop ki details
  doc.fontSize(10).font('Helvetica').fillColor('#4B5563');
  doc.text(shop?.address || "123 Main Street, City", leftX, 80);
  doc.text(`Phone: ${shop?.phone || "N/A"}`, leftX, 95);
  doc.text(`Email: ${shop?.email || "N/A"}`, leftX, 110);
  if (shop?.gstNumber) {
    doc.text(`GSTIN: ${shop.gstNumber}`, leftX, 125);
  }

  // Right side mein INVOICE likha hua
  doc.fontSize(30).font('Helvetica-Bold').fillColor('#E5E7EB').text("INVOICE", 50, 45, { align: "right" });
  
  // Invoice Details (Right Side)
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#111827').text(`INV#: ${invoice?.invoiceNumber || "N/A"}`, 50, 85, { align: "right" });
  
  // ✅ FIX: Date ka error theek kiya (createdAt check karke)
  const dateObj = invoice?.createdAt || invoice?.invoiceDate;
  const dateStr = dateObj ? new Date(dateObj).toLocaleDateString() : "N/A";
  doc.font('Helvetica').fillColor('#4B5563').text(`Date: ${dateStr}`, 50, 100, { align: "right" });

  // Ek sundar si divider line
  doc.moveTo(leftX, 140).lineTo(endX, 140).lineWidth(1).strokeColor('#E5E7EB').stroke();

  // ================= CUSTOMER INFO =================
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#9CA3AF').text("BILL TO:", leftX, 160);
  doc.font('Helvetica-Bold').fillColor('#111827').fontSize(12).text(invoice?.customerName || "Walk-in Customer", leftX, 175);

  // ================= TABLE =================
  const tableTop = 220;
  
  // Table Header
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#111827');
  doc.text("Item Description", leftX, tableTop);
  doc.text("Qty", 300, tableTop, { width: 50, align: "center" });
  doc.text("Rate", 370, tableTop, { width: 70, align: "right" });
  doc.text("Amount", 460, tableTop, { width: 90, align: "right" });

  // Table Header Line
  doc.moveTo(leftX, tableTop + 15).lineTo(endX, tableTop + 15).lineWidth(1).strokeColor('#D1D5DB').stroke();

  // Table Rows (Items)
  let yPosition = tableTop + 25;
  doc.font('Helvetica').fillColor('#374151');

  if (invoice?.items && invoice.items.length > 0) {
    invoice.items.forEach((item) => {
      doc.text(item.productName || "Product", leftX, yPosition);
      doc.text((item.quantity || 1).toString(), 300, yPosition, { width: 50, align: "center" });
      doc.text(`Rs. ${item.pricePerItem || 0}`, 370, yPosition, { width: 70, align: "right" });
      doc.text(`Rs. ${item.total || 0}`, 460, yPosition, { width: 90, align: "right" });
      
      yPosition += 25; // Har item ke baad thoda neeche khisko
      doc.moveTo(leftX, yPosition - 10).lineTo(endX, yPosition - 10).lineWidth(0.5).strokeColor('#F3F4F6').stroke();
    });
  }

  // ================= TOTALS =================
  const totalY = yPosition + 10;
  
  // Payment Type
  doc.font('Helvetica').fillColor('#6B7280').fontSize(10);
  doc.text(`Payment Method: ${(invoice?.paymentType || "N/A").toUpperCase()}`, leftX, totalY + 5);

  // Grand Total
  doc.font('Helvetica-Bold').fillColor('#111827').fontSize(12);
  doc.text("Grand Total:", 350, totalY, { width: 90, align: "right" });
  doc.text(`Rs. ${invoice?.totalAmount || 0}`, 450, totalY, { width: 100, align: "right" });

  // Total ke neeche ek final line
  doc.moveTo(350, totalY + 20).lineTo(endX, totalY + 20).lineWidth(2).strokeColor('#111827').stroke();

  // ================= FOOTER =================
  doc.fontSize(9).font('Helvetica-Oblique').fillColor('#9CA3AF').text(
    "This is a computer-generated invoice. No physical signature is required.",
    50, 700, { align: "center", width: 500 }
  );
};