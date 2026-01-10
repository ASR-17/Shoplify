import mongoose from "mongoose";
import dotenv from "dotenv";
import Sale from "../models/Sale.model.js";
import User from "../models/User.model.js";

dotenv.config();

const seedSales = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      throw new Error("Admin user not found");
    }

    await Sale.deleteMany();

    await Sale.insertMany([
      {
        productName: "Notebook",
        quantity: 2,
        pricePerItem: 120,
        totalAmount: 240,
        customerName: "Rahul",
        paymentType: "cash",
        createdBy: admin._id,
      },
      {
        productName: "Pen",
        quantity: 10,
        pricePerItem: 10,
        totalAmount: 100,
        paymentType: "upi",
        createdBy: admin._id,
      },
      {
        productName: "Backpack",
        quantity: 1,
        pricePerItem: 1500,
        totalAmount: 1500,
        customerName: "Aman",
        paymentType: "card",
        createdBy: admin._id,
      },
      {
        productName: "Water Bottle",
        quantity: 3,
        pricePerItem: 250,
        totalAmount: 750,
        paymentType: "cash",
        createdBy: admin._id,
      },
    ]);

    console.log("✅ Sales seeded successfully");
    await mongoose.disconnect();
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedSales();
