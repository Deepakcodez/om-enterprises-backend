// import mongoose from "mongoose";
const mongoose = require("mongoose");

const jobFormSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  mandatory: {
    type : String,
    required: true
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", "any"],
    required: true
  },
  skill: {
    type: String,
    required: true

  },
  location: {
    type: String,                                         
    required: true
  },
 
 
}, { timestamps: true });

 module.exports = mongoose.model("JobForm", jobFormSchema);
 
