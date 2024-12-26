const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.SECRET_KEY;

const userAuthenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token user provided" });
  }


  try {  
    const decoded = jwt.verify(token, key); // Verify token
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = userAuthenticate;

// credentials: "include", // Include cookies in requests
