import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // ❗ Get any ADMIN user to assign as creator
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      throw new Error("No admin user found. Create admin first.");
    }

    // ❌ Clear existing products (optional)
    await Product.deleteMany();

    const products = [
      {
        name: "Wireless Headphones",
        category: "Electronics",
        quantity: 45,
        unit: "pcs",
        costPrice: 1200,
        sellingPrice: 1500,
        supplier: "Tech Supplies Co.",
        lowStockThreshold: 10,
        createdBy: admin._id,
      },
      {
        name: "Bluetooth Speaker",
        category: "Electronics",
        quantity: 8,
        unit: "pcs",
        costPrice: 1800,
        sellingPrice: 2300,
        supplier: "SoundWave Pvt Ltd",
        lowStockThreshold: 10,
        createdBy: admin._id,
      },
      {
        name: "USB-C Cable",
        category: "Accessories",
        quantity: 120,
        unit: "pcs",
        costPrice: 150,
        sellingPrice: 299,
        supplier: "CableWorld",
        lowStockThreshold: 20,
        createdBy: admin._id,
      },
      {
        name: "Power Bank 10000mAh",
        category: "Accessories",
        quantity: 4,
        unit: "pcs",
        costPrice: 900,
        sellingPrice: 1299,
        supplier: "ChargePlus",
        lowStockThreshold: 5,
        createdBy: admin._id,
      },
      {
        name: "Smart Watch",
        category: "Wearables",
        quantity: 18,
        unit: "pcs",
        costPrice: 3200,
        sellingPrice: 3999,
        supplier: "WearTech",
        lowStockThreshold: 7,
        createdBy: admin._id,
      },
    ];

    await Product.insertMany(products);

    console.log("✅ Inventory products seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();
