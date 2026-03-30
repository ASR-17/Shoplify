import { useEffect, useState, useCallback } from "react";
import reportService from "@/services/report.service";
import { toast } from "@/hooks/use-toast";

/**
 * useReports
 * Simplified: only dateRange + reportType as filters.
 * Exposes productWise data for ProductWiseTable.
 */
const useReports = () => {
  /* ===== FILTERS ===== */
  const [reportType, setReportType] = useState("sales");
  const [dateRange,  setDateRange]  = useState("this-month");

  /* ===== TABLE ===== */
  const [currentPage,   setCurrentPage]   = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);
  const [sortColumn,    setSortColumn]    = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  /* ===== DATA ===== */
  const [summary,      setSummary]      = useState(null);
  const [timeSeries,   setTimeSeries]   = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [topProducts,  setTopProducts]  = useState([]);
  const [productWise,  setProductWise]  = useState([]);   // ← NEW
  const [alerts,       setAlerts]       = useState([]);

  /* ===== UI ===== */
  const [isLoading, setIsLoading] = useState(false);

  /* ================================================
     CORE FETCH
     ================================================ */
  const fetchReports = useCallback(async (overrides = {}) => {
    setIsLoading(true);
    try {
      const res = await reportService.getReports({
        reportType,
        dateRange,
        page:          currentPage,
        sortColumn,
        sortDirection,
        ...overrides,
      });

      setSummary(res.summary        ?? null);
      setTimeSeries(res.timeSeries  ?? []);
      setCategoryData(res.categoryData ?? []);
      setTransactions(res.transactions ?? []);
      setTotalPages(res.totalPages  ?? 1);
      setTopProducts(res.topProducts  ?? []);
      setProductWise(res.productWise  ?? []);   // ← NEW
      setAlerts(res.alerts          ?? []);
    } catch (error) {
      toast({
        title:       "Failed to load reports",
        description: error?.response?.data?.message || "Something went wrong",
        variant:     "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [reportType, dateRange, currentPage, sortColumn, sortDirection]);

  /* ===== AUTO-FETCH on filter / table change ===== */
  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, dateRange, currentPage, sortColumn, sortDirection]);

  /* ===== ACTIONS ===== */

  /** Called immediately when a pill / type button is clicked */
  const applyFilters = (overrides = {}) => {
    setCurrentPage(1);
    fetchReports({ page: 1, ...overrides });
  };

  const refreshReports = () => fetchReports();

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const exportReport = async (format) => {
    try {
      await reportService.exportReport(format, { reportType, dateRange });
    } catch {
      toast({
        title:       "Export failed",
        description: "Unable to export report. Please try again.",
        variant:     "destructive",
      });
    }
  };

  return {
    /* filters */
    reportType,  setReportType,
    dateRange,   setDateRange,

    /* table */
    currentPage,   setCurrentPage,
    totalPages,
    sortColumn,
    sortDirection,

    /* data */
    summary,
    timeSeries,
    categoryData,
    transactions,
    topProducts,
    productWise,
    alerts,

    /* ui */
    isLoading,

    /* actions */
    applyFilters,
    refreshReports,
    handleSort,
    exportReport,
  };
};

export default useReports;