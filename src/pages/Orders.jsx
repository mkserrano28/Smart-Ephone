import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const formatPeso = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount ?? 0);

function Orders() {
  const [orders, setOrders] = useState([]);
  const [smartphones, setSmartphones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("To Pay");

  const tabs = [
    "To Pay",
    "To Ship",
    "To Receive",
    "Completed",
    "Cancelled",
    "Return Refund",
  ];

  useEffect(() => {
    fetchSmartphones();
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSmartphones = async () => {
    try {
      const response = await fetch("/smartphones.json");
      const data = await response.json();
      setSmartphones(data.smartphones);
    } catch (err) {
      console.error("Failed to load smartphone data:", err);
    }
  };

  const fetchOrders = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to view your orders.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();

      const updatedOrders = data.map((order) => {
        if (order.status === "Cancelled" || order.status === "Completed") return order;
        if (order.paymentMethod === "Cash on Delivery") return { ...order, status: "To Receive" };
        if (order.paymentStatus === "Paid") return { ...order, status: "To Ship" };
        return { ...order, status: "To Pay" };
      });

      setOrders(updatedOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Cancel request failed");

      alert("Order has been cancelled.");
      fetchOrders();
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleOrderReceived = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/received`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Order received request failed");

      alert("Thank you! Your order has been marked as received.");
      fetchOrders();
    } catch (error) {
      console.error("Failed to mark order as received:", error);
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (
            order.paymentMethod !== "Cash on Delivery" &&
            order.paymentStatus !== "Paid" &&
            order.status !== "Cancelled"
          ) {
            const createdAt = new Date(order.createdAt);
            const now = new Date();
            const timeDiff = now - createdAt;
            const hoursPassed = timeDiff / (1000 * 60 * 60);

            if (hoursPassed >= 24) {
              return { ...order, status: "Cancelled", cancelledDueToTimeout: true };
            }
          }
          return order;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => order.status === selectedTab);

  if (loading) return <p className="text-center">⏳ Loading orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="
      container mx-auto px-4 sm:px-6 lg:px-8 
      py-6 sm:py-10
     bg-white text-black dark:bg-gray-900 dark:text-white
      transition-colors duration-300"
    >
      <h2 className="text-2xl font-bold 
      mb-4 text-center mt-20">Your Orders</h2>
      <div className="flex justify-center 
      gap-3 border-b pb-3 mb-6 
      overflow-x-auto"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(tab)}
            className={`
              px-4 py-2
              rounded-full font-medium
              transition whitespace-nowrap
              ${selectedTab === tab
                ? "bg-yellow-200"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => {
            const createdAt = new Date(order.createdAt);
            const now = new Date();
            const timeLeft = 24 * 60 * 60 * 1000 - (now - createdAt);
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            return (
              <div className="
            bg-white dark:bg-gray-800
              p-4 sm:p-6 
              rounded-xl shadow-md 
              space-y-2 sm:space-y-3 
              text-sm sm:text-base">
                <h3 className="font-semibold text-lg">
                  Order ID: {order.orderId || order._id}
                </h3>

                <p>
                  Status: <span className={
                    order.status === "To Ship" || order.status === "To Receive"
                      ? "text-yellow-600 font-semibold"
                      : "text-yellow-500"
                  }>
                    {order.status}
                  </span>
                </p>

                <p>
                  Total: {formatPeso(order.totalAmount ?? order.total ?? 0)}
                </p>

                {selectedTab === "To Pay" && timeLeft > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    ⏳ Time left to pay: {hours}h {minutes}m {seconds}s
                  </p>
                )}

                <div className="mt-2 flex gap-2">
                  {selectedTab === "To Pay" && (
                    <>
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="
                          px-3 py-1 bg-red-600 text-white
                          rounded hover:bg-red-700
                        "
                      >
                        Cancel Order
                      </button>
                      {order.paymentUrl && (
                        <button
                          onClick={() => window.open(order.paymentUrl, "_blank")}
                          className="
                            px-3 py-1 bg-blue-600 text-white
                            rounded hover:bg-blue-700
                          "
                        >
                          💳 Pay Now
                        </button>
                      )}
                    </>
                  )}

                  {selectedTab !== "To Pay" &&
                    selectedTab !== "Cancelled" &&
                    selectedTab !== "Completed" && (
                      <>
                        <button
                          onClick={() => handleOrderReceived(order._id)}
                          className="
                          text-sm sm:text-base
                          px-4 py-1.5 sm:px-6 sm:py-2
                          rounded-full font-semibold
                        text-white bg-gradient-to-r from-yellow-400 to-yellow-500
                          shadow-lg hover:shadow-xl transition-all duration-300 hover:brightness-110"
                        >
                          Order Received
                        </button>


                        <button
                          onClick={() => handleCancel(order._id)}
                          className="
                            px-5 py-2 rounded-full font-semibold
                            text-white bg-gradient-to-r
                            from-yellow-500 to-yellow-600
                            shadow-lg hover:shadow-xl
                            transition-all duration-300
                            hover:brightness-110
                          "
                        >
                          Cancel Order
                        </button>
                      </>
                    )}
                </div>

                {order.cartItems?.map((item, index) => {
                  if (!item?.model) return null;

                  const fullProduct = smartphones.find(
                    (phone) =>
                      phone?.model?.toLowerCase() ===
                      item?.model?.toLowerCase()
                  );

                  return (
                    <div
                      key={index}
                      className="
                        flex gap-4 items-start
                        rounded-lg p-3 shadow-md mt-4
                        bg-gray-100 dark:bg-gray-800
                      "
                    >
                      <img
                        src={Array.isArray(item.image) ? item.image[0] : item.image}
                        alt={item.model}
                        className="
                          w-16 h-16 object-contain
                          rounded-lg mr-4
                        "
                        onError={(e) =>
                          (e.target.src = "/images/placeholder.jpg")
                        }
                      />

                      <div>
                        <h4 className="font-semibold text-xl">
                          {fullProduct?.brand || "Unknown"} {item.model}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Display: {fullProduct?.specifications?.display || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          RAM: {fullProduct?.specifications?.ram || "N/A"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Storage: {item.selectedStorage || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Camera: {fullProduct?.specifications?.camera?.rear || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Battery: {fullProduct?.specifications?.battery || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Release Date: {fullProduct?.release_date || "N/A"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Color: <span
                            className="inline-block w-4 h-4 rounded-full align-middle ml-1"
                            style={{ backgroundColor: item.selectedColor || "#ccc" }}
                          ></span>
                        </p>
                        <p className="text-sm font-medium mt-2">
                          Quantity: {item.quantity} × Price: {formatPeso(item.price)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;