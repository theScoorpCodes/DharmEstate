import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js"; 
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

//dotenv configuration
dotenv.config();

// MongoDB connection
await mongoose.connect(`${process.env.MONGODB_URL}`).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

// Express app setup
const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// app start
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// function to handle errors 
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    message,
    statusCode,
    success: false,
  });
});
