const express = require("express");
const router = express.Router();
const userAuthenticate = require("../middleware/userAuthenticate");
const adminAuthenticate = require("../middleware/adminAuthenticate");

const attachGfs = (req, res, next) => {
  req.gfs = req.app.locals.gfs;
  next();
};

const {
  getByFileName,
  uploadpapers,
  getAllFiles,
  getLinkFromCloudinary,
  uploadNotes,
  getUplodedNotes,
  getPendingExamFile,
  declineNoteUpload,
  acceptNoteUpload,
  getPendingNotesFile,
  downloadByFileName,
} = require("../controller/uploadcontroller");

router.post("/", userAuthenticate, uploadpapers);
router.get("/", getAllFiles);
router.post("/link", userAuthenticate, getLinkFromCloudinary);
router.post("/notes", userAuthenticate, uploadNotes);
router.get("/notes", getUplodedNotes);
router.get("/status/pending/papers", adminAuthenticate, getPendingExamFile);
router.get("/status/pending/notes", adminAuthenticate, getPendingNotesFile);
router.delete("/:type/:id", adminAuthenticate, declineNoteUpload);
router.put("/status/accept/:type/:id", adminAuthenticate, acceptNoteUpload);
router.get("/download/:filename", attachGfs, downloadByFileName);
router.get("/:filename", attachGfs, getByFileName);

module.exports = router;
