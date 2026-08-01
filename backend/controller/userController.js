const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { userModel } = require("../schema/userSchema");
const { Note } = require("../schema/noteschema");
const sendEmail = require("../utils/sendEmail");

require("dotenv").config();
const key = process.env.SECRET_KEY;

const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  profilePic: user.profilePic,
  role: user.role,
  favorites: user.favorites || [],
});

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

    res.status(201).json({
      message: "User created successfully",
      user: sanitizeUser(createdUser),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        role: user.role,
        fullName: user.fullName,
      },
      key,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "None",
      })
      .json({ message: "Login successful", user: sanitizeUser(user) });
  } catch (err) {
    console.error("Login failed   ", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    const user = await userModel
      .findById(req.user.id)
      .select("fullName email profilePic role favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const changeRole = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Valid email and role required" });
    }

    const user = await userModel.findOneAndUpdate(
      { email },
      { $set: { role } },
      { new: true }
    ).select("fullName email role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
};

const sendOtp = async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this email." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.resetVerifiedUntil = undefined;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Your IIITK Resources password reset OTP",
      otp,
    });

    const devLog =
      String(process.env.EMAIL_DEV_LOG || "")
        .trim()
        .toLowerCase() === "true";

    res.status(200).json({
      message: devLog
        ? "OTP generated (dev mode). Check the backend console for the code."
        : "OTP sent to your email.",
    });
  } catch (err) {
    console.error(err);
    let message = "Something went wrong. Please try again later.";
    if (err.code === "EMAIL_CONFIG") {
      message =
        "Email is not configured. Set EMAIL_USER and EMAIL_PASS in backend/.env.";
    } else if (err.code === "EMAIL_AUTH") {
      message = err.message;
    } else if (
      err.code === "EMAIL_SEND" ||
      err.message === "Error sending email"
    ) {
      message = "Could not send email. Please try again later.";
    }
    res.status(500).json({ message });
  }
};

const verifyOtp = async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const otp = String(req.body.otp || "").trim();

  try {
    const user = await userModel.findOne({ email });

    if (!user || !user.otp || !user.passwordResetExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid || user.passwordResetExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.otp = undefined;
    user.passwordResetExpires = undefined;
    user.resetVerifiedUntil = Date.now() + 15 * 60 * 1000;
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

const updatePassword = async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const { newPassword } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.resetVerifiedUntil || user.resetVerifiedUntil < Date.now()) {
      return res
        .status(403)
        .json({ message: "Please verify OTP before resetting password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.passwordResetExpires = undefined;
    user.resetVerifiedUntil = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const { resourceId, resourceType, title, meta } = req.body;
    if (!resourceId || !["paper", "note"].includes(resourceType)) {
      return res.status(400).json({ message: "Invalid favorite payload" });
    }

    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = user.favorites.findIndex(
      (f) => f.resourceId === resourceId && f.resourceType === resourceType
    );

    let favorited = false;
    if (existing >= 0) {
      user.favorites.splice(existing, 1);
    } else {
      user.favorites.push({
        resourceId,
        resourceType,
        title: title || "Resource",
        meta: meta || "",
      });
      favorited = true;
    }

    await user.save();
    res.status(200).json({
      message: favorited ? "Added to favorites" : "Removed from favorites",
      favorited,
      favorites: user.favorites,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update favorites" });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ favorites: user.favorites || [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to load favorites" });
  }
};

const getContributionStats = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("email fullName favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    const email = user.email;
    const name = user.fullName;

    const papersUploaded = await mongoose.connection.db
      .collection("uploads.files")
      .countDocuments({
        $or: [
          { "metadata.uploadedBy": email },
          { "metadata.uploadedBy": name },
        ],
      });

    const papersAccepted = await mongoose.connection.db
      .collection("uploads.files")
      .countDocuments({
        "metadata.status": "accepted",
        $or: [
          { "metadata.uploadedBy": email },
          { "metadata.uploadedBy": name },
        ],
      });

    const notesUploaded = await Note.countDocuments({
      $or: [{ uploadedBy: email }, { uploadedBy: name }, { uploadedById: user._id }],
    });

    const notesAccepted = await Note.countDocuments({
      status: "accepted",
      $or: [{ uploadedBy: email }, { uploadedBy: name }, { uploadedById: user._id }],
    });

    res.status(200).json({
      stats: {
        papersUploaded,
        papersAccepted,
        notesUploaded,
        notesAccepted,
        favoritesCount: user.favorites?.length || 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load stats" });
  }
};

const findUserByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: "Please provide a valid email." });
  }

  try {
    const user = await userModel.findOne({ email }).select("fullName role email");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error("Error finding user with email:", err.message);
    res.status(500).json({ message: "An error occurred while fetching the user." });
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
  toggleFavorite,
  getFavorites,
  getContributionStats,
  findUserByEmail,
};
