const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const { ObjectId } = require("mongodb");
const { Note } = require("../schema/noteschema");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadpapers = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

  const { year, branch, description, fileName, status, uploadedBy } = req.body;
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
          "metadata.uploadedBy": uploadedBy || "A helper",
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
  const { year, branch, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const filter = { "metadata.status": "accepted" };

    if (year) {
      filter["metadata.year"] = year;
    }
    if (branch) {
      filter["metadata.branch"] = { $regex: new RegExp(branch, "i") };
    }

    const files = await mongoose.connection.db
      .collection("uploads.files")
      .find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const totalFiles = await mongoose.connection.db
      .collection("uploads.files")
      .countDocuments(filter);

    res.status(200).json({
      files,
      totalFiles,
      currentPage: page,
      totalPages: Math.ceil(totalFiles / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}; // done

const downloadByFileName = (req, res) => {
  const gfs = req.gfs;
  const filename = req.params.filename;
  res.set({
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Type": "application/octet-stream",
  });
  const readStream = gfs.openDownloadStreamByName(filename);
  readStream.pipe(res);
};
const getPaginatedFiles = async (req, res) => {
  const { page = 1, limit = 10, year, branch } = req.query;

  try {
    const filesCollection = mongoose.connection.db.collection("uploads.files");

    const filter = {};
    if (year) filter["metadata.year"] = year;
    if (branch) filter["metadata.branch"] = branch;

    const totalFiles = await filesCollection.countDocuments(filter);

    const totalPages = Math.ceil(totalFiles / limit);

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
    const { page = 1, year, semester, subject } = req.query;
    const limit = 6;
    const skip = (page - 1) * limit;

    const filter = { status: "accepted" };

    if (year) filter.year = year;
    if (semester) filter.semester = semester;
    if (subject) filter.subjectName = { $regex: new RegExp(subject, "i") };

    const [notes, totalNotes] = await Promise.all([
      Note.find(filter).skip(skip).limit(limit).lean(),
      Note.countDocuments(filter),
    ]);

    res.status(200).json({
      notes,
      totalPages: Math.ceil(totalNotes / limit),
      currentPage: parseInt(page),
      hasMore: notes.length === limit,
      totalNotes,
    });
  } catch (error) {
    // console.error("Error fetching notes:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
// get pending file to the admin
const getPendingNotesFile = async (req, res) => {
  try {
    const files = await mongoose.connection.db
      .collection("notes")
      .find({ status: "pending" })
      .toArray();

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching pending uploads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getPendingExamFile = async (req, res) => {
  try {
    const files = await mongoose.connection.db
      .collection("uploads.files")
      .find({ "metadata.status": "pending" })
      .toArray();

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching pending uploads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const declineNoteUpload = async (req, res) => {
  const { id, type } = req.params;

  try {
    if (type === "exam") {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      await bucket.delete(new ObjectId(id));
      res.status(200).json({ message: "Exam paper declined and deleted." });
    } else if (type === "notes") {
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
  downloadByFileName,
};
