import React, { useEffect, useState } from "react";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem("token"); // 🔑 Get Token for Auth

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("http://localhost:5001/get-user/USER_ID", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                } else {
                    console.error("Error fetching user:", data.message);
                }
            } catch (error) {
                console.error("🔥 Error fetching user:", error);
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setOrders(data.orders);
                } else {
                    console.error("Error fetching orders:", data.message);
                }
            } catch (error) {
                console.error("🔥 Error fetching orders:", error);
            }
        };

        if (token) {
            fetchUserProfile();
            fetchOrders();
        }
    }, [token]);

    if (!user) {
        return <div className="text-center mt-5">🔄 Loading Profile...</div>;
    }

    return (
        <div className="container mx-auto mt-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold">👤 My Profile</h1>
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <h2 className="mt-4 text-2xl font-semibold">📦 My Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="mt-4">
                    {orders.map((order) => (
                        <li key={order._id} className="border p-3 rounded shadow mb-2">
                            Order #{order._id} - Status: <strong>{order.status}</strong> - Total: <strong>${order.totalPrice}</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Profile;
