import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "My Business Store" },
    currency: { type: String, enum: ["₹", "$", "€"], default: "₹" },
    timezone: { type: String, default: "Asia/Kolkata" },
    gstin: { type: String, default: "" },
    storeAddress: { type: String, default: "" },
  },
  { _id: false }
);

const brandingSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: "" },
    invoiceFooterText: { type: String, default: "Thank you for your business!" },
    termsAndConditions: {
      type: String,
      default:
        "All sales are final. Returns accepted within 7 days with receipt.",
    },
  },
  { _id: false }
);

const notificationPreferencesSchema = new mongoose.Schema(
  {
    alertsEnabled: { type: Boolean, default: true },
    lowStockThreshold: { type: Number, default: 10 },
    notifications: {
      low_stock: { type: Boolean, default: true },
      new_sale: { type: Boolean, default: true },
      invoice_generated: { type: Boolean, default: true },
      pending_payment: { type: Boolean, default: true },
      expense_summary: { type: Boolean, default: false },
      high_expense: { type: Boolean, default: true },
      system: { type: Boolean, default: true },
    },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    store: { type: storeSchema, default: () => ({}) },
    branding: { type: brandingSchema, default: () => ({}) },
    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({}),
    },
    // (optional) you can also store appearance here if you want later:
    // appearance: { theme: { type: String, enum: ["light","dark","system"], default: "system" } }
  },
  { timestamps: true }
);

const Settings =
  mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
