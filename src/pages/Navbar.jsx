import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Moon,
  Sun,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Authpage from "./Authpage";
import { motion } from "framer-motion";

function Navbar({
  cartItems,
  darkMode,
  setDarkMode,
  searchTerm,
  setSearchTerm,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");

    if (storedUserId && storedUsername) {
      setUser({ _id: storedUserId, username: storedUsername });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setUser(null);
    setDropdownOpen(false);
    window.location.reload();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== "/products") {
      navigate("/products");
    }
  };

  return (
    <div
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300 
        ${isScrolled ? "bg-opacity-90 shadow-lg" : ""}
        ${darkMode ? "dark bg-gray-900 text-white" : "bg-slate-800 text-black"}
      `}
    >
      <div className="
      container mx-auto 
      flex flex-wrap 
      items-center px-4 py-3 
      sm:py-4 md:py-5 lg:py-6">
        {/* Left Section: Logo + Navigation */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="flex items-center space-x-2 min-w-fit"
          >
            <img
              src="/images/ephone-logo.webp"
              alt="Ephone Logo"
              className="h-8 w-auto rounded-4xl"
            />
            <span
              className={`
                text-lg sm:text-xl font-poppins font-semibold 
                ${darkMode ? "text-yellow-400" : "text-slate-200"}
              `}
            >
              Smart-Ephone
            </span>
          </Link>

          {/* Search (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:block">
            <input
              type="text"
              value={searchTerm}
              placeholder="Search products..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-52 md:w-64 px-3 py-1.5
                rounded-md border border-gray-300
                dark:border-gray-600 bg-white dark:bg-gray-700
                text-sm text-black dark:text-white
                placeholder-gray-400 dark:placeholder-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </form>

          {/* Nav Links (Desktop) */}
          <ul className="hidden lg:flex space-x-6 text-gray-200">
            <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
            <li><Link to="#" className="hover:text-yellow-400">About</Link></li>
            <li><Link to="/products" className="hover:text-yellow-400">Products</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400">Contact Me</Link></li>
          </ul>
        </div>

        {/* Right Section: Icons + Auth */}
        <div className="flex items-center space-x-4 lg:space-x-6 ml-auto mt-4 sm:mt-0">
          {/* Mobile Search */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="lg:hidden text-white"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Dark Mode */}
          {/* Dark Mode (Large screens only) */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="hidden lg:inline-block text-slate-200 dark:text-white"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>


          {/* Cart */}
          <Link to="/checkout" className="relative cursor-pointer">
            <ShoppingCart
              id="cart-icon"
              size={26}
              className="text-slate-200 dark:text-white"
            />
            {cartItems.length > 0 && (
              <span
                className="absolute -top-2 -right-2 
                  bg-red-500 text-white text-xs font-bold 
                  rounded-full px-2 py-0.5"
              >
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>

          {/* Auth / Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex text-white  items-center space-x-2 focus:outline-none"
              >
                <User size={22} />
                <span className="text-white 
                hidden sm:inline-block">
                  {user.username}
                </span>
                <ChevronDown size={18} />
              </button>

              {dropdownOpen && (
                <div className="
                absolute right-0 mt-2 w-48 
               text-black dark:text-white 
               bg-white dark:bg-gray-800 
                shadow-lg rounded-lg">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="
                      block px-4 py-2 text-black dark:text-white
                     hover:bg-gray-100
                      dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Order History
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}

            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="
              flex items-center gap-1
            text-white dark:text-white 
              px-4 py-1 rounded-lg font-medium 
            hover:bg-yellow-400 dark:hover:bg-yellow-500"
            >
              <User size={18} className="inline-block" />
              <span className="font-poppins">Login</span>
            </button>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden ${darkMode ? "text-white" : "text-white"}`}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      {showMobileSearch && (
        <div className="lg:hidden px-6 py-2 bg-gray-100 dark:bg-gray-800">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full px-4 py-2 rounded-md border 
                border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-black dark:text-white 
                placeholder-gray-400 dark:placeholder-gray-300
              "
            />
          </form>
        </div>
      )}

      {/* Mobile Menu List */}
      {menuOpen && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          {/* Slide + fade animated dropdown */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.2 }}
            className="
        lg:hidden absolute top-16 right-4 w-60
        bg-white dark:bg-gray-800 text-black dark:text-white 
        rounded-xl shadow-lg px-4 py-4 space-y-3 z-50
      "
          >
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Contact Me
                </Link>
              </li>
            </ul>

            {/* Dark mode toggle */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded 
            bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span className="text-sm">
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}



      {/* Auth Modal */}
      <Authpage isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default Navbar;
