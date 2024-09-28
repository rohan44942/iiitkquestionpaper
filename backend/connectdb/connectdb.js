const mongoose = require("mongoose");
const mongoapi = "mongodb://localhost:27017/iiitk_resources"; // Explicit database name

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
