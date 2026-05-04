import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { initializeEmailService } from "./services/emailService.js";

// Load environment variables
dotenv.config();

// Log environment variables (for debugging)
console.log("=== Backend Configuration ===");
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID ? "✓ Loaded" : "✗ Missing");
console.log("Razorpay Secret:", process.env.RAZORPAY_KEY_SECRET ? "✓ Loaded" : "✗ Missing");
console.log("Email User:", process.env.EMAIL_USER ? "✓ Loaded" : "✗ Missing");
console.log("Port:", process.env.PORT || "5000");
console.log("============================\n");

// Initialize email service
initializeEmailService();

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5501", // Add this (Live Server)
  "http://127.0.0.1:5501", // Add this
  "http://localhost:3000",
  "http://localhost:5000",
  "http://localhost:5500",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:5500",
  "https://thegreenwatercompany.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Use MongoDB Atlas for production or local for development
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shop";
mongoose.connect(mongoURI).then(() => {
  console.log("✓ MongoDB connected successfully");
}).catch(err => {
  console.error("✗ MongoDB connection failed:", err.message);
  console.warn("Check MONGODB_URI in .env file");
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});