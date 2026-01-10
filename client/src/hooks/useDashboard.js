import { useEffect, useState, useCallback } from "react";
import dashboardService from "@/services/dashboard.service";

/**
 * useDashboard
 * Central hook for Dashboard analytics
 * - Graph ALWAYS works
 * - AI insights OPTIONAL
 */
const useDashboard = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const [kpis, setKpis] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [aiInsights, setAiInsights] = useState(null); // ✅ NEW
  const [topProducts, setTopProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all dashboard data
   */
  const fetchDashboardData = useCallback(
    async (activeFilters = filters) => {
      try {
        setLoading(true);
        setError(null);

        const [
          kpisData,
          chartRes,
          topProductsRes,
          alertsRes,
        ] = await Promise.all([
          dashboardService.getKPIs(activeFilters),
          dashboardService.getIncomeExpenseChart(activeFilters),
          dashboardService.getTopProducts(),
          dashboardService.getAlerts(),
        ]);

        /* ================= SAFE ASSIGNMENTS ================= */

        setKpis(kpisData ?? {});

        // ✅ chartRes = { chartData, aiInsights }
        setChartData(chartRes?.chartData ?? []);
        setAiInsights(chartRes?.aiInsights ?? null);

        setTopProducts(topProductsRes ?? []);
        setAlerts(alertsRes ?? []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  /**
   * Update filters (from DashboardFilters)
   */
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  /**
   * Manual refresh
   */
  const refreshDashboard = () => {
    fetchDashboardData(filters);
  };

  /**
   * Initial load + filter change reload
   */
  useEffect(() => {
    fetchDashboardData(filters);
  }, [filters, fetchDashboardData]);

  return {
    /* ================= DATA ================= */
    kpis,
    chartData,
    aiInsights, // ✅ exposed to Dashboard page
    topProducts,
    alerts,

    /* ================= STATE ================= */
    loading,
    error,
    filters,

    /* ================= ACTIONS ================= */
    updateFilters,
    refreshDashboard,
  };
};

export default useDashboard;
