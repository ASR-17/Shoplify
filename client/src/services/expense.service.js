import API from "@/services/api";

/* =======================
   CRUD
======================= */

export const getExpenses = (params = {}) =>
  API.get("/expenses", { params });

export const getExpenseById = (id) =>
  API.get(`/expenses/${id}`);

export const createExpense = (data) =>
  API.post("/expenses", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateExpense = (id, data) =>
  API.put(`/expenses/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteExpense = (id) =>
  API.delete(`/expenses/${id}`);

/* =======================
   SUMMARY
======================= */

export const getExpenseSummary = async () => {
  const res = await API.get("/expenses/summary");
  return res.data;
};

/* =======================
   DEFAULT EXPORT (IMPORTANT)
======================= */

const expenseService = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
};

export default expenseService;
