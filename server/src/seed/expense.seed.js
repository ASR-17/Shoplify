import mongoose from "mongoose";
import dotenv from "dotenv";
import Expense from "../models/expense.model.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedExpenses = async () => {
  try {
    await connectDB();

    // ⚠️ Clear existing expenses (optional)
    await Expense.deleteMany();

    const dummyExpenses = [
      {
        category: "Stock Purchase",
        amount: 25000,
        description: "Monthly inventory restock",
        date: new Date("2026-01-05"),
        addedBy: "Admin",
        createdBy: new mongoose.Types.ObjectId(),
        receiptUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
      },
      {
        category: "Electricity",
        amount: 3500,
        description: "Electricity bill - January",
        date: new Date("2026-01-04"),
        addedBy: "Admin",
        createdBy: new mongoose.Types.ObjectId(),
      },
      {
        category: "Salary",
        amount: 45000,
        description: "Staff salary - December",
        date: new Date("2026-01-03"),
        addedBy: "Admin",
        createdBy: new mongoose.Types.ObjectId(),
        receiptUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
      },
      {
        category: "Rent",
        amount: 15000,
        description: "Shop rent - January",
        date: new Date("2026-01-02"),
        addedBy: "Employee",
        createdBy: new mongoose.Types.ObjectId(),
      },
      {
        category: "Miscellaneous",
        amount: 2500,
        description: "Office stationery purchase",
        date: new Date("2026-01-01"),
        addedBy: "Employee",
        createdBy: new mongoose.Types.ObjectId(),
      },
      {
        category: "Stock Purchase",
        amount: 18000,
        description: "Emergency stock refill",
        date: new Date("2025-12-30"),
        addedBy: "Admin",
        createdBy: new mongoose.Types.ObjectId(),
      },
      {
        category: "Electricity",
        amount: 1200,
        description: "Generator fuel expense",
        date: new Date("2025-12-28"),
        addedBy: "Employee",
        createdBy: new mongoose.Types.ObjectId(),
      },
      {
        category: "Miscellaneous",
        amount: 5000,
        description: "Festival decoration",
        date: new Date("2025-12-25"),
        addedBy: "Admin",
        createdBy: new mongoose.Types.ObjectId(),
      },
    ];

    await Expense.insertMany(dummyExpenses);

    console.log("✅ Dummy expenses inserted successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedExpenses();
