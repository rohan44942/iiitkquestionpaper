import React, { useState } from "react";
import { Link } from "react-router-dom";
const ResetPassword = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [step, setStep] = useState(1); // Tracks the current step
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sent state
  const [isResendAllowed, setIsResendAllowed] = useState(false); // Track resend OTP state
  const [loading, setLoading] = useState(false); // Track OTP sending process
  const [showPassword, setShowPassword] = useState(false); // Track password visibility

  const handleRequestOtp = async () => {
    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true); // Start loading animation

    try {
      const response = await fetch(`${baseUrl}/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to request OTP");

      setSuccess(data.message);
      setError("");
      setStep(2); // Move to OTP verification step
      setIsOtpSent(true); // OTP has been sent successfully
      setIsResendAllowed(true); // Allow resend OTP after OTP is sent
    } catch (err) {
      setError(err.message);
      setSuccess("");
      setIsOtpSent(false); // OTP wasn't sent due to error
    } finally {
      setLoading(false); // End loading animation
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("OTP is required.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/user/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "OTP verification failed");

      setSuccess(data.message);
      setError("");
      setStep(3); // Move to password reset step
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/user/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update password");

      setSuccess(data.message);
      setError("");
      setStep(4); // Move to success step
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  // Handle resend OTP button
  const handleResendOtp = () => {
    setIsOtpSent(false); // Reset the OTP sent status to false
    handleRequestOtp(); // Call to request OTP again
  };

  // Toggle the show password functionality
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev); // Toggle between true and false
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Your Password
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {step === 1 && (
          <>
            <input
              type="email"
              className="w-full p-3 border rounded mb-4"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleRequestOtp}
              disabled={isOtpSent || loading} // Disable if OTP is sent or if loading
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              {loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-4 border-t-4 border-white rounded-full"></span>
              ) : isOtpSent ? (
                "OTP Sent"
              ) : (
                "Request OTP"
              )}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              className="w-full p-3 border rounded mb-4"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Verify OTP
            </button>

            {isResendAllowed && !isOtpSent && (
              <button
                onClick={handleResendOtp}
                className="w-full bg-yellow-500 text-white py-2 rounded mt-4"
              >
                Resend OTP
              </button>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <input
              type={showPassword ? "text" : "password"} // Toggle between password and text type
              className="w-full p-3 border rounded mb-4"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type={showPassword ? "text" : "password"} // Toggle between password and text type
              className="w-full p-3 border rounded mb-4"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={toggleShowPassword}
              type="button"
              className="text-blue-500 mb-4"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
            <button
              onClick={handleUpdatePassword}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Update Password
            </button>
          </>
        )}

        {step === 4 && (
          <p className="text-green-500 text-center">
            Password updated successfully! You can now log in with your new
            password.
            <Link to="/login" className="text-blue-500 hover:underline">
              Go to Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
