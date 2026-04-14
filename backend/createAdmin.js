// ─────────────────────────────────────────────────────────────
// createAdmin.js  —  run ONCE to create your admin account
// Usage: node createAdmin.js
// Place this file in your /backend folder and run from there
// ─────────────────────────────────────────────────────────────
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "student" },
});

const User = mongoose.model("User", userSchema);

const ADMIN_NAME     = "CampusOrbit Admin";
const ADMIN_EMAIL    = "admin@campusorbit.com";   // ← change if you want
const ADMIN_PASSWORD = "Admin@1234";              // ← change to something strong!

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role === "admin") {
      console.log("ℹ️  Admin already exists:", existing.email);
    } else {
      // Upgrade existing user to admin
      existing.role = "admin";
      await existing.save();
      console.log("✅ Existing user upgraded to admin:", existing.email);
    }
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashed,
    role: "admin",
  });

  console.log("✅ Admin user created!");
  console.log("   Email:   ", ADMIN_EMAIL);
  console.log("   Password:", ADMIN_PASSWORD);
  console.log("   Login at: http://localhost:3000/admin/login");

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});