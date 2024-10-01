const express = require("express");
const cors = require("cors");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
const mongoose = require("mongoose");
const { connect } = require("../backend/connectdb/connectdb"); // Assuming your MongoDB connection
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize gfs and gridfsBucket
let gfs;
let gridfsBucket;

connect().then(() => {
  const db = mongoose.connection.db;
  gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "uploads",
  });

  gfs = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
});

// Set up storage engine for GridFS
const storage = new GridFsStorage({
  url: "mongodb://localhost:27017/iiitk_resources",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `${file.fieldname}_${Date.now()}${path.extname(
        file.originalname
      )}`;
      resolve({
        filename: filename,
        bucketName: "uploads", // Important to ensure that the file is stored in the 'uploads' bucket
      });
    });
  },
});

const upload = multer({ storage });

// Route to upload the file
app.post("/api/uploads", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  console.log("Uploaded file details:", req.file); // Log the uploaded file details

  const { year, branch, description, fileName } = req.body;

  try {
    // Log the file ID
    console.log("Uploaded file ID:", req.file.id);

    // Here you can update the metadata as needed
    const filesCollection = mongoose.connection.db.collection("uploads.files");

    await filesCollection.updateOne(
      { _id: req.file.id },
      {
        $set: {
          "metadata.year": year || "N/A",
          "metadata.branch": branch || "N/A",
          "metadata.description": description || "No description provided",
          "metadata.fileName": fileName || req.file.filename,
        },
      }
    );

    res.status(200).json({
      file: req.file,
      message: "File uploaded successfully and metadata updated!",
    });
  } catch (err) {
    console.error("Error updating metadata:", err);
    res.status(500).json({ message: "Error updating file metadata" });
  }
});

// Route to fetch a specific file by filename
app.get("/api/uploads/:filename", async (req, res) => {
  const filename = req.params.filename;

  try {
    const filesCollection = mongoose.connection.db.collection("uploads.files");

    // Query to find the file by filename
    const file = await filesCollection.findOne({ filename: filename });

    if (!file) {
      return res.status(404).json({ message: "File not found!" });
    }

    // If file exists, stream it using GridFSBucket
    const downloadStream = gridfsBucket.openDownloadStreamByName(filename);
    downloadStream.pipe(res);

    downloadStream.on("error", (err) => {
      console.error("Error reading the file:", err);
      return res.status(500).json({ message: "Error reading the file!" });
    });

    downloadStream.on("end", () => {
      console.log("File stream completed successfully.");
    });
  } catch (error) {
    console.error("Error querying the file:", error);
    res.status(500).json({ message: "Error querying the file!" });
  }
});

// Route to get metadata for all uploaded files
app.get("/api/uploads", async (req, res) => {
  try {
    const filesCollection = mongoose.connection.db.collection("uploads.files");
    const files = await filesCollection.find().toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files exist!" });
    }

    // Return files along with their metadata
    return res.json(files);
  } catch (err) {
    console.error("Error fetching files:", err);
    return res.status(500).json({ message: "Error fetching files!" });
  }
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

start();
