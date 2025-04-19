import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Checkout({ cartItems = [], setCartItems, darkMode, updateCartQuantity }) {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = subtotal >= 79.99 ? 0 : 5.00;
    const totalAmount = subtotal + shipping;

    const handleRemoveItem = async (id) => {
        const userId = localStorage.getItem("userId");
        const updatedCart = cartItems.filter((item) => item.id !== id);

        setCartItems(updatedCart);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));

        try {
            await fetch(`${API_BASE_URL}/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, cartItems: updatedCart }),
            });
        } catch (error) {
            console.error("❌ Failed to update cart:", error);
        }
    };



    const handleCheckout = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("❌ Please log in to proceed with checkout.");
            return;
        }

        try {
            let response;
            let data;

            if (paymentMethod === "cod") {
                response = await fetch(`${API_BASE_URL}/checkout/cod`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, cartItems, totalAmount }),
                });

                data = await response.json();
                if (!response.ok) throw new Error(data.message);

                alert("🎉 Order placed! You can now track it under the 'To Receive' tab.");

                // ✅ Clear cart from localStorage and state
                localStorage.removeItem(`cart_${userId}`);
                setCartItems([]);

                // ✅ Navigate to orders page
                navigate("/orders");

            } else if (paymentMethod === "gcash" || paymentMethod === "paymaya") {
                // ✅ PayMongo checkout
                response = await fetch(`${API_BASE_URL}/checkout/paymongo-link`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, cartItems, totalAmount }),
                });

                data = await response.json();
                if (!response.ok) throw new Error(data.message);

                // ✅ Clear cart
                localStorage.removeItem(`cart_${userId}`);
                setCartItems([]);

                // ✅ Navigate to orders and open PayMongo link
                navigate("/orders");
                window.open(data.paymentUrl, "_blank");
            } else {
                alert("❌ Please select a payment method.");
            }

        } catch (error) {
            alert("❌ Error: " + error.message);
        }
    };

    const formatPeso = (amount) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount ?? 0);



    return (
        <div className={`min-h-screen p-5 transition-all duration-300 mt-10 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <div className="container mx-auto max-w-6xl p-6">
                <h2 className="text-3xl font-bold mb-6 text-center">🛒 YOUR CART</h2>

                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-300">Your cart is empty.</p>
                ) : (
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Cart Items */}
                        <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left pb-2">Product</th>
                                        <th className="text-center pb-2">Price</th>
                                        <th className="text-center pb-2">Quantity</th>
                                        <th className="text-right pb-2">Subtotal</th>
                                        <th className="text-center pb-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="py-4 flex items-center">
                                                <img
                                                    src={Array.isArray(item.image) ? item.image[0] : item.image}
                                                    alt={item.model}
                                                    className="w-16 h-16 object-contain rounded-lg mr-4"
                                                    onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                                                />

                                                <div>
                                                    <h3 className="font-semibold">{item.model}</h3>
                                                    <p className="text-gray-500 text-sm">RAM: {item.specifications?.ram || 'N/A'}</p>
                                                    <p className="text-gray-500 text-sm">Storage: {item.selectedStorage || 'N/A'}</p>
                                                    <p className="text-gray-500 text-sm">
                                                        Color:{" "}
                                                        <span
                                                            className="inline-block w-4 h-4 rounded-full align-middle ml-1"
                                                            style={{ backgroundColor: item.selectedColor || "#ccc" }}
                                                        ></span>
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="text-center">{formatPeso(item.price)}</td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center">
                                                    <button className="px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded-md" onClick={() => updateCartQuantity(item.id, "decrease")}>-</button>
                                                    <span className="mx-2">{item.quantity}</span>
                                                    <button className="px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded-md" onClick={() => updateCartQuantity(item.id, "increase")}>+</button>
                                                </div>
                                            </td>
                                            <td className="text-right font-semibold">₱{(item.price * item.quantity).toFixed(2)}</td>
                                            <td className="text-center">
                                                <button onClick={() => handleRemoveItem(item.id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Order Summary */}
                        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold border-b pb-2">📦 CART TOTALS</h3>
                            <div className="flex justify-between text-lg py-3">
                                <span>Subtotal:</span><span>{formatPeso(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-lg pb-3">
                                <span>Shipping:</span><span className="text-green-500">{shipping === 0 ? "FREE" : formatPeso(shipping)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold py-3 border-t">
                                <span>Total:</span><span>{formatPeso(totalAmount)}</span>
                            </div>

                            <h3 className="text-lg font-bold mt-4">Choose Payment Method</h3>
                            <select
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full mt-2 p-2 border rounded-lg"
                            >
                                <option value="cod">Cash on Delivery</option>
                                <option value="gcash">Online Payment</option>
                            </select>

                            <button onClick={handleCheckout} className={`mt-6 py-3 px-6 font-semibold rounded shadow-md transition-all ${darkMode
                                    ? "bg-yellow-300 text-black hover:bg-yellow-400"
                                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                                }`}>
                                {paymentMethod === "gcash" || paymentMethod === "paymaya" ? "💳 Pay Now" : " Confirm Order"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Checkout;
