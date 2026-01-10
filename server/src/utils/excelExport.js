import ExcelJS from "exceljs";

export const exportExcel = async (res, data) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");

  sheet.columns = [
    { header: "Date", key: "date", width: 20 },
    { header: "Description", key: "description", width: 30 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Type", key: "type", width: 15 },
  ];

  sheet.addRows(data);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

  await workbook.xlsx.write(res);
  res.end();
};
