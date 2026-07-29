const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const { connect } = require("./connectdb/connectdb");
const { storage } = require("./multerStorage/storage");
const uploadRouter = require("./routes/upload");
const userRouter = require("./routes/userRoutes");
const communityRouter = require("./routes/communityRoutes");
const { unifiedSearch, downloadByFileName } = require("./controller/uploadcontroller");

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_LOCAL_URL,
  process.env.FRONTEND_DEPLOY_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

let gfs;

connect().then(() => {
  const db = mongoose.connection.db;
  gfs = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
  app.locals.gfs = gfs;
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok =
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/");
    if (ok) cb(null, true);
    else cb(new Error("Only PDF and image files are allowed"));
  },
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "iiitk-resources" });
});

app.get("/api/search", unifiedSearch);

const attachGfs = (req, res, next) => {
  req.gfs = req.app.locals.gfs;
  next();
};

app.get("/api/download/:filename", attachGfs, downloadByFileName);

app.use("/api/uploads", upload.single("image"), uploadRouter);
app.use(
  "/api/upload",
  fileUpload({ useTempFiles: true, limits: { fileSize: 25 * 1024 * 1024 } }),
  uploadRouter
);
app.use("/api/community", communityRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack || err);
  const status = err.message?.includes("Only PDF") ? 400 : 500;
  res.status(status).json({
    message: err.message || "Something broke!",
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
