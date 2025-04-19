import React, { useState, useEffect } from "react";
import { ShoppingCart, Moon, Sun, User, Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar({ cartItems, darkMode, setDarkMode, searchTerm, setSearchTerm }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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

    return (
        <div
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-opacity-90 shadow-lg" : ""
                } ${darkMode ? "dark bg-gray-900 text-white" : "bg-slate-800 text-black"}`}
        >
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Left: Logo + Search */}
                <div className="flex items-center gap-6 flex-wrap">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 min-w-fit">
                        <img src="/images/ephone-logo.webp" alt="Ephone Logo" className="h-8 w-auto rounded-4xl" />
                        <span className={`text-lg sm:text-xl font-poppins font-semibold ${darkMode ? "text-yellow-400" : "text-slate-200"}`}>
                            Smart-Ephone
                        </span>
                    </Link>

                    {/* Search + Navigation */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="hidden sm:block">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-52 md:w-64 px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        {/* Navigation Links */}
                        <ul className="hidden md:flex space-x-6 text-gray-200">
                            <li><Link to="/" className="hover:text-yellow-400 transition-colors duration-200">Home</Link></li>
                            <li><Link to="#" className="hover:text-yellow-400 transition-colors duration-200">About</Link></li>
                            <li><Link to="/products" className="hover:text-yellow-400 transition-colors duration-200">Products</Link></li>
                            <li><Link to="/contact" className="hover:text-yellow-400 transition-colors duration-200">Contact Me</Link></li>
                        </ul>
                    </div>
                </div>


                {/* Right: Icons & User */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    {/* Dark Mode Toggle */}
                    <button onClick={() => setDarkMode(!darkMode)} className="text-slate-200 dark:text-white">
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
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                {cartItems.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                        )}
                    </Link>

                    {/* User */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <User size={22} className="text-white dark:text-white" />
                                <span className="font-medium font-poppins text-white dark:text-white">
                                    {user.username}
                                </span>
                                <ChevronDown size={18} className="text-white dark:text-white" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 font-poppins bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                                    <Link
                                        to="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/orders"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Order History
                                    </Link>
                                    <Link
                                        to="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
                        <Link
                            to="/auth"
                            className="hidden sm:block dark:border-white px-4 py-1 rounded-lg font-medium text-slate-200 dark:text-slate-200 hover:bg-slate-400 dark:hover:bg-gray-700 transition"
                        >
                            <User size={18} className="inline-block mr-1" />
                            Login
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`md:hidden focus:outline-none ${darkMode ? "text-white" : "text-white"}`}
                    >
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-4 px-6 space-y-4">
                    {/* Mobile Search */}
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                    />

                    {/* Mobile Links */}
                    <ul className="flex flex-col space-y-4 items-center">
                        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                        <li><Link to="#" onClick={() => setMenuOpen(false)}>About</Link></li>
                        <li><Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link></li>
                        <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Me</Link></li>
                        <li>      <Link
                            to="/auth"
                            onClick={() => setMenuOpen(false)}
                            className="block w-full text-center px-4 py-2 rounded-md border border-gray-300 dark:border-white text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-gray-700 transition"
                        >
                            <User size={18} className="inline-block mr-1" />
                            Login
                        </Link></li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Navbar;
