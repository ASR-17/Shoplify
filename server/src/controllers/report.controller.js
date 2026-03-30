import Sale from "../models/sale.model.js";
import Expense from "../models/expense.model.js";
import mongoose from "mongoose";
import alertService from "../services/alert.service.js";
import { normalizeAmount } from "../utils/currency.util.js";
import { exportCSV } from "../utils/csvExport.js";
import { exportExcel } from "../utils/excelExport.js";
import { exportPDF } from "../utils/pdfExport.js";

/* =========================================================
   DATE RANGE HELPER
   Supports: today | this-week | this-month | this-year
   ========================================================= */
const buildDateFilter = (dateRange) => {
  const now = new Date();
  let start;

  switch (dateRange) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "this-week": {
      const day = now.getDay(); // 0 = Sun
      start = new Date(now);
      start.setDate(now.getDate() - day);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "this-month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "this-year":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return {}; // no filter
  }

  return { $gte: start, $lte: now };
};

/* =========================================================
   GET /api/reports   ← SINGLE MASTER ENDPOINT
   ========================================================= */
export const getReports = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const {
      reportType    = "sales",
      dateRange     = "this-month",
      page          = 1,
      sortColumn    = "date",
      sortDirection = "desc",
    } = req.query;

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const dateFilter   = buildDateFilter(dateRange);
    const hasDate      = Object.keys(dateFilter).length > 0;

    const baseMatch = (dateField) => ({
      createdBy: userObjectId,
      ...(hasDate && { [dateField]: dateFilter }),
    });

    /* ========== FETCH ========== */
    const [sales, expenses] = await Promise.all([
      Sale.find(baseMatch("createdAt")).populate("createdBy", "name role"),
      Expense.find(baseMatch("createdAt")).populate("createdBy", "name role"),
    ]);

    /* ========== KPIs ========== */
    const totalSales    = normalizeAmount(sales.reduce((s, x) => s + (x.totalAmount || 0), 0));
    const totalExpenses = normalizeAmount(expenses.reduce((s, x) => s + (x.amount || 0), 0));

    /* ========== TIME SERIES ========== */
    const salesByDate   = {};
    const expensesByDate = {};

    sales.forEach((s) => {
      const d = s.createdAt?.toISOString().split("T")[0];
      if (d) salesByDate[d] = (salesByDate[d] || 0) + (s.totalAmount || 0);
    });
    expenses.forEach((e) => {
      const d = e.createdAt?.toISOString().split("T")[0];
      if (d) expensesByDate[d] = (expensesByDate[d] || 0) + (e.amount || 0);
    });

    const allDates = new Set([
      ...Object.keys(salesByDate),
      ...Object.keys(expensesByDate),
    ]);

    const timeSeries = Array.from(allDates).sort().map((date) => ({
      date,
      sales:    salesByDate[date]    || 0,
      income:   salesByDate[date]    || 0,   // IncomeExpenseChart compat
      expenses: expensesByDate[date] || 0,
      profit:   (salesByDate[date] || 0) - (expensesByDate[date] || 0),
    }));

    /* ========== CATEGORY BREAKDOWN ========== */
    const categoryMap = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + (e.amount || 0);
    });
    const categoryData = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }));

    /* ========== TOP PRODUCTS (for TopProductsChart) ========== */
    const productMap = {};
    sales.forEach((s) => {
      const name = s.productName || "Unknown";
      if (!productMap[name]) productMap[name] = { name, unitsSold: 0, revenue: 0 };
      productMap[name].unitsSold += s.quantity || 1;
      productMap[name].revenue   += s.totalAmount || 0;
    });

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    /* ========== PRODUCT-WISE DETAIL TABLE ========== */
    // Same data as topProducts but ALL products, not just top 5
    const productWise = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue);

    /* ========== TRANSACTIONS ========== */
    let allTransactions = [
      ...sales.map((s) => ({
        id:          s._id,
        date:        s.createdAt?.toISOString().split("T")[0] || "",
        description: s.productName || "",
        amount:      s.totalAmount || 0,
        type:        "sale",
        paymentMode: s.paymentType || s.paymentMode || "—",
        category:    "Sales",
        createdBy:   s.createdBy?.name || "System",
      })),
      ...expenses.map((e) => ({
        id:          e._id,
        date:        e.createdAt?.toISOString().split("T")[0] || "",
        description: e.description || "",
        amount:      e.amount || 0,
        type:        "expense",
        paymentMode: e.paymentMode || "—",
        category:    e.category || "Other",
        createdBy:   e.createdBy?.name || "System",
      })),
    ];

    /* ---- Filter by reportType ---- */
    if (reportType === "sales") {
      allTransactions = allTransactions.filter((t) => t.type === "sale");
    } else if (reportType === "expense") {
      allTransactions = allTransactions.filter((t) => t.type === "expense");
    }

    /* ---- Sort ---- */
    allTransactions.sort((a, b) => {
      let A = a[sortColumn], B = b[sortColumn];
      if (sortColumn === "date")   { A = new Date(A); B = new Date(B); }
      if (sortColumn === "amount") { A = Number(A);   B = Number(B);   }
      if (A < B) return sortDirection === "asc" ? -1 : 1;
      if (A > B) return sortDirection === "asc" ?  1 : -1;
      return 0;
    });

    /* ---- Paginate ---- */
    const PAGE_SIZE    = 15;
    const pageNum      = Math.max(1, parseInt(page));
    const totalPages   = Math.max(1, Math.ceil(allTransactions.length / PAGE_SIZE));
    const transactions = allTransactions.slice(
      (pageNum - 1) * PAGE_SIZE,
      pageNum * PAGE_SIZE
    );

    /* ========== ALERTS ========== */
    let alerts = [];
    try {
      const [lowStock, highExpense] = await Promise.all([
        alertService.getLowStockAlerts(userId),
        alertService.getHighExpenseAlerts(userId),
      ]);
      alerts = [...lowStock, ...highExpense];
    } catch (e) {
      console.warn("Alerts skipped:", e.message);
    }

    /* ========== AI INSIGHTS (optional) ========== */
    let aiInsights = null;
    try {
      const { generateDashboardInsights } = await import(
        "../services/aiDashboard.service.js"
      );
      aiInsights = await generateDashboardInsights(timeSeries);
    } catch (e) {
      console.warn("AI skipped:", e.message);
    }

    /* ========== RESPONSE ========== */
    res.json({
      summary: {
        totalSales,
        totalExpenses,
        netProfit:        totalSales - totalExpenses,
        currentProfit:    totalSales - totalExpenses,
        pendingPayments:  0,
        transactionCount: allTransactions.length,
        salesTrend:       0,
        expensesTrend:    0,
        profitTrend:      0,
        pendingTrend:     0,
      },
      timeSeries,
      categoryData,
      transactions,
      totalPages,
      topProducts,
      productWise,   // ← NEW
      alerts,
      aiInsights,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================================================
   POST /api/reports/export/:type
   ========================================================= */
export const exportReports = async (req, res, next) => {
  try {
    const userId    = req.user?._id || req.user?.id;
    const { type }  = req.params;
    const { dateRange = "this-month", reportType = "sales" } = req.query;

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const dateFilter   = buildDateFilter(dateRange);
    const hasDate      = Object.keys(dateFilter).length > 0;

    const match = {
      createdBy: userObjectId,
      ...(hasDate && { createdAt: dateFilter }),
    };

    const [sales, expenses] = await Promise.all([
      Sale.find(match),
      Expense.find(match),
    ]);

    let data = [
      ...sales.map((s) => ({
        Date:           s.createdAt?.toISOString().split("T")[0] || "",
        Description:    s.productName || "",
        Amount:         s.totalAmount || 0,
        Type:           "Sale",
        "Payment Mode": s.paymentType || s.paymentMode || "—",
        Category:       "Sales",
      })),
      ...expenses.map((e) => ({
        Date:           e.createdAt?.toISOString().split("T")[0] || "",
        Description:    e.description || "",
        Amount:         e.amount || 0,
        Type:           "Expense",
        "Payment Mode": e.paymentMode || "—",
        Category:       e.category || "Other",
      })),
    ];

    if (reportType === "sales")   data = data.filter((d) => d.Type === "Sale");
    if (reportType === "expense") data = data.filter((d) => d.Type === "Expense");

    data.sort((a, b) => new Date(b.Date) - new Date(a.Date));

    if (type === "csv")   return exportCSV(res, data);
    if (type === "excel") return exportExcel(res, data);
    if (type === "pdf")   return exportPDF(res, data);

    res.status(400).json({ message: "Invalid export type" });
  } catch (err) {
    next(err);
  }
};