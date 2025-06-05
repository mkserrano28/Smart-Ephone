import React, { useEffect, useState } from "react";

export default function userProfile() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [address, setAddress] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://your-api.com/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setAddress(data.profile?.address || "");
        } else {
          console.error("❌", data.message);
        }
      } catch (err) {
        console.error("🔥 Error loading user:", err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  const handlePasswordChange = async () => {
    try {
      const res = await fetch("https://your-api.com/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Password updated!");
        setNewPassword("");
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      console.error("❌ Error changing password:", err);
    }
  };

  const handleAddressUpdate = async () => {
    try {
      const res = await fetch("https://your-api.com/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile: {
            address,
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Address updated!");
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      console.error("❌ Error updating address:", err);
    }
  };

  if (!user) {
    return <div className="text-center mt-10">🔄 Loading Profile...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-6">👤 Profile Settings</h2>

      <div className="mb-4">
        <label className="block font-medium">Username:</label>
        <p className="p-2 bg-gray-100 dark:bg-gray-700 rounded">{user.username}</p>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
        />
        <button
          onClick={handleAddressUpdate}
          className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Save Address
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Change Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
        />
        <button
          onClick={handlePasswordChange}
          className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
