import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  if (!user) {
    return <div className="text-center mt-5">🔄 Loading...</div>;
  }

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return `${name[0]}**********${name.slice(-1)}@${domain}`;
  };

  const maskPhone = (phone) => {
    return phone.length >= 2 ? "*****" + phone.slice(-2) : "*****";
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4 text-center">Account & Security</h1>

      <ul className="divide-y divide-gray-300 dark:divide-gray-700">
        <Item label="My Profile" onClick={() => navigate("/profile")} />
        <Item label="Username" value={user.username} />
        <Item label="Phone" value={maskPhone(user.profile?.phone || "")} />
        <Item label="Email" value={maskEmail(user.email)} />
        <Item label="Social Media Accounts" onClick={() => alert("Coming soon")} />
        <Item label="Change Password" onClick={() => alert("Redirect to password change")} />
        <ToggleItem label="Face ID Authentication" enabled={true} />
        <Item label="Check Account Activity" onClick={() => alert("View activity")} />
        <Item label="Manage Login Device" showAlertDot onClick={() => alert("View devices")} />
      </ul>
    </div>
  );
}

function Item({ label, value, onClick, showAlertDot }) {
  return (
    <li
      className="flex justify-between items-center py-3 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <span>{label}</span>
        {showAlertDot && <span className="ml-2 h-2 w-2 bg-red-500 rounded-full" />}
      </div>
      <div className="flex items-center text-gray-500">
        {value && <span className="mr-2">{value}</span>}
        <span className="text-xl">›</span>
      </div>
    </li>
  );
}

function ToggleItem({ label, enabled }) {
  return (
    <li className="flex justify-between items-center py-3">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={enabled}
        readOnly
        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
      />
    </li>
  );
}
