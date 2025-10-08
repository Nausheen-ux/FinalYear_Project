import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import accommodationRoutes from "./routes/accommodationRoutes.js"; // ✅ Import accommodation routes

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// new added
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use("/api/users", userRoutes);
app.use("/api/accommodation", accommodationRoutes); // ✅ Added accommodation route

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

