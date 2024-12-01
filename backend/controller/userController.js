const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../schema/userSchema");
// const cookieParser = require("cookie-parser");

require("dotenv").config();
const key = process.env.SECRET_KEY;
const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Generate salt and hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the database
    const createdUser = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Send the created user as the response
    res
      .status(201)
      .json({ message: "User created successfully", user: createdUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }
    // Generate JWT
    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      key,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true, // Prevent access from client-side scripts
        secure: process.env.NODE_ENV === "production", // Send only over HTTPS when we put this in production
        maxAge: 60 * 60 * 1000, // 1 hour only
        sameSite: "None",
      })
      .json({ msg: "Login successful", token: token });
  } catch (err) {
    console.error("Login failed   ", err);
    res.status(500).json({ msg: " server error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ msg: "Invalid user data" });
    }

    const user = await userModel
      .findById(req.user.id)
      .select("fullName email profilePic role"); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Use secure cookies in production
    sameSite: "None",
  });
  res.status(200).json({ msg: "Logged out successfully" });
};

// const findUserWithEmail = async (req, res) => {
//   const { email } = req.query; // Extract email from query parameters
//   // Validate the input
//   if (!email) {
//     return res.status(400).json({ msg: "Please provide a valid email." });
//   }

//   try {
//     // Find the user with the specified email, selecting only fullName, role, and email fields
//     const user = await userModel
//       .findOne({ email })
//       .select("fullName role email");

//     // If no user is found, return a 404 status
//     if (!user) {
//       return res.status(404).json({ msg: "User not found." });
//     }

//     // Respond with the user data
//     res.status(200).json({ user });
//   } catch (err) {
//     // Handle any server errors
//     console.error("Error finding user with email:", err.message);
//     res.status(500).json({ msg: "An error occurred while fetching the user." });
//   }
// };
const changeRole = async (req, res) => {
  try {
    const { email, role } = req.body; // Assume you send email and newRole in the body

    // Find the user by email and update the role
    const user = await userModel.findOneAndUpdate(
      { email: email }, // Query to find the user by email
      { $set: { role: role } }, // Update the role field
      { new: true } // Option to return the updated document
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(`User role updated to ${role}`);
  } catch (err) {
    res.status(500).send("Error updating role");
  }
};

module.exports = { register, login, getUserDetails, logout, changeRole };
