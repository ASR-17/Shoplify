import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "Stock Purchase",
        "Rent",
        "Salary",
        "Electricity",
        "Miscellaneous",
      ],
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    receiptUrl: {
      type: String,
      default: null,
    },
    addedBy: {
      type: String,
      enum: ["Admin", "Employee"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
