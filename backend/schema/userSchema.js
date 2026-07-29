const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    resourceId: { type: String, required: true },
    resourceType: { type: String, enum: ["paper", "note"], required: true },
    title: { type: String, default: "Resource" },
    meta: { type: String, default: "" },
  },
  { timestamps: { createdAt: "addedAt", updatedAt: false } }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
    },
    profilePic: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    favorites: { type: [favoriteSchema], default: [] },
    passwordResetExpires: Date,
    otp: String,
    resetVerifiedUntil: Date,
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
module.exports = { userModel };
