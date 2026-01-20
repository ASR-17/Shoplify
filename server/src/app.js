import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import productRoutes from "./routes/product.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reportRoutes from "./routes/report.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import inventoryAlertRoutes from "./routes/inventoryAlert.routes.js";

// ✅ NEW: Settings + Preferences
import settingsRoutes from "./routes/settings.routes.js";
import notificationPreferencesRoutes from "./routes/notificationPreferences.routes.js";

// ✅ NEW: Upload (Cloudinary)
import uploadRoutes from "./routes/upload.routes.js";

import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

/* ================= CORS ================= */
const allowed = [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    return allowed.includes(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));


/* ================= BODY PARSER ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Inventory alerts
app.use("/api/alerts/inventory", inventoryAlertRoutes);

// ✅ Settings APIs
app.use("/api/settings", settingsRoutes);
app.use("/api/notification-preferences", notificationPreferencesRoutes);

// ✅ Upload APIs (Cloudinary)
app.use("/api/upload", uploadRoutes);

/* ================= ERROR HANDLER (ALWAYS LAST) ================= */
app.use(errorMiddleware);

export default app;
