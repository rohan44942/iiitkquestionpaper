const uploadfunc = async (req, res) => {
  try {
    // Access uploaded file through req.file if needed
    // const imageName = req.file.filename;
    console.log(req.body);
    console.log(req.file);
    res.send({ imageName: "rohan" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
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
