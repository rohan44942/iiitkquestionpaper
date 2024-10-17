const express = require("express");
const router = express.Router();
// writing a middlewar of attaching gfs to req
const attachGfs = (req, res, next) => {
  req.gfs = req.app.locals.gfs; // Attach gfs to the request object
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
} = require("../controller/uploadcontroller");

// Use POST for uploads
router.post("/", uploadpapers);
router.get("/", getAllFiles);
router.post("/link", getLinkFromCloudinary);
router.post("/notes", uploadNotes);
router.get("/notes", getUplodedNotes);
router.get("/status/pending/papers", getPendingExamFile);
router.get("/status/pending/notes", getPendingNotesFile);

router.delete("/:type/:id", declineNoteUpload);
router.put("/status/accept/:type/:id", acceptNoteUpload);
// router.put("/status/accept/:id", accpetedByAdmin);
// router.delete("/:id", deleteItems);
// filenameke liye
router.get("/:filename", attachGfs, getByFileName); // this have some problem

module.exports = router;
