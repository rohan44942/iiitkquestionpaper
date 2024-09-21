const mongoose = require("mongoose");
const mongoapi = "mongodb://localhost:27017";

const connect = async () => {
  try {
    mongoose.connect(mongoapi);
    // console.log("connected to mongodb");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { connect };
