import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

function Cart({ darkMode, handleAddToCart, searchTerm = "" }) {
    const [smartphones, setSmartphones] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetch("/smartphones.json")
            .then((response) => response.json())
            .then((data) => setSmartphones(data.smartphones))
            .catch((error) => console.error("❌ Error loading smartphones:", error));
    }, []);

    const categories = ["All", "Apple", "Samsung", "Google", "Xiaomi", "OnePlus"];

    const filteredSmartphones = smartphones.filter((phone) => {
        const model = phone.model?.toLowerCase() || "";
        const brand = phone.brand?.toLowerCase() || "";

        const matchesCategory =
            selectedCategory === "All" || brand === selectedCategory.toLowerCase();

        const matchesSearch =
            model.includes(searchTerm.toLowerCase()) ||
            brand.includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });



    return (
        <div
            className={`min-h-screen p-20 transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
                }`}
        >
            <div className="mb-6">
                <h2 className="text-lg font-bold mb-3">Category</h2>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded-full font-medium transition ${selectedCategory === category
                                ? "bg-yellow-300"
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
                    <div
                        key={phone.id}
                        className="relative bg-slate-100 dark:bg-gray-800 shadow-lg rounded-xl p-4 
              transition-transform duration-500 ease-in-out transform 
              hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
                    >
                        {/* Favorite Button */}
                        <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                            <Heart size={14} />
                        </button>

                        {/* Clickable section for details */}
                        <Link to={`/cartdetails/${phone.id}`} className="block">
                            <div className="h-32 w-full flex items-center justify-center overflow-hidden rounded-lg group">
                                <img
                                    src={Array.isArray(phone.image) ? phone.image[0] : phone.image}
                                    alt={phone.model}
                                    className="w-28 h-28 object-contain transition-transform duration-500 ease-in-out group-hover:scale-125"
                                />

                            </div>
                            <h3 className="font-semibold mt-2 text-slate-900 dark:text-white text-center text-sm">
                                {phone.model}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs text-center">
                                ₱{phone.price.toFixed(2)}
                            </p>
                        </Link>

                        {/* Add to Cart button */}
                        <Link
                            to={`/cartdetails/${phone.id}`}
                            className="absolute bottom-3 right-3 bg-slate-500 hover:bg-blue-700 text-white p-2 rounded-full transition-all shadow-md z-10"
                        >
                            <ShoppingCart size={18} />
                        </Link>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cart;
