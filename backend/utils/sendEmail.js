const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: email, 
    subject: subject, 
    html: ` 
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your account. Please use the OTP below to reset your password:</p>
        <p style="font-size: 18px; font-weight: bold; color: #4CAF50;">${message}</p>
        <p>Best regards,<br/>The IIITK Resources Team</p>
      </div>
    `,
  };

  try {
   
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Error sending email");
  }
};

module.exports = sendEmail;
