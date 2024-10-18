const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
// const path = require("path");
// const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
require("dotenv").config();
// takign from my files
const { connect } = require("../backend/connectdb/connectdb");
const { storage } = require("./multerStorage/storage");
const getAllFiles = require("./routes/upload");
const getByFileName = require("./routes/upload");
const uploadpapers = require("./routes/upload");
const getLinkFromCloudinary = require("./routes/upload");
const uploadNotes = require("./routes/upload");
const getUplodedNotes = require("./routes/upload");
const getPendingExamFile = require("./routes/upload");
const getPendingNotesFile = require("./routes/upload");
const declineNoteUpload = require("./routes/upload");
const acceptNoteUpload = require("./routes/upload");
const downloadByFileName = require("./routes/upload");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize gfs and gridfsBucket
let gfs, gridfsBucket;

connect().then(() => {
  const db = mongoose.connection.db;
  gridfsBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
  gfs = gridfsBucket;
  app.locals.gfs = gfs;
});

// Set up GridFS storage engine

const upload = multer({ storage });

// Route to upload files and metadata
// app.use("/api/uploads", upload.single("image"), uploadpapers);
app.use("/api/uploads", upload.single("image"), uploadpapers);

// Route to fetch a file by filename
app.use("/api/uploads/", getByFileName);
// For download
app.use("/api", downloadByFileName);

// For preview
// app.get("/api/preview/:filename", (req, res) => {
//   const filename = req.params.filename;
//   const readStream = gfs.openDownloadStreamByName(filename);
//   readStream.pipe(res);
// });

// Route to fetch all files with metadata those have status as accepted

app.use("/api/uploads/", getAllFiles);

app.use(
  "/api/upload",
  fileUpload({ useTempFiles: true }),
  getLinkFromCloudinary
);

app.use("/api/upload", uploadNotes);

// get from the notes data base
app.use("/api/upload", getUplodedNotes); // correct error of this route

app.use("/api/uploads", getPendingExamFile);
app.use("/api/uploads", getPendingNotesFile);

// Import ObjectId for working with MongoDB IDs

app.delete("/api/uploads", declineNoteUpload);

app.put("/api/uploads", acceptNoteUpload);

// Error handling middleware to capture errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
