import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserContext } from "../contextapi/userContext";

const AuthForm = ({ baseUrl }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [response, setResponse] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const toggleForm = () => setIsLogin(!isLogin);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }
    if (!isLogin && !formData.fullName) {
      setError("Full name is required for registration.");
      return;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const url = isLogin ? `${baseUrl}/user/login` : `${baseUrl}/user/register`;
    setResponse(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: !isLogin ? formData.fullName : undefined,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "An unexpected error occurred.");
      }

      setResponse(false);
      if (isLogin) {
        if (data.user) updateUser(data.user);
        else {
          const me = await fetch(`${baseUrl}/user/me`, { credentials: "include" });
          const meData = await me.json();
          if (meData.user) updateUser(meData.user);
        }
        navigate("/user");
      } else {
        setIsLogin(true);
        setError("");
        alert("Registration successful! Please log in.");
      }

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
      setResponse(false);
    }
  };

  useEffect(() => {
    setError("");
  }, [isLogin]);

  return (
    <div className="w-full">
      <h3 className="font-display text-2xl text-center text-ink mb-1">
        {isLogin ? "Welcome back" : "Create account"}
      </h3>
      <p className="text-center text-sm text-ink-muted mb-6">
        IIITK Resources — papers, notes, community
      </p>
      {error && (
        <p className="text-rose-600 text-center text-sm mb-3 bg-rose-50 rounded-xl py-2 px-3">
          {error}
        </p>
      )}
      <form autoComplete="off" onSubmit={handleSubmit} className="space-y-3">
        {!isLogin && (
          <input
            className="field"
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        )}
        <input
          className="field"
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <div className="relative">
          <input
            className="field !pr-10"
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {!isLogin && (
          <div className="relative">
            <input
              className="field !pr-10"
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        )}
        <button type="submit" className="btn-primary w-full" disabled={response}>
          {response
            ? isLogin
              ? "Signing in…"
              : "Creating…"
            : isLogin
            ? "Sign in"
            : "Register"}
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-ink-muted">
        <button
          type="button"
          className="text-accent hover:underline"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot password?
        </button>
      </p>
      <p className="mt-2 text-sm text-center text-ink-muted">
        {isLogin ? "No account?" : "Already registered?"}{" "}
        <button type="button" className="text-accent hover:underline" onClick={toggleForm}>
          {isLogin ? "Register" : "Sign in"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
