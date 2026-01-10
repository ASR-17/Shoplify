import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    relatedSale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sale",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    pendingAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentType: {
      type: String,
      enum: ["cash", "upi", "card", "credit"],
      default: "credit",
    },

    status: {
      type: String,
      enum: ["paid", "partial", "pending"],
      default: "pending",
    },

    dueDate: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/* 🔁 AUTO STATUS & PENDING UPDATE */
paymentSchema.pre("save", function (next) {
  this.pendingAmount = this.totalAmount - this.paidAmount;

  if (this.pendingAmount <= 0) {
    this.pendingAmount = 0;
    this.status = "paid";
  } else if (this.paidAmount > 0) {
    this.status = "partial";
  } else {
    this.status = "pending";
  }

  next();
});

export default mongoose.model("Payment", paymentSchema);
