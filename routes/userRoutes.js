/*******************************************************
 * userRoutes.js - handles sign up, login, etc.
 *******************************************************/
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, country, languages, location, userType } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const newUser = new User({
      name,
      email,
      password,
      userType,
      phone,
      country,
      languages,
      location,
      profilePic: "",
      description: "",
      rating: 0,
      ratingCount: 0,
      providerMainCategory: "",
      kycVerified: userType === "provider" ? false : null,
      favorites: userType === "customer" ? [] : null,
      loyaltyPoints: userType === "customer" ? 0 : null,
      coords: null,
      tier: null,
      baseRate: null,
      scamCount: 0,
      delisted: false
    });

    await newUser.save();
    return res.json({ message: "Sign up successful!" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email, password });
    if (!foundUser) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    if (foundUser.delisted) {
      return res.status(403).json({ error: "This provider is delisted." });
    }
    return res.json({
      message: "Login successful!",
      user: foundUser
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
