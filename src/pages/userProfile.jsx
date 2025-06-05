// src/pages/UserProfile.jsx
import React from "react";

export default function UserProfile({ user, setUser, onSave }) {
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">👤 My Profile</h1>

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
        onClick={onSave}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        💾 Save Profile
      </button>
    </div>
  );
}
