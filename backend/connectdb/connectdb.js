const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

// const mongoapi = process.env.uri; // Explicit database name
// const mongoapi = "mongodb://127.0.0.1:27017/iiitk_resources";
const mongoapi ="mongodb+srv://2021kucp1109:OkfIRMFSZpnuv1UI@cluster0.4brou.mongodb.net/iiitk_resources?retryWrites=true&w=majority&appName=Cluster0";
const connect = async () => {
  try {
    await mongoose.connect(mongoapi, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB at", mongoapi);
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
};

module.exports = { connect };
