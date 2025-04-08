import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import updateCart from "./updateCart"; // ✅ Import updateCart

//const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const API_BASE_URL = import.meta.env.VITE_API_URL;




export default function Authpage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  console.log("API URL:", API_BASE_URL);

  //  Handle Register Request
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log(`🛠️ Debug: Sending registration request to ${API_BASE_URL}/register`);

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(" Registration Failed:", errorData);
        throw new Error(errorData.message || "Registration failed!");
      }

      const data = await response.json();
      console.log(" Registration Successful:", data);

      alert("Registration Successful! Please log in.");

      // Switch to login form
      setIsLogin(true); //  Automatically switch to login form

    } catch (error) {
      console.error(" Registration Error:", error);
      setMessage(error.message);
    }
  };


  // Handle Login and Sync Cart
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
      console.log("Login API Response:", data);

      if (!response.ok) throw new Error(data.message || "Login failed!");

      alert("Login Successful!");

      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("username", data.user.username);

      // Load and Sync Cart
      const userCart = data.cart || [];
      console.log("Updating Cart in LocalStorage:", userCart);
      updateCart(userCart); // Sync to localStorage & MongoDB

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Login Error:", error);
      setMessage(error.message);
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-sm md:max-w-4xl md:h-[500px]">
        <div className="hidden md:flex w-1/2 h-full bg-slate-700 flex-col justify-center items-center p-6 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Welcome to Ephone Online Shopping123</h2>
          <p className="text-lg">If you don't have an account, register now and enjoy a seamless shopping experience.</p>
        </div>
        <div className="w-full md:w-1/2 p-8 bg-white text-gray-900">
          <div className="flex justify-center mb-6 border-b pb-2 border-gray-300">
            <button onClick={() => setIsLogin(true)} className={`px-4 py-2 text-lg font-medium ${isLogin ? "border-b-2 border-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
              Login
            </button>
            <button onClick={() => setIsLogin(false)} className={`px-4 py-2 text-lg font-medium ${!isLogin ? "border-b-2 border-gray-900" : "text-gray-500 hover:text-gray-900"}`}>
              Register
            </button>
          </div>

          {message && <p className="text-center text-md text-slate-600 mb-4">{message}</p>}

          {isLogin ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
              <button type="submit" className="w-full px-4 py-2 text-white bg-slate-500 rounded-lg hover:bg-gray-700">Login</button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
              <button type="submit" className="w-full px-4 py-2 text-white bg-slate-500 rounded-lg hover:bg-gray-700">Register</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
