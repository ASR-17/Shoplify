import Expense from "../models/expense.model.js";
import Sale from "../models/sale.model.js";
import { exportCSV } from "../utils/csvExport.js";
import { exportExcel } from "../utils/excelExport.js";
import { exportPDF } from "../utils/pdfExport.js";

/* =========================================================
   GET /api/reports  ✅ (MAIN AGGREGATED ENDPOINT)
   ========================================================= */

export const getReports = async (req, res, next) => {
  try {

    const sales = await Sale.find().populate("createdBy", "name");
    const expenses = await Expense.find().populate("createdBy", "name");

    /* ================= SUMMARY ================= */
    const totalSales = sales.reduce(
      (sum, s) => sum + s.totalAmount,
      0
    );

    const totalExpenses = expenses.reduce(
      (sum, e) => sum + e.amount,
      0
    );

    /* ================= TIME SERIES ================= */
    const salesByDate = {};
    const expensesByDate = {};

    sales.forEach((s) => {
      const date = s.soldAt.toISOString().split("T")[0];
      salesByDate[date] =
        (salesByDate[date] || 0) + s.totalAmount;
    });

    expenses.forEach((e) => {
      const date = e.date.toISOString().split("T")[0];
      expensesByDate[date] =
        (expensesByDate[date] || 0) + e.amount;
    });

    const allDates = new Set([
      ...Object.keys(salesByDate),
      ...Object.keys(expensesByDate),
    ]);

    const timeSeries = Array.from(allDates)
      .sort()
      .map((date) => ({
        date,
        sales: salesByDate[date] || 0,
        expenses: expensesByDate[date] || 0,
        profit:
          (salesByDate[date] || 0) -
          (expensesByDate[date] || 0),
      }));

    /* ================= CATEGORY BREAKDOWN (NEW) ================= */
    const categoryMap = {};

    expenses.forEach((e) => {
      const category = e.category || "Other";
      categoryMap[category] =
        (categoryMap[category] || 0) + e.amount;
    });

    const categoryData = Object.entries(categoryMap).map(
      ([category, amount]) => ({
        category,
        amount,
      })
    );

    /* ================= TRANSACTIONS ================= */
    const transactions = [
      ...sales.map((s) => ({
        id: s._id,
        date: s.soldAt.toISOString().split("T")[0],
        description: s.productName,
        amount: s.totalAmount,
        type: "sale",
        paymentMode: s.paymentType,
        category: "Sales",
        createdBy: s.createdBy?.name || "System",
      })),
      ...expenses.map((e) => ({
        id: e._id,
        date: e.date.toISOString().split("T")[0],
        description: e.description,
        amount: e.amount,
        type: "expense",
        paymentMode: e.paymentMode,
        category: e.category,
        createdBy: e.createdBy?.name || "System",
      })),
    ];

    /* ================= RESPONSE ================= */
    res.json({
      summary: {
        totalSales,
        totalExpenses,
        netProfit: totalSales - totalExpenses,
        transactionCount: transactions.length,
        salesTrend: 0,
        expensesTrend: 0,
        profitTrend: 0,
      },
      timeSeries,
      categoryData, // ✅ NOW FILLED
      transactions,
      totalPages: 1,
    });
  } catch (err) {
    next(err);
  }
};




/* =========================================================
   EXISTING ENDPOINTS (UNCHANGED)
   ========================================================= */

/**
 * GET /api/reports/summary
 */
export const getReportSummary = async (req, res, next) => {
  try {
    const salesAgg = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    const expenseAgg = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    const totalSales = salesAgg[0]?.total || 0;
    const totalExpenses = expenseAgg[0]?.total || 0;

    res.json({
      totalSales,
      totalExpenses,
      netProfit: totalSales - totalExpenses,
      transactionCount:
        (salesAgg[0]?.count || 0) + (expenseAgg[0]?.count || 0),
      salesTrend: 0,
      expensesTrend: 0,
      profitTrend: 0,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/timeseries
 */
export const getTimeSeriesData = async (req, res, next) => {
  try {
    const sales = await Sale.find({}, "date amount");
    const expenses = await Expense.find({}, "date amount");

    res.json({ sales, expenses });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/transactions
 */
export const getTransactions = async (req, res, next) => {
  try {
    const sales = await Sale.find().populate("createdBy", "name role");
    const expenses = await Expense.find().populate("createdBy", "name role");

    const transactions = [
      ...sales.map((s) => ({
        id: s._id,
        date: s.date,
        description: s.description,
        amount: s.amount,
        type: "sale",
        paymentMode: s.paymentMode,
        category: s.category,
        createdBy: s.createdBy?.name || "System",
      })),
      ...expenses.map((e) => ({
        id: e._id,
        date: e.date,
        description: e.description,
        amount: e.amount,
        type: "expense",
        paymentMode: e.paymentMode,
        category: e.category,
        createdBy: e.createdBy?.name || "System",
      })),
    ];

    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/reports/export/:type
 */
export const exportReports = async (req, res, next) => {
  try {
    const { type } = req.params;

    const sales = await Sale.find();
    const expenses = await Expense.find();

    const data = [
      ...sales.map((s) => ({
        date: s.soldAt.toISOString().split("T")[0],
        description: s.productName,
        amount: s.totalAmount,
        type: "Sale",
      })),
      ...expenses.map((e) => ({
        date: e.date.toISOString().split("T")[0],
        description: e.description,
        amount: e.amount,
        type: "Expense",
      })),
    ];

    if (type === "csv") return exportCSV(res, data);
    if (type === "excel") return exportExcel(res, data);
    if (type === "pdf") return exportPDF(res, data);

    res.status(400).json({ message: "Invalid export type" });
  } catch (err) {
    next(err);
  }
};

