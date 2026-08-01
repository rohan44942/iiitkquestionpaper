import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const STEPS = [
  { id: 1, label: "Email" },
  { id: 2, label: "OTP" },
  { id: 3, label: "Password" },
  { id: 4, label: "Done" },
];

const RESEND_SECONDS = 60;

const ResetPassword = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendCooldown = () => {
    setResendIn(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendIn((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleRequestOtp = async (isResend = false) => {
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(`${baseUrl}/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setSuccess(
        isResend
          ? "A new OTP has been sent to your email."
          : "OTP sent to your email. Check your inbox."
      );
      setStep(2);
      if (isResend) setOtp("");
      startResendCooldown();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("OTP is required.");
      return;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("OTP must be a 6-digit code.");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(`${baseUrl}/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      setSuccess("OTP verified. Set your new password.");
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch(`${baseUrl}/user/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setSuccess("Password updated successfully.");
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepTitle = {
    1: "Forgot password",
    2: "Enter OTP",
    3: "New password",
    4: "All set",
  };

  const stepSubtitle = {
    1: "We’ll email a 6-digit code to reset your password.",
    2: `Code sent to ${email}. Valid for 10 minutes.`,
    3: "Choose a strong password with at least 8 characters.",
    4: "You can sign in with your new password.",
  };

  return (
    <div className="page-shell flex justify-center">
      <div className="surface-card w-full max-w-md p-6 sm:p-8 animate-fadeUp">
        <div className="flex justify-between gap-1 mb-6">
          {STEPS.map((s) => (
            <div key={s.id} className="flex-1 text-center">
              <div
                className={`mx-auto h-1.5 rounded-full transition-colors ${
                  step >= s.id ? "bg-accent" : "bg-paper-line"
                }`}
              />
              <p
                className={`text-[10px] mt-1.5 uppercase tracking-wide ${
                  step >= s.id ? "text-accent" : "text-ink-muted"
                }`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <h1 className="font-display text-2xl sm:text-3xl text-ink text-center">
          {stepTitle[step]}
        </h1>
        <p className="text-sm text-ink-muted text-center mt-2 mb-6">
          {stepSubtitle[step]}
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 text-rose-600 text-sm px-3 py-2.5">
            {error}
          </div>
        )}
        {success && step !== 4 && (
          <div className="mb-4 rounded-xl bg-accent-soft text-accent text-sm px-3 py-2.5">
            {success}
          </div>
        )}

        {step === 1 && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleRequestOtp(false);
            }}
          >
            <label className="block text-sm font-medium text-ink">
              Email
              <input
                type="email"
                autoComplete="email"
                className="field mt-1.5"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Sending OTP…" : "Send OTP"}
            </button>
            <p className="text-sm text-center text-ink-muted">
              <Link to="/login" className="text-accent hover:underline">
                Back to login
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyOtp();
            }}
          >
            <label className="block text-sm font-medium text-ink">
              6-digit OTP
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                className="field mt-1.5 tracking-[0.35em] text-center text-lg font-medium"
                placeholder="••••••"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
            <button
              type="button"
              disabled={loading || resendIn > 0}
              onClick={() => handleRequestOtp(true)}
              className="btn-ghost w-full disabled:opacity-60"
            >
              {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
            </button>
            <p className="text-sm text-center text-ink-muted">
              <button
                type="button"
                className="text-accent hover:underline"
                onClick={() => {
                  clearMessages();
                  setStep(1);
                  setOtp("");
                }}
              >
                Change email
              </button>
            </p>
          </form>
        )}

        {step === 3 && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdatePassword();
            }}
          >
            <label className="block text-sm font-medium text-ink">
              New password
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="field pr-10"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>
            <label className="block text-sm font-medium text-ink">
              Confirm password
              <div className="relative mt-1.5">
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  className="field pr-10"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={
                    showConfirm ? "Hide confirm password" : "Show confirm password"
                  }
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center space-y-5">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-accent-soft text-accent flex items-center justify-center text-2xl font-display">
              ✓
            </div>
            <p className="text-sm text-ink-muted">
              Your password has been updated. Sign in with your new credentials.
            </p>
            <Link to="/login" className="btn-primary w-full">
              Go to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
