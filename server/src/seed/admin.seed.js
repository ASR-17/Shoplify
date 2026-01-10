import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import { hashPassword } from "../utils/hashPassword.js";

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const adminExists = await User.findOne({ role: "admin" });
  if (adminExists) {
    console.log("✅ Admin already exists");
    process.exit();
  }

  const password = await hashPassword(process.env.ADMIN_PASSWORD);

  await User.create({
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password,
    role: "admin",
  });


  console.log("✅ Admin created");
  process.exit();
};

seedAdmin();
