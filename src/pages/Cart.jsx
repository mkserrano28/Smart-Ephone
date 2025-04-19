import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
            className={`min-h-screen px-4 pt-6 pb-24 transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
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

            {/* Updated 2-column grid layout like Shopee */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredSmartphones.map((phone) => (
                    <div
                        key={phone.id}
                        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                    >
                        <Link to={`/cartdetails/${phone.id}`}>
                        <div className="h-40 sm:h-32 w-full flex items-center justify-center overflow-hidden">
                                <img
                                    src={Array.isArray(phone.image) ? phone.image[0] : phone.image}
                                    alt={phone.model}
                                    className="object-contain w-28 h-28"
                                />
                            </div>
                            <div className="px-2 pb-3">
                                <h3 className="text-sm font-semibold line-clamp-2">{phone.model}</h3>
                                <p className="font-bold text-sm">
                                    {new Intl.NumberFormat("en-PH", {
                                        style: "currency",
                                        currency: "PHP",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(phone.price)}
                                </p>
                            </div>
                        </Link>

                        {/* Add to Cart Button */}
                        <Link
                            to={`/cartdetails/${phone.id}`}
                            className="absolute top-2 left-2 bg-yellow-400 hover:bg-yellow-500 text-white p-1 rounded-full shadow"
                        >
                            <ShoppingCart size={16} />
                        </Link>

                        {/* Favorite Button */}
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                            <Heart size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cart;
