const metadataSchema = new mongoose.Schema({
  fileId: mongoose.Schema.Types.ObjectId,  // GridFS file ID reference
  filename: String,
  contentType: String,
  year: String,       // Metadata field
  branch: String,     // Metadata field
  fileName: String,   // Metadata field (name of the file)
  description: String // Metadata field (description of the file)
});

const Metadata = mongoose.model('Metadata', metadataSchema);

