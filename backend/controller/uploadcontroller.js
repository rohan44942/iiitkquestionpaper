const uploadfunc = (req, res) => {
  console.log(req.file);
  res.status(200).json({ message: "File uploaded successfully!" });
};

const uploadfunc2 = async (req, res) => {
  try {
    res.send("This is the response from the upload func2");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
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


module.exports = { uploadfunc, uploadfunc2 ,getPaginatedFiles};
