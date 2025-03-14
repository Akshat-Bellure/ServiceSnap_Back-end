/*******************************************************
 * server.js - Final One-Step Code
 *******************************************************/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Import your route files
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// 1) Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 2) Connect to MongoDB Atlas using .env
const MONGO_URI = process.env.MONGO_URI;  // e.g. "mongodb+srv://ServiceSnap:...@cluster0.8kzgh.mongodb.net/ServiceSnap?retryWrites=true&w=majority"
mongoose.set("strictQuery", false);

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 3) Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.send("🚀 ServiceSnap backend is running!");
});

// 4) Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 ServiceSnap backend running on port ${PORT}`);
});
