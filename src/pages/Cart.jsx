import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function Cart({ addToCart, darkMode }) {
    const [smartphones, setSmartphones] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetch("/smartphones.json")
            .then(response => response.json())
            .then(data => setSmartphones(data.smartphones))  // ✅ Use actual IDs from JSON
            .catch(error => console.error("Error loading smartphones:", error));
    }, []);

    const categories = ["All", "Apple", "Samsung", "Google", "Xiaomi", "OnePlus"];

    const filteredSmartphones =
        selectedCategory === "All"
            ? smartphones
            : smartphones.filter((phone) => phone.brand === selectedCategory);

    return (
        <div className={`min-h-screen p-5 transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <div className="mb-6">
                <h2 className="text-lg font-bold mb-3">Category</h2>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded-full font-medium transition ${
                                selectedCategory === category
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
                            }`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filteredSmartphones.map((phone) => (
                    <Link 
                        to={`/cartdetails/${phone.id}`}   // ✅ Use actual ID from JSON
                        key={phone.id} 
                        className="relative bg-slate-100 dark:bg-gray-800 shadow-lg rounded-xl p-4 
                        transition-transform duration-500 ease-in-out transform 
                        hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
                    >
                        <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                            <Heart size={14} />
                        </button>

                        <div className="h-32 w-full flex items-center justify-center overflow-hidden rounded-lg group">
                            <img 
                                src={phone.image} 
                                alt={phone.model} 
                                className="w-28 h-28 object-contain transition-transform duration-500 ease-in-out group-hover:scale-125"
                            />
                        </div>

                        <h3 className="font-semibold mt-2 text-slate-900 dark:text-white text-center text-sm">{phone.model}</h3>
                        <p className="text-gray-500 dark:text-gray-300 text-xs text-center">₱{phone.price.toFixed(2)}</p>

                        <button
                            className="absolute bottom-3 right-3 bg-slate-500 hover:bg-blue-700 text-white p-2 rounded-full transition-all shadow-md"
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(phone);
                            }}
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Cart;
