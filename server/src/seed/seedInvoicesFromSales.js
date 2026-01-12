import mongoose from "mongoose";
import dotenv from "dotenv";

import Sale from "../models/Sale.model.js";
import Invoice from "../models/Invoice.model.js";
import generateInvoiceNumber from "../utils/generateInvoiceNumber.js";

dotenv.config();

/* ================= DB CONNECT ================= */
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
};

/* ================= SEED ================= */
const seedInvoicesFromSales = async () => {
  const sales = await Sale.find();

  let created = 0;

  for (const sale of sales) {
    const exists = await Invoice.findOne({ sale: sale._id });
    if (exists) continue;

    // 🔁 HANDLE OLD + NEW SALES
    let items = [];

    if (Array.isArray(sale.items) && sale.items.length > 0) {
      // ✅ New schema
      items = sale.items.map(i => ({
        productName: i.productName,
        quantity: i.quantity,
        pricePerItem: i.pricePerItem,
        total: i.quantity * i.pricePerItem,
      }));
    } else {
      // ✅ Old schema
      items = [
        {
          productName: sale.productName || "Item",
          quantity: sale.quantity || 1,
          pricePerItem: sale.pricePerItem || sale.totalAmount,
          total: sale.totalAmount,
        },
      ];
    }

    await Invoice.create({
      sale: sale._id,
      invoiceNumber: await generateInvoiceNumber(),
      customerName: sale.customerName || null,
      items,
      totalAmount: sale.totalAmount,
      paymentType: sale.paymentType,
      createdBy: sale.createdBy,
      createdAt: sale.soldAt || sale.createdAt, // ✅ IMPORTANT
    });

    created++;
    console.log(`🧾 Invoice created for sale ${sale._id}`);
  }

  console.log(`✅ Done. ${created} invoices created.`);
};

/* ================= RUN ================= */
(async () => {
  await connectDB();
  await seedInvoicesFromSales();
  process.exit();
})();
