const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  next();
};

const validateOtp = (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }
  next();
};

const validateUpdatePassword = (req, res, next) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required." });
  }
  next();
};

module.exports = {
  validateForgotPassword,
  validateOtp,
  validateUpdatePassword,
};
