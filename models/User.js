// servicesnap-backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  userType: { type: String, default: "customer" },
  phone: String,
  location: String,
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  // Add any other fields you need
});

module.exports = mongoose.model("User", userSchema);
