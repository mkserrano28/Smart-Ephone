import React from "react";

function Checkout({ cartItems = [], darkMode, updateCartQuantity }) {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = subtotal >= 79.99 ? 0 : 5.00; // Free shipping for orders above $79.99

    return (
        <div className={`min-h-screen p-5 transition-all duration-300 mt-10 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <div className="container mx-auto max-w-6xl p-6">
                <h2 className="text-3xl font-bold mb-6 text-center">YOUR CART</h2>

                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-300">Your cart is empty.</p>
                ) : (
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Side - Cart Items */}
                        <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left pb-2 w-1/2">Product</th>
                                        <th className="text-center pb-2 w-1/4 hidden sm:table-cell">Quantity</th>
                                        <th className="text-right pb-2 w-1/4 hidden sm:table-cell">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id} className="border-b flex flex-col sm:table-row">
                                            <td className="py-4 flex items-center sm:table-cell w-full sm:w-auto">
                                            <img src={item.image} alt={item.model} className="w-32 h-32 object-contain rounded-lg mr-6" />

                                                <div className="text-left">
                                                    <h3 className="font-semibold text-sm sm:text-base">{item.model}</h3>
                                                    <p className="text-gray-500 text-xs sm:text-sm">Brand: {item.brand}</p>
                                                    <p className="text-gray-500 text-xs sm:text-sm">RAM: {item.specifications.ram}</p>
                                                    <p className="text-gray-500 text-xs sm:text-sm">
                                                        Storage: {Array.isArray(item.specifications.storage)
                                                            ? item.specifications.storage.join(" / ")
                                                            : item.specifications.storage}
                                                    </p>

                                                    {/* Quantity Selector - Visible Only on Small Screens */}
                                                    <div className="sm:hidden flex items-center justify-start space-x-2 mt-2">
                                                        <button 
                                                            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md" 
                                                            onClick={() => updateCartQuantity(item.id, "decrease")}
                                                        >-</button>
                                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                        <button 
                                                            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md" 
                                                            onClick={() => updateCartQuantity(item.id, "increase")}
                                                        >+</button>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Quantity Column - Hidden on Small Screens */}
                                            <td className="text-center w-1/4 hidden sm:table-cell">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button 
                                                        className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md" 
                                                        onClick={() => updateCartQuantity(item.id, "decrease")}
                                                    >-</button>
                                                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                    <button 
                                                        className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-md" 
                                                        onClick={() => updateCartQuantity(item.id, "increase")}
                                                    >+</button>
                                                </div>
                                            </td>

                                            {/* Subtotal - Hidden on small screens, moved inside Price */}
                                            <td className="text-right w-1/4 hidden sm:table-cell font-semibold whitespace-nowrap">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </td>

                                            {/* Mobile Price & Subtotal Display */}
                                            <td className="sm:hidden text-left mt-2 text-gray-500">
                                                <p>Price: <span className="font-semibold">${item.price.toFixed(2)}</span></p>
                                                <p>Subtotal: <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span></p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Right Side - Order Summary */}
                        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold border-b pb-2">CART TOTALS</h3>
                            <div className="flex justify-between text-lg py-3">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg pb-3">
                                <span>Shipping:</span>
                                <span className="text-green-500">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold py-3 border-t">
                                <span>Total:</span>
                                <span>${(subtotal + shipping).toFixed(2)}</span>
                            </div>
                            <button className="w-full mt-4 bg-slate-500 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-300 transition">
                                ⚡ CHECKOUT
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Checkout;
