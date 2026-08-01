const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const cleanEnv = (value) =>
  String(value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "");

const sendEmail = async ({ email, subject, otp, message }) => {
  const user = cleanEnv(process.env.EMAIL_USER);
  const pass = cleanEnv(process.env.EMAIL_PASS);
  const devLog = cleanEnv(process.env.EMAIL_DEV_LOG).toLowerCase() === "true";

  if (devLog) {
    console.log("────────────────────────────────────");
    console.log(`[EMAIL_DEV_LOG] To: ${email}`);
    console.log(`[EMAIL_DEV_LOG] Subject: ${subject || "IIITK Resources"}`);
    if (otp) console.log(`[EMAIL_DEV_LOG] OTP: ${otp}`);
    if (message) console.log(`[EMAIL_DEV_LOG] Message: ${message}`);
    console.log("────────────────────────────────────");
    return { mode: "dev" };
  }

  if (!user || !pass) {
    const err = new Error("Email service is not configured");
    err.code = "EMAIL_CONFIG";
    throw err;
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user, pass },
  });

  const otpBlock = otp
    ? `
      <div style="margin:24px 0;padding:20px 24px;background:#F0FDFA;border:1px solid #99F6E4;border-radius:12px;text-align:center;">
        <p style="margin:0 0 8px;font-size:13px;color:#0F766E;letter-spacing:0.08em;text-transform:uppercase;">Your OTP</p>
        <p style="margin:0;font-size:32px;font-weight:700;letter-spacing:0.28em;color:#0B1F33;">${otp}</p>
      </div>
      <p style="margin:0 0 8px;font-size:14px;color:#475569;">This code expires in <strong>10 minutes</strong>.</p>
      <p style="margin:0;font-size:14px;color:#64748B;">If you did not request a password reset, you can ignore this email.</p>
    `
    : `<p style="font-size:15px;color:#334155;line-height:1.6;">${message || ""}</p>`;

  const mailOptions = {
    from: `"IIITK Resources" <${user}>`,
    to: email,
    subject: subject || "IIITK Resources",
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;background:#F8FAFC;padding:32px 16px;">
        <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;">
          <div style="padding:20px 24px;background:#0F766E;">
            <p style="margin:0;font-size:18px;font-weight:600;color:#ffffff;">IIITK Resources</p>
            <p style="margin:4px 0 0;font-size:12px;color:#CCFBF1;">Password reset</p>
          </div>
          <div style="padding:28px 24px;">
            <p style="margin:0 0 12px;font-size:16px;color:#0B1F33;">Hello,</p>
            <p style="margin:0;font-size:15px;color:#475569;line-height:1.6;">
              Use the one-time code below to reset your password.
            </p>
            ${otpBlock}
          </div>
          <div style="padding:16px 24px;border-top:1px solid #E2E8F0;background:#F8FAFC;">
            <p style="margin:0;font-size:12px;color:#94A3B8;">© IIITK Resources · Do not share this code</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { mode: "smtp" };
  } catch (err) {
    console.error("Error sending email:", err);
    if (err.code === "EAUTH" || err.responseCode === 535) {
      const authErr = new Error(
        "Gmail rejected EMAIL_USER / EMAIL_PASS. Use a Gmail address and a Google App Password (not your normal password)."
      );
      authErr.code = "EMAIL_AUTH";
      throw authErr;
    }
    const sendErr = new Error("Error sending email");
    sendErr.code = "EMAIL_SEND";
    throw sendErr;
  }
};

module.exports = sendEmail;
