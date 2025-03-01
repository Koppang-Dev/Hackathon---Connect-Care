"use client";
import React, { useState, useEffect } from "react";

// Layout that applies to all pages in (auth) folder
export default function AuthLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const nurseUser = localStorage.getItem("nurseUser");
    if (nurseUser) {
      setUser(JSON.parse(nurseUser));
    } else {
      // If no nurse user is found, redirect to the login page
      window.location.href = "/";
    }
  }, []);

  if (user === null) {
    // Return null or a spinner while loading user data
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("nurseUser");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Shared nurse header */}
      <header className="bg-blue-500 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10 shadow-md">
        <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Page content is rendered here */}
      <main className="flex-grow pt-20">{children}</main>
    </div>
  );
}
