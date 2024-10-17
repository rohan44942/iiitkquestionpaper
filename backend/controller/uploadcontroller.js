const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const { ObjectId } = require("mongodb");
const { Note } = require("../schema/noteschema");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || dlmypwh71,
  api_key: process.env.CLOUDINARY_API_KEY || 142613153773972,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadpapers = async (req, res) => {
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
    res.status(200).json({
      file: req.file,
      message: "File uploaded and metadata updated!",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating file metadata", error: err });
  }
};

const getAllFiles = async (req, res) => {
  const { year, branch, page = 1, limit = 10 } = req.query; // Accept page and limit
  const skip = (page - 1) * limit; // Calculate how many items to skip

  try {
    // Create a filter based on year and branch
    const filter = { "metadata.status": "accepted" }; // Default filter

    if (year) {
      filter["metadata.year"] = year;
    }
    if (branch) {
      filter["metadata.branch"] = branch;
    }

    const files = await mongoose.connection.db
      .collection("uploads.files")
      .find(filter)
      .skip(skip) // Skip items based on pagination
      .limit(parseInt(limit)) // Limit the number of items returned
      .toArray();

    const totalFiles = await mongoose.connection.db
      .collection("uploads.files")
      .countDocuments(filter); // Get total count for pagination

    res.status(200).json({
      files,
      totalFiles, // Send total files count
      currentPage: page,
      totalPages: Math.ceil(totalFiles / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error querying the files", error });
  }
}; // done

const getPaginatedFiles = async (req, res) => {
  const { page = 1, limit = 10, year, branch } = req.query; // Accept year and branch for filtering

  try {
    const filesCollection = mongoose.connection.db.collection("uploads.files");

    // Build the filter object based on the query parameters
    const filter = {};
    if (year) filter["metadata.year"] = year; // Filter by year
    if (branch) filter["metadata.branch"] = branch; // Filter by branch

    const totalFiles = await filesCollection.countDocuments(filter); // Count total documents based on filter

    const totalPages = Math.ceil(totalFiles / limit);

    // Fetch the files based on pagination and filter
    const files = await filesCollection
      .find(filter)
      .sort({ uploadedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();

    res.status(200).json({
      totalFiles,
      totalPages,
      currentPage: page,
      files,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching files", error });
  }
};

const getByFileName = async (req, res) => {
  try {
    const gfs = req.gfs;
    const file = await mongoose.connection.db
      .collection("uploads.files")
      .findOne({ filename: req.params.filename });

    if (!file) return res.status(404).json({ message: "File not found!" });

    const downloadStream = gfs.openDownloadStreamByName(req.params.filename);
    downloadStream
      .pipe(res)
      .on("error", () =>
        res.status(500).json({ message: "Error streaming file" })
      );
  } catch (error) {
    res.status(500).json({ message: "Error querying the file", error });
  }
}; // done

// cloudinary upload
const getLinkFromCloudinary = (req, res) => {
  const file = req.files.file;
  console.log(file, file.tempFilePath);
  cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
    if (error) {
      console.error("Error uploading to Cloudinary:", error);
      return res.status(500).send("Cloudinary upload failed.");
    }

    return res.json({ secure_url: result.secure_url });
  });
};
// upload notes to mongo
const uploadNotes = async (req, res) => {
  const { subjectName, year, semester, branch, fileLink, status } = req.body;
  console.log("this is status and year", typeof Note);
  try {
    const newNote = new Note({
      subjectName,
      year,
      semester,
      branch,
      fileLink,
      status,
    });

    await newNote.save();
    res.status(200).json({ message: "Note uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving note", error });
  }
};

// get uploaded notes
const getUplodedNotes = async (req, res) => {
  try {
    const { page = 1, year, semester, subject, status } = req.query;
    console.log(status, year);
    const limit = 20; // Number of notes per page
    const skip = (page - 1) * limit;

    const filter = {};
    if (status === "true") {
      filter["metadata.status"] = "accepted";
    }

    if (year) {
      filter.year = year;
    }
    if (semester) {
      filter.semester = semester;
    }
    if (subject) {
      filter.subjectName = { $regex: subject, $options: "i" };
    }

    // Fetch notes from MongoDB
    const notes = await Note.find(filter).skip(skip).limit(limit);
    const totalNotes = await Note.countDocuments(filter);

    res.json({
      notes,
      totalPages: Math.ceil(totalNotes / limit), // Calculate total pages
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// get pending file to the admin
const getPendingNotesFile = async (req, res) => {
  try {
    const files = await mongoose.connection.db
      .collection("notes")
      .find({ status: "pending" }) // Query for files with status "pending"
      .toArray(); // Convert the cursor to an array of files

    res.status(200).json(files); // Send the files as a JSON response
  } catch (error) {
    console.error("Error fetching pending uploads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getPendingExamFile = async (req, res) => {
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
};
// delete item
// const deleteItems = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//       bucketName: "uploads",
//     });

//     // Delete the file and its chunks by ID
//     await bucket.delete(new ObjectId(id));

//     res
//       .status(200)
//       .json({ message: "Upload declined and deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting upload:", error);
//     res.status(500).json({ error: "Failed to delete upload" });
//   }
// };
// upload accepted fies by admin
// const accpetedByAdmin = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await mongoose.connection.db
//       .collection("uploads.files")
//       .findOneAndUpdate(
//         { _id: new ObjectId(id) }, // Find the file by its ID
//         { $set: { "metadata.status": "accepted" } }, // Update the metadata status to "accepted"
//         { returnOriginal: false } // Return the updated document
//       );

//     if (!result.value) {
//       return res.status(404).json({ error: "Upload not found" });
//     }

//     res.status(200).json(result.value); // Send the updated file data
//   } catch (error) {
//     console.error("Error accepting upload:", error);
//     res.status(500).json({ error: "Failed to accept upload" });
//   }
// };
// const declineNoteUpload = async (req, res) => {
//   const { id, type } = req.params; // Get the ID and type (exam or note) from the route
  
  
//   try {
//     if (type === "exam") {
//       console.log("hi");

//       const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//         bucketName: "uploads",
//       });
//       // Delete the exam file from GridFS (uploads collection)
      
//       await bucket.delete(new ObjectId(id));
//       res.status(200).json({ message: "Exam paper declined and deleted." });
//     } else if (type === "note") {
//       // Delete the note from the 'notes' collection
//       const result = await Note.findByIdAndDelete(id);
//       if (!result) return res.status(404).json({ message: "Note not found!" });
//       res.status(200).json({ message: "Note declined and deleted." });
//     } else {
//       res.status(400).json({ message: "Invalid type provided." });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting the upload.", error });
//   }
// };
const declineNoteUpload = async (req, res) => {
  console.log('hi');
  
  const { id, type } = req.params; // Get the ID and type from the route
  console.log(`Request Type: ${type}, Request ID: ${id}`); // Log the parameters

  try {
    if (type === "exam") {
      console.log("Attempting to delete exam..."); // Log attempt

      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      await bucket.delete(new ObjectId(id));
      res.status(200).json({ message: "Exam paper declined and deleted." });
    } else if (type === "notes") {
      console.log("Attempting to delete note..."); // Log attempt

      const result = await Note.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ message: "Note not found!" });
      res.status(200).json({ message: "Note declined and deleted." });
    } else {
      res.status(400).json({ message: "Invalid type provided." });
    }
  } catch (error) {
    console.error("Error:", error); // Log the error
    res.status(500).json({ message: "Error deleting the upload.", error });
  }
};

// Accept an upload (either exam or note)
const acceptNoteUpload = async (req, res) => {
  const { id, type } = req.params;
  try {
    if (type === "exam") {
      // Update the status of an exam paper in 'uploads.files' collection
      const result = await mongoose.connection.db
        .collection("uploads.files")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { "metadata.status": "accepted" } },
          { returnOriginal: false }
        );
      if (!result.value)
        return res.status(404).json({ message: "Exam paper not found!" });
      res.status(200).json({ message: "Exam paper accepted." });
    } else if (type === "notes") {
      // Update the status of a note in the 'notes' collection
      const note = await Note.findById(id);
      if (!note) return res.status(404).json({ message: "Note not found!" });

      note.status = "accepted";
      await note.save();
      res.status(200).json({ message: "Note accepted." });
    } else {
      res.status(400).json({ message: "Invalid type provided." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error accepting the upload.", error });
  }
};

module.exports = {
  getAllFiles,
  getPaginatedFiles,
  uploadpapers,
  getByFileName,
  getLinkFromCloudinary,
  uploadNotes,
  getUplodedNotes,
  getPendingExamFile,
  declineNoteUpload,
  acceptNoteUpload,
  getPendingNotesFile,
};
