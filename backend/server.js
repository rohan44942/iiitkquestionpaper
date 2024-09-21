const express = require("express");
const app = express();
const mongoose = express("mongoose"); // through this i can connect
const cors = require("cors");
const { router } = require("./routes/upload");
const { connect } = require("../backend/connectdb/connectdb");

const port = process.env.PORT || 5000;
const api = "http://Localhost:5000";

// app.cors({ coreOptions });
app.use(cors({ api }));
// app.cors();
app.get("/", (req, res) => {
  try {
    res.send("this is the response from the server");
  } catch (err) {
    console.log(err);
  }
});
// middleware
app.use("/api/upload", router);

const start = () => {
  try {
    app.listen(port, () => {
      console.log("server is listening on port ", port);
    }); // server listen
  } catch (err) {
    console.log("error in listening in the server", err);
  }
};
// connect to mongodb
const a = () => {
  connect();
};
a();

start();
