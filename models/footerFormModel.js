// import mongoose from "mongoose";
const mongoose = require("mongoose");

const footerFormSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone : {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    default: "No Subject",
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("InstantCallBack", footerFormSchema);
