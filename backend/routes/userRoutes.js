const express = require("express");
const router = express.Router();
const userAuthenticate = require("../middleware/userAuthenticate");
const {
  validateForgotPassword,
  validateOtp,
  validateUpdatePassword,
} = require("../middleware/validateRequest");
// router.use(userAuthenticate);// dont use for all routes
// controller
const {
  register,
  login,
  getUserDetails,
  logout,
  changeRole,
  sendOtp,
  verifyOtp,
  updatePassword,
} = require("../controller/userController");
router.post("/user/register", register); // server app.use("/",Register)
router.post("/user/login", login); // server app.use("/",Register)
// router.get("/user/data", userAuthenticate, findUserWithEmail);
router.get("/user/me", userAuthenticate, getUserDetails);
router.get("/user/logout", userAuthenticate, logout);
router.put("/user/changeRole", changeRole);
// forgot password route
router.post("/forgot-password", validateForgotPassword, sendOtp);
router.post("/verify-otp", validateOtp, verifyOtp);
router.post("/update-password", validateUpdatePassword, updatePassword);
module.exports = router;
