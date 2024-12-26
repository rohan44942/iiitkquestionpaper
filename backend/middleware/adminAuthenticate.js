const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.SECRET_KEY;

const adminAuthenticate = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token admin provided" });
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
      res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = adminAuthenticate;

// credentials: "include", // Include cookies in requests
