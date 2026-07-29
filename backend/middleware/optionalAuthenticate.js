const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.SECRET_KEY;

/** Attaches req.user when a valid cookie exists; never blocks the request. */
const optionalAuthenticate = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    req.user = jwt.verify(token, key);
  } catch (err) {
    // ignore invalid token for public reads
  }
  next();
};

module.exports = optionalAuthenticate;
