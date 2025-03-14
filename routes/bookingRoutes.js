/*******************************************************
 * bookingRoutes.js - handles bookings CRUD
 *******************************************************/
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const {
      mainCategory,
      subCategory,
      dateTime,
      customerEmail,
      providerEmail,
      attachments,
      status
    } = req.body;

    const newBk = new Booking({
      mainCategory,
      subCategory,
      dateTime,
      customerEmail,
      providerEmail: providerEmail || null,
      status: status || "pending",
      attachments: attachments || [],
      ratingGiven: false,
      rating: 0,
      escrowPaid: true,
      photoApprovalNeeded: false
    });
    await newBk.save();
    return res.json({ message: "Booking created", booking: newBk });
  } catch (err) {
    console.error("Booking create error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET all bookings for a user (customer or provider)
router.get("/", async (req, res) => {
  try {
    const { email, userType } = req.query;
    if (!email || !userType) {
      return res.status(400).json({ error: "Missing email or userType" });
    }
    let filter = {};
    if (userType === "customer") {
      filter = { customerEmail: email };
    } else if (userType === "provider") {
      filter = { providerEmail: email };
    }
    const bookings = await Booking.find(filter);
    return res.json({ bookings });
  } catch (err) {
    console.error("Booking GET error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update booking status
router.patch("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updates = req.body; // e.g. { status: 'accepted', providerEmail: '...' }
    const updated = await Booking.findOneAndUpdate(
      { _id: bookingId },
      { $set: updates },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Booking not found" });
    }
    // If completed -> escrow release or loyalty points logic
    if (updates.status === "completed") {
      // For demonstration, do partial logic here
      // ...
    }
    return res.json({ message: "Booking updated", booking: updated });
  } catch (err) {
    console.error("Booking update error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Example: Rate a booking
router.post("/:bookingId/rate", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { ratingValue } = req.body;
    const bk = await Booking.findById(bookingId);
    if (!bk) {
      return res.status(404).json({ error: "Booking not found" });
    }
    bk.ratingGiven = true;
    bk.rating = ratingValue;
    await bk.save();

    // Update provider's rating
    if (bk.providerEmail) {
      const provider = await User.findOne({ email: bk.providerEmail });
      if (provider) {
        const oldCount = provider.ratingCount || 0;
        const oldRating = provider.rating || 0;
        const newCount = oldCount + 1;
        const newRating = ((oldRating * oldCount) + parseInt(ratingValue)) / newCount;
        provider.ratingCount = newCount;
        provider.rating = newRating;
        // Delist if < 2.0
        if (newRating < 2.0) {
          provider.delisted = true;
        }
        await provider.save();
      }
    }
    return res.json({ message: "Rating submitted", booking: bk });
  } catch (err) {
    console.error("Rating error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
