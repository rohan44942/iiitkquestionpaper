import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contextapi/userContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthForm = ({ baseUrl }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
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
  const { updateUser, setLoginClicked } = useContext(UserContext);

  const toggleForm = () => setIsLogin(!isLogin);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: !isLogin ? formData.fullName : undefined,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      // console.log(data);

      if (!response.ok) {
        if (data.message === "Email already in use") {
          throw new Error("A user with this email already exists.");
        }
        throw new Error(data.message || "An unexpected error occurred.");
      }

      setError("");

      if (isLogin) {
        setResponse(false);
        // alert("Login successful!");
        // updateUser(data.user);
        setLoginClicked(true);
      } else {
        alert("Registration successful!");
      }

      navigate("/login");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setIsLogin(false);
      setError(err.message);
    }
  };

  useEffect(() => {
    setError(""); // Clear error when switching forms
  }, [isLogin]);

  return (
    <div className="flex items-center justify-center h-full w-full sm:p-6  bg-light-cream">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border sm:p-6 p-1 border-gray-200">
        <h3 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Welcome to <span className="text-blue-500">IIIK Resources</span>
        </h3>
        {error && (
          <p className="text-rose-500 text-center text-sm mb-3">{error}</p>
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
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
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
            value={
              isLogin
                ? response
                  ? "Logging in..."
                  : "Login"
                : response
                ? "Registering..."
                : "Register"
            }
            disabled={response}
          />
        </form>
        <p className="mt-3 text-sm text-center text-gray-500">
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </p>
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
