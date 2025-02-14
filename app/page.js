"use client"; // Enables React hooks

import React, { useState } from "react";

export default function StolenCookieApp() {
  const [cookieData, setCookieData] = useState("");

  const handleSubmit = async () => {
    if (!cookieData.trim()) {
      alert("Please enter a cookie before submitting!");
      return;
    }

    try {
      const response = await fetch("/api/store-cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cookie: cookieData }),
      });

      if (response.ok) {
        alert("Cookie saved successfully!");
        setCookieData(""); // Clear input
      } else {
        alert("Failed to save the cookie.");
      }
    } catch (error) {
      console.error("Error submitting cookie:", error);
      alert("An error occurred while saving the cookie.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Stolen Cookie Logger</h1>
      
      <input
        className="w-96 p-2 border rounded-lg text-black"
        type="text"
        placeholder="Paste stolen cookie here..."
        value={cookieData}
        onChange={(e) => setCookieData(e.target.value)}
      />

      <button className="mt-4 bg-red-600 text-white p-2 rounded-lg" onClick={handleSubmit}>
        Submit Cookie
      </button>
    </div>
  );
}
