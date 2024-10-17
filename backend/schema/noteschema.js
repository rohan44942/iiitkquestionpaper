const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema({
  subjectName: String,
  year: String,
  semester: String,
  branch: String,
  fileLink: String,
  status: String,
});
const Note = mongoose.model("Note", noteSchema);
module.exports = { Note };
