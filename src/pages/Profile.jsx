import React, { useEffect, useState } from "react";

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Profile({ darkMode }) {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.error("❌", data.message);
        }
      } catch (err) {
        console.error("🔥 Failed to fetch user:", err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  const handleChangePassword = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/change-password`, {
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
      console.error("Error updating password:", err);
    }
  };

  if (!user) {
    return <div className="text-center mt-20">🔄 Loading user...</div>;
  }

  return (
    <div className={`mt-28 p-6 rounded max-w-md mx-auto ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h1 className="text-2xl font-bold mb-4">👤 My Profile</h1>
      
      <div className="mb-4">
        <label className="font-medium">Username:</label>
        <p className="p-2 rounded bg-gray-100 dark:bg-gray-700">{user.username}</p>
      </div>

      <div className="mb-4">
        <label className="font-medium">Change Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-white text-black"
        />
        <button
          onClick={handleChangePassword}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

export default Profile;
