const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function dbConnect() {
  try {
    await mongoose.connect(
      "mongodb+srv://leatherwebmaker123:7BqJ3gF1rpMrF8nP@ombackendcluster.hzhe4.mongodb.net/?retryWrites=true&w=majority&appName=ombackendcluster",
      
    );
    console.log("✅ Successfully connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
}

module.exports = dbConnect;
