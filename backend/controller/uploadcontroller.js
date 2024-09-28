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

module.exports = { uploadfunc, uploadfunc2 };
