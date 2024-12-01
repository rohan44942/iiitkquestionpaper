const express = require("express");
const router = express.Router();
const userAuthenticate = require("../middleware/userAuthenticate");
const adminAuthenticate = require("../middleware/adminAuthenticate");
const app = express();
// app.use(userAuthenticate);
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
  downloadByFileName,
} = require("../controller/uploadcontroller");

// Use POST for uploads
router.post("/", userAuthenticate, uploadpapers);
router.get("/", getAllFiles);
router.post("/link", userAuthenticate, getLinkFromCloudinary);
router.post("/notes", userAuthenticate, uploadNotes);
router.get("/notes", getUplodedNotes);
router.get("/status/pending/papers",adminAuthenticate, getPendingExamFile);
router.get("/status/pending/notes",adminAuthenticate, getPendingNotesFile);
// router.delete('/api/uploads/:id/:type', declineNoteUpload);

router.delete("/:type/:id", adminAuthenticate, declineNoteUpload);
router.put("/status/accept/:type/:id", adminAuthenticate, acceptNoteUpload);
// router.put("/status/accept/:id", accpetedByAdmin);
// router.delete("/:id", deleteItems);
// filenameke liye
router.get("/download/:filename", attachGfs, downloadByFileName);
router.get("/:filename", attachGfs, getByFileName); // this have some problem

module.exports = router;
