// src/pages/userProfile.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5001/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
        else alert(data.message);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["fullName", "phone", "address", "bio"].includes(name)) {
      setUser((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: value,
        },
      }));
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5001/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (res.ok) alert("✅ Profile updated!");
      else alert("⚠️ " + data.message);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  if (!user) {
    return <div className="text-center mt-5">🔄 Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">👤 Edit Profile</h1>

      <label className="block mt-2">
        Username:
        <input
          type="text"
          name="username"
          value={user.username || ""}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-white text-black"
        />
      </label>

      <label className="block mt-2">
        Email:
        <input
          type="email"
          name="email"
          value={user.email || ""}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-white text-black"
        />
      </label>

      <label className="block mt-2">
        Full Name:
        <input
          type="text"
          name="fullName"
          value={user.profile?.fullName || ""}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-white text-black"
        />
      </label>

      <label className="block mt-2">
        Phone:
        <input
          type="text"
          name="phone"
          value={user.profile?.phone || ""}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-white text-black"
        />
      </label>

      <label className="block mt-2">
        Address:
        <input
          type="text"
          name="address"
          value={user.profile?.address || ""}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-white text-black"
        />
      </label>

      <label className="block mt-2">
        Bio:
        <textarea
          name="bio"
          value={user.profile?.bio || ""}
          onChange={handleChange}
          className="w-full mt-1 p-2 rounded bg-white text-black"
        />
      </label>

      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        💾 Save Profile
      </button>

      <Link to="/profile" className="mt-4 inline-block text-blue-500 underline">
        ← Back to Profile
      </Link>
    </div>
  );
}
