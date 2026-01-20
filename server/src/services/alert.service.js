import Product from "../models/product.model.js";
import Expense from "../models/expense.model.js";

/**
 * Alert Service
 */
const alertService = {
  /**
   * Low stock alerts
   */
  getLowStockAlerts: async (userId) => {
    const products = await Product.find({
    createdBy: userId,
    status: { $in: ["Low Stock", "Out of Stock"] },
    });


    return products.map((product) => ({
      id: product._id,
      type: "low_stock",
      title: "Low Stock Alert",
      description: `${product.name} is running low. Only ${product.quantity} units left.`,
      severity: "critical",
      timestamp: "Just now",
    }));
  },

  /**
   * High expense alerts (simple heuristic)
   */
  getHighExpenseAlerts: async (userId) => {
    const expenses = await Expense.find({ createdBy: userId })
      .sort({ amount: -1 })
      .limit(1);

    if (!expenses.length) return [];

    return [
      {
        id: expenses[0]._id,
        type: "high_expense",
        title: "Unusual Expense",
        description: `High expense recorded: ₹${expenses[0].amount}`,
        severity: "warning",
        timestamp: "Recently",
      },
    ];
  },
};

export default alertService;
