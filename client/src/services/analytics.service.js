import api from "./api"; // your existing axios instance — same one used in sale.service.js etc.

export const getAnalyticsSummary = async () => {
  const res = await api.get("/dashboard/analytics/summary");
  return res.data.data;
};