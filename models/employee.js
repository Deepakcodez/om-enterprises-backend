// import mongoose from "mongoose";
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true, 
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true, 
      trim: true,
    },
    phone: {
      type: String,
      required: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    }
  },
  { timestamps: true }
);

// Create the model
 module.exports = mongoose.model("Employee", employeeSchema);
 