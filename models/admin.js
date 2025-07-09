// import mongoose  from "mongoose";
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  otp : {
    type: Number,
    required: false,
    default: null
  },
  role:{
    type: String,
    enum:['user','blogger','hr','admin'],
    default: 'user',

  }
}, { timestamps: true });

 module.exports = mongoose.model('Admin', adminSchema);


