import { Parser } from "json2csv";

export const exportCSV = (res, data) => {
  const parser = new Parser();
  const csv = parser.parse(data);

  res.header("Content-Type", "text/csv");
  res.attachment("report.csv");
  return res.send(csv);
};
