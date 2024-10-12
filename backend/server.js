// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
// const mongoose = require("mongoose");
// const { connect } = require("../backend/connectdb/connectdb");
// const path = require("path");
// const cloudinary = require("cloudinary").v2;
// const fileUpload = require("express-fileupload");
// const User = require("Auth0");
// require("dotenv").config();
// // const mongoapi_rohan = process.env.MONGO_URL_ATLASH;
// const mongoapi_rohan =
//   "mongodb+srv://2021kucp1109:OkfIRMFSZpnuv1UI@cluster0.4brou.mongodb.net/iiitk_resources?retryWrites=true&w=majority&appName=Cluster0";
// const mongoapi_praveen = "";

// const app = express();
// const port = process.env.PORT || 5000;

// // Allow requests from both frontend and backend
// const corsOptions = {
//   origin: ["http://localhost:3000", "http://localhost:5000"], // Add both origins
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary HTTP methods
//   credentials: true, // Allow cookies or authorization headers
// };

// app.use(cors(corsOptions));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload({ useTempFiles: true }));

// // Initialize gfs and gridfsBucket
// let gfs, gridfsBucket;

// connect().then(() => {
//   const db = mongoose.connection.db;
//   gridfsBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
//   gfs = gridfsBucket;
//   // console.log("thiss is runing")
// });

// const storage = new GridFsStorage({
//   // url: "mongodb+srv://2021kucp1109:OkfIRMFSZpnuv1UI@cluster0.4brou.mongodb.net/iiitk_resources?retryWrites=true&w=majority&appName=Cluster0",
//   url: mongoapi_rohan,
//   file: (req, file) => {
//     const filename = `${file.fieldname}_${Date.now()}${path.extname(
//       file.originalname
//     )}`;
//     return {
//       filename,
//       bucketName: "uploads",
//     };
//   },
// });
// const upload = multer({ storage });

// // Route to upload files and metadata
// app.post("/api/uploads", upload.single("image"), async (req, res) => {
//   const { year, branch, description, fileName } = req.body;
//   console.log(req.files, req.file,year );
//   if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

//   // const { year, branch, description, fileName } = req.body;

//   // Check if required metadata fields are provided
//   if (!year || !branch || !fileName) {
//     return res.status(400).json({
//       message: "Please provide required metadata: year, branch, and fileName.",
//     });
//   }

//   try {
//     const filesCollection = mongoose.connection.db.collection("uploads.files");

//     // Update metadata for the uploaded file
//     await filesCollection.updateOne(
//       { _id: req.file.id },
//       {
//         $set: {
//           "metadata.year": year || "N/A",
//           "metadata.branch": branch || "N/A",
//           "metadata.description": description || "No description",
//           "metadata.fileName": fileName || req.file.filename,
//           "metadata.courseName": fileName || req.file.filename,
//         },
//       }
//     );

//     res.status(200).json({
//       file: req.file,
//       message: "File uploaded and metadata updated!",
//     });
//   } catch (err) {
//     console.error("Error updating file metadata:", err);
//     res
//       .status(500)
//       .json({ message: "Error updating file metadata", error: err });
//   }
// });

// // Route to fetch a file by filename
// app.get("/api/uploads/:filename", async (req, res) => {
//   try {
//     const file = await mongoose.connection.db
//       .collection("uploads.files")
//       .findOne({ filename: req.params.filename });

//     if (!file) return res.status(404).json({ message: "File not found!" });

//     const downloadStream = gridfsBucket.openDownloadStreamByName(
//       req.params.filename
//     );
//     downloadStream
//       .pipe(res)
//       .on("error", () =>
//         res.status(500).json({ message: "Error streaming file" })
//       );
//   } catch (error) {
//     res.status(500).json({ message: "Error querying the file", error });
//   }
// });

// // Route to fetch all files with metadata
// app.get("/api/uploads", async (req, res) => {
//   try {
//     const files = await mongoose.connection.db
//       .collection("uploads.files")
//       .find()
//       .toArray();
//     if (!files.length)
//       return res.status(404).json({ message: "No files found!" });
//     res.json(files);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching files", error: err });
//   }
// });

// // uploading the notes pdfs all implementation here

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME || dlmypwh71,
//   api_key: process.env.CLOUDINARY_API_KEY || 142613153773972,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // creating the schema
// const noteSchema = new mongoose.Schema({
//   subjectName: String,
//   year: String,
//   semester: String,
//   branch: String,
//   fileLink: String,
// });

