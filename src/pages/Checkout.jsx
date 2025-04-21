import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Truck,
} from "lucide-react";

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
    <div
      className={`
        min-h-screen p-5 mt-10
        transition-all duration-300
        ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}
      `}
    >
      <div className="container mx-auto max-w-6xl p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">🛒 YOUR CART</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Your cart is empty.
          </p>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cart Items */}
            <div
              className="
               w-full md:w-2/3
            bg-white dark:bg-gray-800
               p-6 rounded-lg shadow-md
               space-y-4"
            >

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="
        flex flex-col sm:flex-row justify-between items-center
        border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800
      "
                >
                  {/* Left: Product Info */}
                  <div className="flex items-center w-full sm:w-2/3">
                    <img
                      src={Array.isArray(item.image) ? item.image[0] : item.image}
                      alt={item.model}
                      onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                      className="w-16 h-16 object-contain rounded-lg mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{item.model}</h3>
                      <p className="text-sm text-gray-500">
                        Color: <span
                          className="inline-block w-4 h-4 rounded-full align-middle mx-1"
                          style={{ backgroundColor: item.selectedColor || '#ccc' }}
                        ></span>
                        | Storage: {item.selectedStorage || 'N/A'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          FREE SHIPPING
                        </span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Best Price
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price + Actions */}
                  <div className="mt-4 sm:mt-0 sm:text-right w-full sm:w-1/3 flex flex-col items-end gap-2">
                    <div className="text-lg font-bold text-pink-600">
                      {formatPeso(item.price * item.quantity)}
                    </div>
                    <div className="line-through text-sm text-gray-400">
                      {formatPeso(item.originalPrice || item.price * 1.5)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, 'decrease')}
                        className="px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 'increase')}
                        className="px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className={`
            mt-2 py-1 px-4 text-sm font-semibold rounded shadow-md transition-all
            ${darkMode
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-red-500 text-white hover:bg-red-600'}
          `}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>


            {/* Summary */}
            <div
              className="
                w-full md:w-1/3
                bg-white dark:bg-gray-800
                p-6 rounded-lg shadow-md
              "
            >
              <h3 className="text-xl font-bold border-b pb-2">CART TOTALS</h3>
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

              {/* Payment */}
              <h3 className="text-lg font-bold mt-4">Choose Payment Method</h3>
              <div className="relative mt-2">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="
                    w-full px-3 py-2
                    flex items-center justify-between
                    text-sm border rounded-md shadow-sm
                    bg-white dark:bg-gray-700 dark:text-white
                  "
                >
                  <span className="flex items-center gap-2">
                    {paymentMethod === "cod" ? <Truck size={14} /> : <CreditCard size={14} />}
                    {paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment (GCash)"}
                  </span>
                  {showDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showDropdown && (
                  <div
                    className="
                      absolute z-10 w-full mt-1
                      border rounded-md shadow-md
                      bg-white dark:bg-gray-800
                    "
                  >
                    {["cod", "gcash"].map((method) => (
                      <button
                        key={method}
                        onClick={() => {
                          setPaymentMethod(method);
                          setShowDropdown(false);
                        }}
                        className="
                          w-full px-3 py-2 text-left text-sm
                          flex items-center gap-2
                          hover:bg-gray-100 dark:hover:bg-gray-700
                        "
                      >
                        {method === "cod" ? <Truck size={14} /> : <CreditCard size={14} />}
                        {method === "cod"
                          ? "Cash on Delivery"
                          : "Online Payment (GCash)"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleCheckout}
                className={`
                  mt-6 py-2 px-6 text-sm font-semibold rounded shadow-md
                  transition-all
                  ${darkMode
                    ? "bg-yellow-300 text-black hover:bg-yellow-400"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }
                `}
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
