const mongoose = require("mongoose");
require('dotenv').config();  

// Choose the appropriate MongoDB URL based on the environment
const mongoapi = process.env.MONGO_URL_LOCAL_HOST || process.env.MONGO_URL_ATLASH;

const connect = async () => {
  try {
    console.log(`Connecting to MongoDB at ${mongoapi}`);
    await mongoose.connect(mongoapi, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = { connect };
