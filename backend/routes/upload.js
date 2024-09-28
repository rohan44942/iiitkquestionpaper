const express = require("express");

const { uploadfunc, uploadfunc2 } = require("../controller/uploadcontroller");
const router = express.Router();

// Use POST for uploads
router.post("/", uploadfunc); // Adjust field name if necessary
router.get("/data", uploadfunc2);

module.exports = { router };
