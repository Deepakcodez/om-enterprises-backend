// import mongoose from "mongoose";
const mongoose = require("mongoose");
const jobApplySchema = mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobForm",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    fromJalandhar: {
      type: Boolean,
      default: false,
    },
    isFresher: {
      type: Boolean,
      default: true,
    },
    availability: {
      type: String,
      enum: ["full-time", "part-time", "freelance "],
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
  },
  { timeStamp: true }
);
   module.exports  = mongoose.model("JobApplyForm", jobApplySchema);

