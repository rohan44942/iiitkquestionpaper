const express = require("express");
const { uploadfunc, uploadfunc2 } = require("../controller/uploadcontroller");
const multer = require("multer");
const upload = multer({ dest: "data/" }); // Configure multer as needed

const router = express.Router();

// Use POST for uploads
router.post("/", upload.single("image"), uploadfunc); // Adjust field name if necessary
router.get("/data", uploadfunc2);

module.exports = { router };
