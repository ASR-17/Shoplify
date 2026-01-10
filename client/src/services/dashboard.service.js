import API from "./api";

/**
 * Dashboard API Service
 * Handles all dashboard-related API calls
 */
const dashboardService = {
  /* ================= KPIs ================= */
  getKPIs: async (filters = {}) => {
    const res = await API.get("/dashboard/kpis", { params: filters });
    return res.data.data; // ✅ KPIs object
  },

  /* ================= INCOME vs EXPENSE ================= */
  getIncomeExpenseChart: async (filters = {}) => {
    const res = await API.get("/dashboard/income-expense", {
      params: filters,
    });

    return {
      chartData: res.data.data ?? [],     // ✅ always exists
      aiInsights: res.data.ai ?? null,    // ✅ optional
    };
  },

  /* ================= TOP PRODUCTS ================= */
  getTopProducts: async () => {
    const res = await API.get("/dashboard/top-products");
    return res.data.data ?? [];
  },

  /* ================= ALERTS ================= */
  getAlerts: async () => {
    const res = await API.get("/dashboard/alerts");
    return res.data.data ?? [];
  },
};

export default dashboardService;
