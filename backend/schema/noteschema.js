const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    subjectName: { type: String, required: true, trim: true },
    year: { type: String, default: "" },
    semester: { type: String, default: "" },
    branch: { type: String, default: "" },
    fileLink: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    uploadedBy: { type: String, default: "A helper" },
    uploadedById: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

noteSchema.index({ subjectName: "text", branch: "text", year: "text" });
noteSchema.index({ status: 1, year: 1, semester: 1 });

const Note = mongoose.model("Note", noteSchema);
module.exports = { Note };
