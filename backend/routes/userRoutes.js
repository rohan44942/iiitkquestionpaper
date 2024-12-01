const express = require("express");
const router = express.Router();
const userAuthenticate = require("../middleware/userAuthenticate");
// router.use(userAuthenticate);// dont use for all routes
// controller
const {
  register,
  login,
  getUserDetails,
  logout,
  changeRole,
} = require("../controller/userController");
router.post("/user/register", register); // server app.use("/",Register)
router.post("/user/login", login); // server app.use("/",Register)
// router.get("/user/data", userAuthenticate, findUserWithEmail);
router.get("/user/me", userAuthenticate, getUserDetails);
router.get("/user/logout", userAuthenticate, logout);
router.put('/user/changeRole',changeRole)
module.exports = router;
