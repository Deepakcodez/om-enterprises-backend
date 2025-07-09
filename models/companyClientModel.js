// import mongoose from "mongoose";
const mongoose = require("mongoose");

const companyClinetSchema = mongoose.Schema({
  img: { type: String, required: true },
  companyName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model(
  "companyClient",
  companyClinetSchema
);

