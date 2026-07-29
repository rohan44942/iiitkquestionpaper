const express = require("express");
const router = express.Router();
const userAuthenticate = require("../middleware/userAuthenticate");
const adminAuthenticate = require("../middleware/adminAuthenticate");
const {
  validateForgotPassword,
  validateOtp,
  validateUpdatePassword,
} = require("../middleware/validateRequest");
const {
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
} = require("../controller/userController");

router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user/me", userAuthenticate, getUserDetails);
router.get("/user/logout", userAuthenticate, logout);
router.put("/user/changeRole", adminAuthenticate, changeRole);
router.get("/user/data", adminAuthenticate, findUserByEmail);
router.post("/user/favorites", userAuthenticate, toggleFavorite);
router.get("/user/favorites", userAuthenticate, getFavorites);
router.get("/user/stats", userAuthenticate, getContributionStats);

router.post("/user/forgot-password", validateForgotPassword, sendOtp);
router.post("/user/verify-otp", validateOtp, verifyOtp);
router.post("/user/update-password", validateUpdatePassword, updatePassword);
// legacy mounts used by older frontend paths
router.post("/forgot-password", validateForgotPassword, sendOtp);
router.post("/verify-otp", validateOtp, verifyOtp);
router.post("/update-password", validateUpdatePassword, updatePassword);

module.exports = router;
