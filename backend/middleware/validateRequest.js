const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForgotPassword = (req, res, next) => {
  const email = (req.body.email || "").trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  req.body.email = email;
  next();
};

const validateOtp = (req, res, next) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const otp = String(req.body.otp || "").trim();
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: "OTP must be a 6-digit code." });
  }
  req.body.email = email;
  req.body.otp = otp;
  next();
};

const validateUpdatePassword = (req, res, next) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const { newPassword } = req.body;
  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required." });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters." });
  }
  req.body.email = email;
  next();
};

module.exports = {
  validateForgotPassword,
  validateOtp,
  validateUpdatePassword,
};
