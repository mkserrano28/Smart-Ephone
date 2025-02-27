import React, { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Replace with your deployed API Gateway endpoint
  const API_BASE_URL = "https://your-api-gateway-url/prod";

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("Registering...");

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Registration successful! Please login.");
        setIsLogin(true); // Switch to login mode
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error: Unable to register.");
    }
  };

  // Handle Login (To be implemented with authentication)
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    // TODO: Integrate with authentication API (Cognito / Custom Auth)
    setTimeout(() => {
      setMessage("✅ Login successful!");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-sm md:max-w-4xl md:h-[500px]">
        
        {/* Left Side Welcome Message (Only for Desktop) */}
        <div className="hidden md:flex w-1/2 h-full bg-slate-700 flex-col justify-center items-center p-6 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Welcome to Ephone Online Shopping</h2>
          <p className="text-lg">If you don't have an account, register now and enjoy a seamless shopping experience.</p>
        </div>

        {/* Right Side Auth Form */}
        <div className="w-full md:w-1/2 p-8 bg-white text-gray-900">
          <div className="flex justify-center mb-6 border-b pb-2 border-gray-300">
            <button
              className={`px-4 py-2 text-lg font-medium focus:outline-none transition-colors duration-300 ${
                isLogin ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-900"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 text-lg font-medium focus:outline-none transition-colors duration-300 ${
                !isLogin ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-900"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {/* Display API Response Messages */}
          {message && <p className="text-center text-sm text-red-600 mb-4">{message}</p>}

          {isLogin ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-slate-500 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Login
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-100"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-slate-500 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
