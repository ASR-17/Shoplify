import mongoose from "mongoose";

/* ================================
   INVOICE ITEM SCHEMA
================================ */
const invoiceItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerItem: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

/* ================================
   INVOICE SCHEMA
================================ */
const invoiceSchema = new mongoose.Schema(
  {
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: true,
      unique: true, // 🔒 one invoice per sale
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true, // 🔒 counter-based only
    },

    customerName: {
      type: String,
      trim: true,
      default: null,
    },

    items: {
      type: [invoiceItemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Invoice must contain at least one item",
      },
    },

    paymentType: {
      type: String,
      enum: ["cash", "upi", "card", "other"],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/* ================================
   DATA INTEGRITY GUARD
================================ */
invoiceSchema.pre("save", function (next) {
  if (!this.items || this.items.length === 0) {
    return next(new Error("Invoice must have at least one item"));
  }

  const calculatedTotal = this.items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  if (calculatedTotal !== this.totalAmount) {
    return next(new Error("Invoice total mismatch"));
  }

  next();
});

const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
