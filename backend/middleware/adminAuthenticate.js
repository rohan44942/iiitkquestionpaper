const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.SECRET_KEY;

const adminAuthenticate = (req, res, next) => {
  const token = req.cookies.token;
  // token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjIwMjFrdWNwMTEwOUBpaWl0a290YS5hYy5pbiIsImlkIjoiNjc0YWQ4MGM3MzllYjY2OWFhMTJkMGY4IiwiaWF0IjoxNzMyOTg4NTk3LCJleHAiOjE3MzI5OTIxOTd9.-rGY6qALvQpNql6gnEPqM2nYXzF71jFXMqs6mm6gJEI";
  if (!token) {
    return res
      .status(401)
      .json({ msg: "Access Denied: No token admin provided" });
  }

  try {
    const decoded = jwt.verify(token, key); // Verify token
    
    if (
      process.env.EMAIL_ADMIN1 === decoded.email ||
      process.env.EMAIL_ADMIN2 === decoded.email || decoded.role === "admin"

    ) {
      req.user = decoded; // Attach user info to the request
      next();
    } else {
      res.status(403).json({ msg: "Access denied" });
    }
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
  }
};

module.exports = adminAuthenticate;

// credentials: "include", // Include cookies in requests
