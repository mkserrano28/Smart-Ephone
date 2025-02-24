import React from "react";
import { ShoppingCart, Moon, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar({ cartItems, darkMode, setDarkMode }) {
    return (
        <div className={`${darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"} transition-all`}>
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <Link to="/" className="text-xl font-bold text-red-500">E-SmartPhone</Link>

                <ul className="hidden md:flex space-x-6 font-medium">
                    <li><Link to="#" className="hover:text-gray-600">Home</Link></li>
                    <li><Link to="#" className="hover:text-gray-600">About</Link></li>
                    <li><Link to="#" className="hover:text-gray-600">Products</Link></li>
                    <li><Link to="#" className="hover:text-gray-600">Contact Me</Link></li>
                </ul>

                <div className="flex items-center space-x-4">
                    <button onClick={() => setDarkMode(!darkMode)} className="text-gray-800 dark:text-white">
                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                    </button>

                    {/* Redirect to Checkout & Show Updated Cart Count */}
                    <Link to="/checkout" className="relative cursor-pointer">
                        <ShoppingCart size={26} className="text-gray-800 dark:text-white" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                {cartItems.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                        )}
                    </Link>

                    <Link to="/auth" className="flex items-center space-x-2 border border-gray-800 dark:border-white px-4 py-2 rounded-lg font-medium text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                        <User size={20} />
                        <span>Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
