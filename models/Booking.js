const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  mainCategory: String,
  subCategory: String,
  dateTime: String,
  customerEmail: String,
  providerEmail: String,
  status: String, // pending, accepted, completed, rejected
  attachments: Array,
  ratingGiven: Boolean,
  rating: Number,
  escrowPaid: Boolean,
  photoApprovalNeeded: Boolean
});

module.exports = mongoose.model("Booking", BookingSchema);