// const Note = mongoose.model("Note", noteSchema);
// app.post("/api/upload", (req, res) => {
//   const file = req.files.file;

//   cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
//     if (error) {
//       console.error("Error uploading to Cloudinary:", error);
//       return res.status(500).send("Cloudinary upload failed.");
//     }

//     return res.json({ secure_url: result.secure_url });
//   });
// });

// // Error handling middleware to capture errors
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// app.post("/api/upload/notes", async (req, res) => {
//   const { subjectName, year, semester, branch, fileLink } = req.body;

//   try {
//     const newNote = new Note({
//       subjectName,
//       year,
//       semester,
//       branch,
//       fileLink,
//     });

//     await newNote.save();
//     res.status(200).json({ message: "Note uploaded successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Error saving note", error });
//   }
// });

// // get from the notes data base
// app.get("/api/upload/notes", async (req, res) => {
//   try {
//     const notes = await Note.find(); // Fetch all notes
//     res.json(notes); // Send notes as JSON
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// app.listen(port, () => console.log(`Server running on port ${port}`));
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
const mongoose = require("mongoose");
const { connect } = require("../backend/connectdb/connectdb");
const path = require("path");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
dotenv.config({ path: ".env" });
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

  const { year, branch, description, fileName, status } = req.body;
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
          "metadata.status": status || req.file.status,
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
app.get("/api/uploads/", async (req, res) => {
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

// now get the data in the admin page using the pending ,
// accepted will be taken directly to the home page and decline will the file from the data base

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || dlmypwh71,
  api_key: process.env.CLOUDINARY_API_KEY || 142613153773972,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// creating the schema
const noteSchema = new mongoose.Schema({
  subjectName: String,
  year: String,
  semester: String,
  branch: String,
  fileLink: String,
});

const Note = mongoose.model("Note", noteSchema);
app.post("/api/upload", fileUpload({ useTempFiles: true }), (req, res) => {
  const file = req.files.file;
  console.log(file, file.tempFilePath);
  cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
    if (error) {
      console.error("Error uploading to Cloudinary:", error);
      return res.status(500).send("Cloudinary upload failed.");
    }

    return res.json({ secure_url: result.secure_url });
  });
});

// Error handling middleware to capture errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.post("/api/upload/notes", async (req, res) => {
  const { subjectName, year, semester, branch, fileLink } = req.body;

  try {
    const newNote = new Note({
      subjectName,
      year,
      semester,
      branch,
      fileLink,
    });

    await newNote.save();
    res.status(200).json({ message: "Note uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving note", error });
  }
});

// get from the notes data base
app.get("/api/upload/notes", async (req, res) => {
  try {
    const notes = await Note.find(); // Fetch all notes
    res.json(notes); // Send notes as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/api/uploads/status/pending", async (req, res) => {
  try {
    const files = await mongoose.connection.db
      .collection("uploads.files")
      .find({ "metadata.status": "pending" }) // Query for files with status "pending"
      .toArray(); // Convert the cursor to an array of files

    res.status(200).json(files); // Send the files as a JSON response
  } catch (error) {
    console.error("Error fetching pending uploads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const { ObjectId } = require("mongodb"); // Import ObjectId for working with MongoDB IDs

app.delete("/api/uploads/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    // Delete the file and its chunks by ID
    await bucket.delete(new ObjectId(id));

    res
      .status(200)
      .json({ message: "Upload declined and deleted successfully" });
  } catch (error) {
    console.error("Error deleting upload:", error);
    res.status(500).json({ error: "Failed to delete upload" });
  }
});

app.put("/api/uploads/status/accept/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await mongoose.connection.db
      .collection("uploads.files")
      .findOneAndUpdate(
        { _id: new ObjectId(id) }, // Find the file by its ID
        { $set: { "metadata.status": "accepted" } }, // Update the metadata status to "accepted"
        { returnOriginal: false } // Return the updated document
      );

    if (!result.value) {
      return res.status(404).json({ error: "Upload not found" });
    }

    res.status(200).json(result.value); // Send the updated file data
  } catch (error) {
    console.error("Error accepting upload:", error);
    res.status(500).json({ error: "Failed to accept upload" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
