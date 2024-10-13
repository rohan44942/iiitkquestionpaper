const mongoose = require("mongoose");
require("dotenv").config(); // Load .env file
mongoose.set("strictQuery", true);

// Choose the appropriate MongoDB URL based on the environment
// const mongoapi = process.env.MONGO_URL_ATLASH;
const mongoapi =
  "mongodb+srv://2021kucp1109:OkfIRMFSZpnuv1UI@cluster0.4brou.mongodb.net/iiitk_resources?retryWrites=true&w=majority&appName=Cluster0";

const connect = async () => {
  try {
    console.log(`Connecting to MongoDB at ${mongoapi}`);
    await mongoose.connect(mongoapi, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully", mongoapi);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = { connect };
