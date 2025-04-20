import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import updateCart from "./updateCart";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Authpage({ isOpen = true, onClose = () => {} }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  if (typeof isOpen === "boolean" && !isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed!");
      }

      alert("Registration successful! You may now log in.");
      setIsLogin(true); // Automatically switch to login
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed!");

      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("username", data.user.username);
      updateCart(data.cart || []);

      onClose(); // Close modal
      navigate("/");
      window.location.reload();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-900 transition duration-300 ease-in-out">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-red-500 z-10"
        >
          &times;
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-yellow-900 to-indigo-500 text-white text-center py-6 px-4">
          <img src="/images/ephone-logo.webp" alt="Logo" className="w-10 mx-auto mb-2 rounded-full" />
          <h2 className="text-xl font-semibold">
            {isLogin ? "USER LOGIN" : "CREATE ACCOUNT"}
          </h2>
          <p className="text-sm">{isLogin ? "Welcome back" : "Register and Shop now"}</p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          {/* Toggle Buttons */}
          <div className="flex justify-center mb-4 gap-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 text-sm font-semibold rounded ${
                isLogin
                  ? "text-black dark:text-white border-b-2 border-yellow-500"
                  : "text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 text-sm font-semibold rounded ${
                !isLogin
                  ? "text-black dark:text-white border-b-2 border-yellow-500"
                  : "text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Feedback */}
          {message && (
            <p className="text-center text-sm text-red-500 mb-3">{message}</p>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border rounded text-black dark:text-white"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border rounded text-black dark:text-white"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-medium transition duration-300"
              >
                LOGIN
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border rounded text-black dark:text-white"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border rounded text-black dark:text-white"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border rounded text-black dark:text-white"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-medium transition duration-300"
              >
                REGISTER
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
