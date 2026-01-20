// server/scripts/seedEmployee.js
// Run: node server/scripts/seedEmployee.js
// (Make sure your server has: "type": "module" and MONGO_URI in .env)

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js"; // ✅ adjust if your path differs

const EMPLOYEE = {
  name: "Employee 2",
  email: "employee2@gmail.com",
  password: "Adii@8849", // ✅ change if you want
  role: "employee",
};

async function seedEmployee() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI missing in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Prevent duplicates
  const existing = await User.findOne({ email: EMPLOYEE.email });
  if (existing) {
    console.log("⚠️ Employee already exists:", existing.email, existing._id.toString());
    await mongoose.disconnect();
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(EMPLOYEE.password, 10);

  const user = await User.create({
    name: EMPLOYEE.name,
    email: EMPLOYEE.email,
    password: hashedPassword,
    role: EMPLOYEE.role,
  });

  console.log("✅ Employee created:", user._id.toString(), user.email);
  console.log("🔑 Password:", EMPLOYEE.password);

  await mongoose.disconnect();
  process.exit(0);
}

seedEmployee().catch(async (err) => {
  console.error("❌ Seed error:", err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
