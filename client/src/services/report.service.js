import api from "./api";

const getReports = async (params) => {
  const { data } = await api.get("/reports", {
    params: {
      reportType: params.reportType,
      dateRange: params.dateRange,
      from: params.customDateFrom,
      to: params.customDateTo,
      createdBy: params.createdBy,
      paymentMode: params.paymentMode,
      category: params.category,
      page: params.page,
      sortColumn: params.sortColumn,
      sortDirection: params.sortDirection,
    },
  });

  return data;
};

const exportReport = async (format, filters) => {
  const response = await api.post(
    `/reports/export/${format}`,
    null,
    {
      params: {
        reportType: filters.reportType,
        dateRange: filters.dateRange,
        from: filters.customDateFrom,
        to: filters.customDateTo,
        createdBy: filters.createdBy,
        paymentMode: filters.paymentMode,
        category: filters.category,
      },
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download =
    format === "excel"
      ? "report.xlsx"
      : format === "csv"
      ? "report.csv"
      : "report.pdf";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};


export default {
  getReports,
  exportReport,
};
