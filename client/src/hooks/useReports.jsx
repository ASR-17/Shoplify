import { useEffect, useState } from "react";
import reportService from "@/services/report.service";
import { toast } from "@/hooks/use-toast";

const useReports = () => {
  const [reportType, setReportType] = useState("combined");

  // Filters
  const [dateRange, setDateRange] = useState("this-month");
  const [customDateFrom, setCustomDateFrom] = useState(undefined);
  const [customDateTo, setCustomDateTo] = useState(undefined);
  const [createdBy, setCreatedBy] = useState("all");
  const [paymentMode, setPaymentMode] = useState("all");
  const [category, setCategory] = useState("all");

  // Data
  const [summary, setSummary] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Table
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // UI
  const [isLoading, setIsLoading] = useState(false);

  /* ================= FETCH REPORT ================= */

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await reportService.getReports({
        reportType,
        dateRange,
        customDateFrom,
        customDateTo,
        createdBy,
        paymentMode,
        category,
        page: currentPage,
        sortColumn,
        sortDirection,
      });

      setSummary(res.summary);
      setTimeSeries(res.timeSeries);
      setCategoryData(res.categoryData);
      setTransactions(res.transactions);
      setTotalPages(res.totalPages);
    } catch (error) {
      toast({
        title: "Failed to load reports",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= FILTER ACTIONS ================= */

  const applyFilters = () => {
    setCurrentPage(1);
    fetchReports();
  };

  const clearFilters = () => {
    setDateRange("this-month");
    setCustomDateFrom(undefined);
    setCustomDateTo(undefined);
    setCreatedBy("all");
    setPaymentMode("all");
    setCategory("all");
    setCurrentPage(1);
  };

  /* ================= SORT ================= */

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  /* ================= EXPORT ================= */

  const exportReport = async (format) => {
    try {
      await reportService.exportReport(format, {
        reportType,
        dateRange,
        customDateFrom,
        customDateTo,
        createdBy,
        paymentMode,
        category,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export report",
        variant: "destructive",
      });
    }
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, currentPage, sortColumn, sortDirection]);

  return {
    // state
    reportType,
    dateRange,
    customDateFrom,
    customDateTo,
    createdBy,
    paymentMode,
    category,
    summary,
    timeSeries,
    categoryData,
    transactions,
    currentPage,
    totalPages,
    sortColumn,
    sortDirection,
    isLoading,

    // setters
    setReportType,
    setDateRange,
    setCustomDateFrom,
    setCustomDateTo,
    setCreatedBy,
    setPaymentMode,
    setCategory,
    setCurrentPage,

    // actions
    applyFilters,
    clearFilters,
    handleSort,
    exportReport,
  };
};

export default useReports;
