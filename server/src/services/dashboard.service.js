import Sale from "../models/Sale.model.js";
import Expense from "../models/Expense.model.js";
import alertService from "./alert.service.js";
import mongoose from "mongoose";
import { getDateRangeFilter } from "../utils/dateRange.util.js";
import { normalizeAmount } from "../utils/currency.util.js";

const dashboardService = {
  /**
   * KPI DATA
   */
  getKPIs: async (userId, filters) => {
    const dateFilter = getDateRangeFilter(filters);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const sales = await Sale.aggregate([
      {
        $match: {
          createdBy: userObjectId,
          ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const expenses = await Expense.aggregate([
      {
        $match: {
          createdBy: userObjectId,
          ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
        },
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$amount" },
        },
      },
    ]);

    const totalSales = normalizeAmount(sales[0]?.totalSales || 0);
    const totalExpenses = normalizeAmount(expenses[0]?.totalExpenses || 0);

    return {
      totalSales,
      totalExpenses,
      currentProfit: totalSales - totalExpenses,
      pendingPayments: 0,
      salesTrend: 0,
      expensesTrend: 0,
      profitTrend: 0,
      pendingTrend: 0,
    };
  },

  /**
   * INCOME vs EXPENSE CHART
   */
  getIncomeExpenseChart: async (userId, filters) => {
  const dateFilter = getDateRangeFilter(filters);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const sales = await Sale.aggregate([
    {
      $match: {
        createdBy: userObjectId,
        ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        income: { $sum: "$totalAmount" },
      },
    },
  ]);

  const expenses = await Expense.aggregate([
    {
      $match: {
        createdBy: userObjectId,
        ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        expenses: { $sum: "$amount" },
      },
    },
  ]);

  const map = {};

  sales.forEach(s => {
    map[s._id] = { date: s._id, income: s.income, expenses: 0 };
  });

  expenses.forEach(e => {
    if (!map[e._id]) {
      map[e._id] = { date: e._id, income: 0, expenses: e.expenses };
    } else {
      map[e._id].expenses = e.expenses;
    }
  });

  return Object.values(map).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
},


  /**
   * TOP PRODUCTS
   */
  getTopProducts: async (userId) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    return await Sale.aggregate([
      { $match: { createdBy: userObjectId } },
      {
        $group: {
          _id: "$productName",
          unitsSold: { $sum: "$quantity" },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          name: "$_id",
          unitsSold: 1,
          revenue: 1,
        },
      },
    ]);
  },

  /**
   * ALERTS
   */
  getAlerts: async (userId) => {
    const lowStock = await alertService.getLowStockAlerts(userId);
    const highExpense = await alertService.getHighExpenseAlerts(userId);

    return [...lowStock, ...highExpense];
  },
};

export default dashboardService;
