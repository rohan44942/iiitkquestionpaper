const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../schema/userSchema");
const sendEmail = require("../utils/sendEmail");
// const cookieParser = require("cookie-parser");

require("dotenv").config();
const key = process.env.SECRET_KEY;


const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

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
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
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
        // secure: process.env.NODE_ENV === "production", // Send only over HTTPS when in production
        secure:true,
        maxAge: 60 * 60 * 1000, // 1 hour only
        sameSite: "None",
      })
      .json({ message: "Login successful", token: token });
  } catch (err) {
    console.error("Login failed   ", err);
    res.status(500).json({ message: "Server error" });
  }
};

//user/me wala route
const getUserDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    const user = await userModel
      .findById(req.user.id)
      .select("fullName email profilePic role"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Use secure cookies in production
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const changeRole = async (req, res) => {
  try {
    const { email, role } = req.body; //  send email and newRole in the body

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

const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email." });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save OTP and its expiration time in the user document
    user.otp = hashedOtp;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes
    // console.log(Date.now());
    await user.save();

    // Send the OTP to the user via email
    const message = `
      <p>Your OTP for resetting the password is: <strong>${otp}</strong>.</p>
      <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP",
      message,
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
// Verify OTP sent to the user's email
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user || !user.otp || !user.passwordResetExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP this." });
    }

    // Check if the OTP is valid
    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid || user.passwordResetExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // OTP is valid, allow password reset
    user.otp = undefined; // Clear OTP after verification
    user.otpExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "OTP verified. You may now reset your password." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

// Update the password for the user after OTP verification
const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and clear OTP-related fields
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({});
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
module.exports = {
  register,
  login,
  getUserDetails,
  logout,
  changeRole,
  sendOtp,
  verifyOtp,
  updatePassword,
};
