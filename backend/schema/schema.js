const questionSchema = new mongoose.Schema({
  fileName: String,
  year: Number,
  branch: String,
  semester: Number,
  subject: String,
  fileType: String,
  gridFsFileId: mongoose.Schema.Types.ObjectId, // GridFS file reference
});
