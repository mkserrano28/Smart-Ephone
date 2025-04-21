import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Truck,
} from "lucide-react";
import { useSwipeable } from "react-swipeable";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Checkout({ cartItems = [], setCartItems, darkMode, updateCartQuantity }) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showDropdown, setShowDropdown] = useState(false);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal >= 79.99 ? 0 : 5.0;
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
    if (!userId) return alert("❌ Please log in to proceed with checkout.");

    try {
      let response, data;

      if (paymentMethod === "cod") {
        response = await fetch(`${API_BASE_URL}/checkout/cod`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, cartItems, totalAmount }),
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message);

        alert("🎉 Order placed! You can now track it under the 'To Receive' tab.");
        localStorage.removeItem(`cart_${userId}`);
        setCartItems([]);
        navigate("/orders");
      } else {
        response = await fetch(`${API_BASE_URL}/checkout/paymongo-link`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, cartItems, totalAmount }),
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message);

        localStorage.removeItem(`cart_${userId}`);
        setCartItems([]);
        navigate("/orders");
        window.open(data.paymentUrl, "_blank");
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
    <div className={`
      min-h-screen pt-24 px-4 sm:px-6
      transition-all duration-300
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}
    `}>
      <div className="container mx-auto max-w-6xl p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">🛒 YOUR CART</h2>
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Your cart is empty.
          </p>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3 space-y-4">
              {cartItems.map((item) => {
                const swipeHandlers = useSwipeable({
                  onSwipedLeft: () => handleRemoveItem(item.id),
                  delta: 50,
                  preventScrollOnSwipe: true,
                  trackTouch: true,
                });

                return (
                  <div key={item.id} {...swipeHandlers} className="relative group">
                    <div className="absolute inset-0 flex items-center justify-end pr-6 bg-red-600 text-white font-bold rounded-xl z-0">
                      Delete
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex gap-4 items-start sm:items-center z-10 relative transition-transform duration-200">
                      <img
                        src={Array.isArray(item.image) ? item.image[0] : item.image}
                        alt={item.model}
                        className="w-20 h-20 object-contain rounded-lg"
                        onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="text-base font-semibold">{item.model}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          Color: {item.selectedColor || 'N/A'} | Storage: {item.selectedStorage || 'N/A'}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">FREE SHIPPING</span>
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full">Best Price</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between gap-2 ml-auto">
                        <div className="text-right">
                          <p className="text-pink-600 font-bold text-lg">{formatPeso(item.price)}</p>
                          <p className="line-through text-gray-400 text-sm">{formatPeso(item.price * 1.5)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCartQuantity(item.id, "decrease")} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">-</button>
                          <span className="text-base">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, "increase")} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">+</button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className={`
                           mt-2 sm:mt-0 text-sm font-semibold
                           px-3 py-1 rounded
                           ${darkMode
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-red-600 text-white hover:bg-red-700"}
                           `}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-bold border-b pb-2">CART TOTALS</h3>
              <div className="flex justify-between text-lg py-3">
                <span>Subtotal:</span>
                <span>{formatPeso(subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg pb-3">
                <span>Shipping:</span>
                <span className="text-yellow-500">
                  {shipping === 0 ? "FREE" : formatPeso(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold py-3 border-t">
                <span>Total:</span>
                <span>{formatPeso(totalAmount)}</span>
              </div>

              <h3 className="text-lg font-bold mt-4">Choose Payment Method</h3>
              <div className="relative mt-2">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="w-full px-3 py-2 flex items-center justify-between text-sm border rounded-md shadow-sm bg-white dark:bg-gray-700 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    {paymentMethod === "cod" ? <Truck size={14} /> : <CreditCard size={14} />}
                    {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment (GCash)"}
                  </span>
                  {showDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 border rounded-md shadow-md bg-white dark:bg-gray-800">
                    {["cod", "gcash"].map((method) => (
                      <button
                        key={method}
                        onClick={() => {
                          setPaymentMethod(method);
                          setShowDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {method === "cod" ? <Truck size={14} /> : <CreditCard size={14} />}
                        {method === "cod" ? "Cash on Delivery" : "Online Payment (GCash)"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                className={`mt-6 py-2 px-6 text-sm font-semibold rounded shadow-md transition-all ${darkMode ? "bg-yellow-300 text-black hover:bg-yellow-400" : "bg-yellow-500 text-white hover:bg-yellow-600"}`}
              >
                {paymentMethod === "gcash" ? "Pay Now" : "Confirm Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
