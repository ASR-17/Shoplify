import API from "./api";

const reportService = {
  getReports: async (params = {}) => {
    const { data } = await API.get("/reports", {
      params: {
        reportType:    params.reportType    ?? "sales",
        dateRange:     params.dateRange     ?? "this-month",
        page:          params.page          ?? 1,
        sortColumn:    params.sortColumn    ?? "date",
        sortDirection: params.sortDirection ?? "desc",
      },
    });
    return data;
  },

  exportReport: async (format, filters = {}) => {
    const response = await API.post(`/reports/export/${format}`, null, {
      params: {
        reportType: filters.reportType ?? "sales",
        dateRange:  filters.dateRange  ?? "this-month",
      },
      responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const url  = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href  = url;
    link.download =
      format === "excel" ? "report.xlsx"
      : format === "csv" ? "report.csv"
      : "report.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default reportService;