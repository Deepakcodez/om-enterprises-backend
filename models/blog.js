// import mongoose from "mongoose";
const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
 
  image: {
    type: String,
    required: true,
  },
  title :{
   type: String,
   required: true,
  },
 
  content :{
   type: String,
   required: true,
  },
  url:{
    type:String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BlogCategory',
    required: true, // Make category optional
  },
  metaDescription:{
    type: String,
    required: true,
  },
  metaTitle:{
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
},{timestamps: true})

module.exports = mongoose.model("Blog", BlogSchema);