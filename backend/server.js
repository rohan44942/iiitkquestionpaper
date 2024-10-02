const express = require("express");
const cors = require("cors");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
const mongoose = require("mongoose");
const { connect } = require("../backend/connectdb/connectdb");
const path = require("path");
require("dotenv").config();
// const mongoapi = process.env.MONGO_URL_ATLASH;
const mongoapi =
  "mongodb+srv://2021kucp1109:OkfIRMFSZpnuv1UI@cluster0.4brou.mongodb.net/iiitk_resources?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize gfs and gridfsBucket
let gfs, gridfsBucket;

connect().then(() => {
  console.log(mongoapi);
  const db = mongoose.connection.db;
  gridfsBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
  gfs = gridfsBucket;
  // console.log("thiss is runing")
});

// Set up GridFS storage engine
const storage = new GridFsStorage({
  // url: "mongodb+srv://2021kucp1109:OkfIRMFSZpnuv1UI@cluster0.4brou.mongodb.net/iiitk_resources?retryWrites=true&w=majority&appName=Cluster0",
  url: mongoapi,
  file: (req, file) => {
    const filename = `${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    return {
      filename,
      bucketName: "uploads",
    };
  },
});

const upload = multer({ storage });

// Route to upload files and metadata
app.post("/api/uploads", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

  const { year, branch, description, fileName } = req.body;
  try {
    const filesCollection = mongoose.connection.db.collection("uploads.files");

    await filesCollection.updateOne(
      { _id: req.file.id },
      {
        $set: {
          "metadata.year": year || "N/A",
          "metadata.branch": branch || "N/A",
          "metadata.description": description || "No description",
          "metadata.fileName": fileName || req.file.filename,
          "metadata.courseName": fileName || req.file.filename,
        },
      }
    );

    res
      .status(200)
      .json({ file: req.file, message: "File uploaded and metadata updated!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating file metadata", error: err });
  }
});

// Route to fetch a file by filename
app.get("/api/uploads/:filename", async (req, res) => {
  try {
    const file = await mongoose.connection.db
      .collection("uploads.files")
      .findOne({ filename: req.params.filename });

    if (!file) return res.status(404).json({ message: "File not found!" });

    const downloadStream = gridfsBucket.openDownloadStreamByName(
      req.params.filename
    );
    downloadStream
      .pipe(res)
      .on("error", () =>
        res.status(500).json({ message: "Error streaming file" })
      );
  } catch (error) {
    res.status(500).json({ message: "Error querying the file", error });
  }
});

// Route to fetch all files with metadata
app.get("/api/uploads", async (req, res) => {
  try {
    const files = await mongoose.connection.db
      .collection("uploads.files")
      .find()
      .toArray();
    if (!files.length)
      return res.status(404).json({ message: "No files found!" });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Error fetching files", error: err });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
