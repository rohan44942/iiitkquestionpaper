const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const sendEmail = async ({ email, subject, message }) => {
  // Create a transporter for sending the email
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Use your email provider (e.g., Gmail, Outlook)
    auth: {
      user: process.env.EMAIL_USER, // Sender's email
      pass: process.env.EMAIL_PASS, // Sender's email password or app-specific password
    },
  });

  // Define the email content
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: email, // Recipient's email
    subject: subject, // Email subject
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
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Error sending email");
  }
};

module.exports = sendEmail;
