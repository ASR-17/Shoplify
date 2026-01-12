import Expense from "../models/Expense.model.js";
import { getDateRanges } from "../utils/expenseSummary.js";

// ➕ Add Expense

export const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      category: req.body.category,
      amount: Number(req.body.amount),
      description: req.body.description,

      // ✅ FORCE REAL DATE
      date: new Date(req.body.date),

      // ✅ CLOUDINARY URL
      receiptUrl: req.file?.path || null,

      addedBy: req.user.role === "admin" ? "Admin" : "Employee",
      createdBy: req.user.id,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};




// 📄 Get Expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 Expense Summary
export const getExpenseSummary = async (req, res) => {
  try {
    const { startOfToday, weekAgo, monthAgo } = getDateRanges();

    const todayTotal = await Expense.aggregate([
      { $match: { date: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const weekTotal = await Expense.aggregate([
      { $match: { date: { $gte: weekAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const monthTotal = await Expense.aggregate([
      { $match: { date: { $gte: monthAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const categoryBreakdown = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          amount: 1,
        },
      },
    ]);

    res.json({
      todayTotal: todayTotal[0]?.total || 0,
      weekTotal: weekTotal[0]?.total || 0,
      monthTotal: monthTotal[0]?.total || 0,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Expense (Admin)
export const updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        receiptUrl: req.file?.path,
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Expense (Admin)
export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
