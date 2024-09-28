const express = require("express");
const cors = require("cors");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
const Grid = require("gridfs-stream");
const path = require("path");
const { connect } = require("../backend/connectdb/connectdb"); // Existing MongoDB connection setup
const mongoose = require("mongoose"); // Ensure mongoose is available

const app = express();
const port = process.env.PORT || 5000;

// CORS setup
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5000"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Init gfs and gridfsBucket variables
let gfs;
let gridfsBucket;

// MongoDB connection and GridFS setup
connect().then(() => {
  const db = mongoose.connection.db; // Use the existing MongoDB connection

  // Initialize GridFSBucket
  gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "uploads", // Files will be stored in uploads.files and uploads.chunks
  });

  // Initialize Grid for streaming files
  gfs = Grid(db, mongoose.mongo);
  gfs.collection("uploads");
  console.log(typeof gridfsBucket, typeof gfs);

  console.log("GridFS initialized and connected to MongoDB");
});

// Set up storage engine for GridFS
const storage = new GridFsStorage({
  url: "mongodb://localhost:27017/iiitk_resources", // Use the same MongoDB connection URL
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename =
        file.fieldname + "_" + Date.now() + path.extname(file.originalname);
      const fileInfo = {
        filename: filename,
        bucketName: "uploads", // Bucket to store the files in GridFS
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

// Route to upload a file
app.post("/api/uploads", upload.single("image"), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }
  res
    .status(200)
    .json({ file: req.file, message: "File uploaded successfully!" });
});

// Route to fetch a specific file by filename
app.get("/api/uploads/:filename", async (req, res) => {
  const filename = req.params.filename;

  try {
    // Use the native MongoDB query on fs.files collection
    const filesCollection = mongoose.connection.db.collection("uploads.files");
    
    // Query to find file by filename
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
    // Access the uploads.files collection directly
    const filesCollection = mongoose.connection.db.collection("uploads.files");

    // Find all files in the collection
    const files = await filesCollection.find().toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files exist!" });
    }

    // Return the metadata of the files
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
