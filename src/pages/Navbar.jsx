import React, { useState, useEffect } from "react";
import { ShoppingCart, Moon, Sun, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar({ cartItems, darkMode, setDarkMode }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Detect scrolling behavior
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-opacity-90 shadow-lg" : ""} ${darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}`}>
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo and Brand Name */}
                <Link to="/" className="flex items-center space-x-3">
                    <img src="/images/ephone-logo.webp" alt="Ephone Logo" className="h-8 w-auto rounded-4xl" />
                    <span className={`text-lg sm:text-xl font-bold ${darkMode ? "text-yellow-400" : "text-blue-700"}`}>
                       Smart-Ephone
                    </span>
                </Link>

                {/* Navigation Links - Always visible on desktop */}
                <ul className="hidden md:flex space-x-6 font-medium">
                    <li><Link to="#" className="hover:text-gray-600">Home</Link></li>
                    <li><Link to="#" className="hover:text-gray-600">About</Link></li>
                    <li><Link to="#" className="hover:text-gray-600">Products</Link></li>
                    <li><Link to="#" className="hover:text-gray-600">Contact Me</Link></li>
                </ul>

                {/* Right Side Icons: Dark Mode, Cart, Login */}
                <div className="flex items-center space-x-4 md:space-x-6">
                    {/* Dark Mode Toggle */}
                    <button 
                        onClick={() => setDarkMode(!darkMode)} 
                        className="text-gray-800 dark:text-white"
                    >
                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                    </button>

                    {/* Shopping Cart */}
                    <Link to="/checkout" className="relative cursor-pointer">
                        <ShoppingCart size={26} className="text-gray-800 dark:text-white" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                {cartItems.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                        )}
                    </Link>

                    {/* Login Button for Desktop */}
                    <Link
                        to="/auth"
                        className="border border-gray-800 dark:border-white px-4 py-1 rounded-lg font-medium text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        <User size={18} className="inline-block mr-1" />
                        Login
                    </Link>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden focus:outline-none">
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Collapsible Mobile Menu (Visible only on mobile) */}
            {menuOpen && (
                <div className="md:hidden bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-4 px-6">
                    {/* Navigation Links for Mobile */}
                    <ul className="flex flex-col space-y-4 items-center">
                        <li><Link to="#" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}>Home</Link></li>
                        <li><Link to="#" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}>About</Link></li>
                        <li><Link to="#" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}>Products</Link></li>
                        <li><Link to="#" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}>Contact Me</Link></li>
                    </ul>

                    {/* Login Button for Mobile */}
                    <div className="mt-6 flex justify-center">
                        <Link
                            to="/auth"
                            className="border border-gray-800 dark:border-white px-6 py-2 rounded-lg font-medium text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            onClick={() => setMenuOpen(false)}
                        >
                            <User size={20} className="inline-block mr-2" />
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
