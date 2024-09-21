// we write the route and then in controller write the contorller of it
const express = require("express");
const { uploadfunc, uploadfunc2 } = require("../controller/uploadcontroller");
const router = express.Router();
const app = express();

router.get("/", uploadfunc);
router.get("/data", uploadfunc2);

module.exports = { router };
