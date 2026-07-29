const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const { ObjectId } = require("mongodb");
const { Note } = require("../schema/noteschema");
const {
  ciExact,
  normalizeBranchCode,
  branchMatchCondition,
  andConditions,
  containsCi,
} = require("../utils/filterHelpers");

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
    const normalizedBranch = normalizeBranchCode(branch) || branch || "N/A";

    await filesCollection.updateOne(
      { _id: req.file.id },
      {
        $set: {
          "metadata.year": (year || "N/A").toString().trim(),
          "metadata.branch": normalizedBranch,
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
  const { year, branch, q, page = 1, limit = 10 } = req.query;
  const limitNum = parseInt(limit) || 10;
  const pageNum = parseInt(page) || 1;
  const skip = (pageNum - 1) * limitNum;

  try {
    let filter = { "metadata.status": "accepted" };

    if (year) {
      // "1st sem midterm" matches "1st Sem Midterm" etc.
      filter["metadata.year"] = ciExact(year);
    }

    const branchCond = branch
      ? branchMatchCondition("metadata.branch", branch)
      : null;
    if (branchCond) {
      filter = andConditions(filter, branchCond);
    }

    if (q && q.trim()) {
      const term = containsCi(q);
      filter = andConditions(filter, {
        $or: [
          { "metadata.fileName": term },
          { "metadata.description": term },
          { filename: term },
          { "metadata.branch": term },
          { "metadata.year": term },
        ],
      });
    }

    const files = await mongoose.connection.db
      .collection("uploads.files")
      .find(filter)
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const totalFiles = await mongoose.connection.db
      .collection("uploads.files")
      .countDocuments(filter);

    res.status(200).json({
      files,
      totalFiles,
      currentPage: pageNum,
      totalPages: Math.ceil(totalFiles / limitNum) || 1,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const downloadByFileName = async (req, res) => {
  const gfs = req.gfs;
  const filename = req.params.filename;
  try {
    await mongoose.connection.db.collection("uploads.files").updateOne(
      { filename },
      { $inc: { "metadata.downloads": 1 } }
    );
  } catch (e) {
    // non-blocking
  }
  res.set({
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Type": "application/octet-stream",
  });
  const readStream = gfs.openDownloadStreamByName(filename);
  readStream.pipe(res);
};

const unifiedSearch = async (req, res) => {
  const { q = "", limit = 8 } = req.query;
  if (!q.trim()) {
    return res.status(200).json({ papers: [], notes: [] });
  }
  const term = containsCi(q);
  try {
    const paperFilter = {
      "metadata.status": "accepted",
      $or: [
        { "metadata.fileName": term },
        { "metadata.description": term },
        { filename: term },
        { "metadata.branch": term },
      ],
    };
    const noteFilter = {
      status: "accepted",
      $or: [
        { subjectName: term },
        { branch: term },
        { year: term },
      ],
    };

    const [papers, notes] = await Promise.all([
      mongoose.connection.db
        .collection("uploads.files")
        .find(paperFilter)
        .limit(parseInt(limit))
        .toArray(),
      Note.find(noteFilter).limit(parseInt(limit)).lean(),
    ]);

    res.status(200).json({ papers, notes, query: q.trim() });
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};

const getPaginatedFiles = async (req, res) => {
  const { page = 1, limit = 10, year, branch } = req.query;

  try {
    const filesCollection = mongoose.connection.db.collection("uploads.files");
    let filter = {};
    if (year) filter["metadata.year"] = ciExact(year);
    const branchCond = branch
      ? branchMatchCondition("metadata.branch", branch)
      : null;
    if (branchCond) filter = andConditions(filter, branchCond);

    const totalFiles = await filesCollection.countDocuments(filter);
    const totalPages = Math.ceil(totalFiles / limit);

    const files = await filesCollection
      .find(filter)
      .sort({ uploadDate: -1 })
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
};

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

const uploadNotes = async (req, res) => {
  const { subjectName, year, semester, branch, fileLink, status, uploadedBy } =
    req.body;
  try {
    const newNote = new Note({
      subjectName: (subjectName || "").trim(),
      year: (year || "").trim(),
      semester: (semester || "").trim(),
      branch: normalizeBranchCode(branch) || (branch || "").trim(),
      fileLink,
      status: status || "pending",
      uploadedBy: uploadedBy || req.user?.email || "A helper",
      uploadedById: req.user?.id,
    });

    await newNote.save();
    res.status(200).json({ message: "Note uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving note", error });
  }
};

const getUplodedNotes = async (req, res) => {
  try {
    const { page = 1, year, semester, subject, q, branch } = req.query;
    const limit = 6;
    const pageNum = parseInt(page) || 1;
    const skip = (pageNum - 1) * limit;

    let filter = { status: "accepted" };

    if (year) filter.year = ciExact(year);
    if (semester) filter.semester = ciExact(semester);

    const branchCond = branch ? branchMatchCondition("branch", branch) : null;
    if (branchCond) filter = andConditions(filter, branchCond);

    const searchTerm = subject || q;
    if (searchTerm) {
      const term = containsCi(searchTerm);
      filter = andConditions(filter, {
        $or: [{ subjectName: term }, { branch: term }],
      });
    }

    const [notes, totalNotes] = await Promise.all([
      Note.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Note.countDocuments(filter),
    ]);

    res.status(200).json({
      notes,
      totalPages: Math.ceil(totalNotes / limit) || 1,
      currentPage: pageNum,
      hasMore: notes.length === limit,
      totalNotes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

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
    console.error("Error:", error);
    res.status(500).json({ message: "Error deleting the upload.", error });
  }
};

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
  unifiedSearch,
};
