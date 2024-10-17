const mongoose = require("mongoose");
require("dotenv").config(); // Load .env file
mongoose.set("strictQuery", true);

// Choose the appropriate MongoDB URL based on the environment
const mongoapitest = process.env.MONGO_URL_ATLASH;

const connect = async () => {
  try {
    console.log(`Connecting to MongoDB at ${mongoapitest}`);
    await mongoose.connect(mongoapitest, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully", mongoapitest);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = { connect };
