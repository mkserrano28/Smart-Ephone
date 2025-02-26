import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function CartDetails({ addToCart, darkMode }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch("/smartphones.json")
            .then(response => response.json())
            .then(data => {
                const phone = data.smartphones.find((p) => p.id.toString() === id);
                setProduct(phone);
            })
            .catch(error => console.error("Error fetching product details:", error));
    }, [id]);

    if (!product) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className={`min-h-screen flex justify-center items-center p-3 md:p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <div className={`shadow-lg rounded-lg p-3 md:p-6 lg:p-8 flex flex-col md:flex-row max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-4xl w-full overflow-hidden ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                
                {/* Product Image - Display on Top for Mobile, Side for Desktop */}
                <div className="md:hidden flex justify-center items-center mb-6">
                    <img 
                        src={product.image} 
                        alt={product.model} 
                        className="w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 object-contain mx-auto rounded-lg shadow-md"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }} 
                    />
                </div>

                <div className="flex flex-col md:flex-row w-full">
                    {/* Left Section - Product Details */}
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-500 mb-2">New</p>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">{product.model}</h2>
                        <p className={`text-base md:text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-600'}`}>{product.brand}</p>
                        <p className="text-lg md:text-xl lg:text-2xl font-semibold">₱{product.price.toFixed(2)} {product.currency}</p>

                        <div className="mt-4">
                            <h3 className="text-md md:text-lg font-semibold mb-2">Specifications:</h3>
                            <ul className="text-sm">
                                <li><strong>Display:</strong> {product.specifications.display}</li>
                                <li><strong>Processor:</strong> {product.specifications.processor}</li>
                                <li><strong>RAM:</strong> {product.specifications.ram}</li>
                                <li><strong>Storage:</strong> {product.specifications.storage.join(" / ")}</li>
                                <li><strong>Rear Camera:</strong> {product.specifications.camera.rear}</li>
                                <li><strong>Front Camera:</strong> {product.specifications.camera.front}</li>
                                <li><strong>Battery:</strong> {product.specifications.battery}</li>
                                <li><strong>Operating System:</strong> {product.specifications.os}</li>
                            </ul>
                        </div>

                        {/* Delivery Info */}
                        <div className="mt-6">
                            <p className="text-sm font-semibold">Delivery:</p>
                            <p className={`text-sm ${product.availability.in_stock ? "text-green-500" : "text-red-500"}`}>
                                {product.availability.in_stock ? "In Stock" : "Out of Stock"}
                            </p>
                            <p className="text-sm">Free Shipping</p>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex flex-col md:flex-row gap-4">
                            <button 
                                onClick={() => addToCart(product)}
                                className="bg-slate-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition w-full sm:w-3/4 md:w-auto"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    {/* Right Section - Product Image (Only for Desktop View) */}
                    <div className="hidden md:flex flex-1 justify-center items-center">
                        <img 
                            src={product.image} 
                            alt={product.model} 
                            className="w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain mx-auto rounded-lg shadow-md"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartDetails;