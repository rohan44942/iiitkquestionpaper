const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
require("dotenv").config();
const path = require("path");
const mongoapi = process.env.MONGO_URL_ATLASH;

const storage = new GridFsStorage({
  url: mongoapi,
  file: (req, file) => {
    const filename = `${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;    
    return {
      filename,
      bucketName: "uploads",
    };
  },
});

module.exports = { storage };
