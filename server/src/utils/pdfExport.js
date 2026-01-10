import PDFDocument from "pdfkit";

export const exportPDF = (res, data) => {
  const doc = new PDFDocument({ margin: 30 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

  doc.pipe(res);

  doc.fontSize(18).text("Business Report", { align: "center" });
  doc.moveDown();

  data.forEach((item) => {
    doc
      .fontSize(10)
      .text(
        `${item.date} | ${item.description} | ₹${item.amount} | ${item.type}`
      );
  });

  doc.end();
};
