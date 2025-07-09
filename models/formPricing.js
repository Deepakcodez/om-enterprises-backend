// import mongoose from "mongoose";
const mongoose = require("mongoose");

const formPricingSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model("princingForm", formPricingSchema);
