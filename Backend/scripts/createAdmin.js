import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Admin } from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await Admin.findOne({ name: "Admin" });
    if (existing) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await Admin.create({
      name: "Admin",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin Created Successfully");
    console.log("Name: Admin");
    console.log("Password: Admin@123");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
