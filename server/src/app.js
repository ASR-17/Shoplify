import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import productRoutes from "./routes/product.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js"; // ✅ ADD THIS

import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

/* ================= CORS ================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* ================= BODY PARSER ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/products", productRoutes);   // Inventory
app.use("/api/expenses", expenseRoutes);   // Expenses
app.use("/api/dashboard", dashboardRoutes); // ✅ Dashboard

/* ================= ERROR HANDLER (ALWAYS LAST) ================= */
app.use(errorMiddleware);

export default app;
