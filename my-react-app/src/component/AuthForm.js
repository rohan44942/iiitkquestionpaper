import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextapi/userContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthForm = ({ baseUrl }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility toggle
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Confirm password visibility toggle
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // Error state for validation or server errors
  const navigate = useNavigate();
  const { updateUser, setLoginClicked } = useContext(UserContext);

  const toggleForm = () => setIsLogin(!isLogin);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
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

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include", // Include cookies for session management
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: !isLogin ? formData.fullName : undefined, // Only send fullName for registration
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      setError(""); // Reset error state

      // After login/registration success, update the user context
      if (isLogin) {
        alert("Login successful!");
        // You may want to handle storing the user information and authentication status
        updateUser(data.user); // Assuming 'data.user' is returned after login
        setLoginClicked(true);
      } else {
        alert("Registration successful!");
      }

      navigate("/");
      // Clear form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Clear error when switching between forms
    setError("");
  }, [isLogin]);

  return (
    <div className="flex items-center justify-center h-full w-full p-6 bg-light-cream">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Welcome to <span className="text-blue-500">IIIK Resources</span>
        </h3>
        {error && (
          <p className="text-red-500 text-center text-sm mb-3">{error}</p>
        )}
        <form autoComplete="off" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                className="bg-zinc-100 block w-full px-4 py-3 border border-zinc-200 rounded-md mb-3"
                type="text"
                placeholder="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </>
          )}
          <input
            className="bg-zinc-100 block w-full px-4 py-3 border border-zinc-200 rounded-md mb-3"
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={(e) => {
              return setFormData({ ...formData, email: e.target.value });
            }}
          />

          {/* Password Input */}
          <div className="relative mb-3">
            <input
              className="bg-zinc-100 block w-full px-4 py-3 border border-zinc-200 rounded-md"
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {!isLogin && (
            <div className="relative mb-3">
              <input
                className="bg-zinc-100 block w-full px-4 py-3 border border-zinc-200 rounded-md"
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
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={toggleConfirmPasswordVisibility}
              >
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}

          <input
            className="w-full bg-blue-500 text-white px-5 py-3 rounded-full cursor-pointer"
            type="submit"
            value={isLogin ? "Login" : "Register"}
          />
        </form>
        <p className="mt-3 text-sm text-center text-gray-500">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span className="text-blue-500 cursor-pointer" onClick={toggleForm}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;