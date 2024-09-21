const express = require("express");
const cors = require("cors");
const { router } = require("./routes/upload");
const { connect } = require("../backend/connectdb/connectdb");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose"); // Fix mongoose import

const app = express();

const port = process.env.PORT || 5000;

// Ensure the data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// CORS setup
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5000"], // Allow the client origin
  optionsSuccessStatus: 200          // For older browsers
};

app.use(cors(corsOptions));


app.get("/", (req, res) => {
  try {
    res.send("This is the response from the server");
  } catch (err) {
    console.log(err);
  }
});

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: false }));
app.use("/api/upload", router);

// Setting up multer for storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

// File upload route
app.post("/uploads", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.status(200).json({ message: "File uploaded successfully!" });
});

// Start the server
const start = () => {
  try {
    app.listen(port, () => {
      console.log("Server is listening on port", port);
    });
  } catch (err) {
    console.log("Error in listening to the server", err);
  }
};

// Connect to MongoDB
const a = () => {
  connect();
};

a();
start();
