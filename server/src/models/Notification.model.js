import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "low_stock",
        "new_sale",
        "invoice_generated",
        "pending_payment",
        "expense_summary",
        "high_expense",
        "system",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["critical", "warning", "info"],
      default: "info",
      index: true,
    },

    actionLabel: {
      type: String,
    },

    actionUrl: {
      type: String,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    metadata: {
      type: Object, // flexible (productId, saleId, invoiceId, etc.)
      default: {},
    },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
