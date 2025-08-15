import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f9ff",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#ff6600",
          color: "white",
          padding: "30px",
          borderRadius: "10px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ fontSize: "48px", margin: "0 0 20px 0" }}>
          🌊 CoastalConnect is WORKING! 🌊
        </h1>
        <p style={{ fontSize: "24px", margin: "0" }}>
          Success! The UI is now visible and rendering correctly.
        </p>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "20px" }}>
          ✅ System Status
        </h2>
        <ul style={{ listStyle: "none", padding: "0" }}>
          <li
            style={{
              padding: "10px",
              backgroundColor: "#22c55e",
              color: "white",
              margin: "5px 0",
              borderRadius: "5px",
            }}
          >
            ✓ React Components Loading
          </li>
          <li
            style={{
              padding: "10px",
              backgroundColor: "#22c55e",
              color: "white",
              margin: "5px 0",
              borderRadius: "5px",
            }}
          >
            ✓ CSS Styles Applied
          </li>
          <li
            style={{
              padding: "10px",
              backgroundColor: "#22c55e",
              color: "white",
              margin: "5px 0",
              borderRadius: "5px",
            }}
          >
            ✓ JavaScript Executing
          </li>
          <li
            style={{
              padding: "10px",
              backgroundColor: "#22c55e",
              color: "white",
              margin: "5px 0",
              borderRadius: "5px",
            }}
          >
            ✓ UI Rendering Successfully
          </li>
        </ul>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>🏨 Hotels</h3>
          <p style={{ margin: "0", fontSize: "18px" }}>
            45+ Properties Available
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#ef4444",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>🍽️ Restaurants</h3>
          <p style={{ margin: "0", fontSize: "18px" }}>78+ Dining Options</p>
        </div>
        <div
          style={{
            backgroundColor: "#10b981",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>🚗 Transport</h3>
          <p style={{ margin: "0", fontSize: "18px" }}>32+ Trusted Drivers</p>
        </div>
        <div
          style={{
            backgroundColor: "#8b5cf6",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>🎉 Events</h3>
          <p style={{ margin: "0", fontSize: "18px" }}>23+ Experiences</p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "20px",
          borderRadius: "8px",
          border: "2px solid #e2e8f0",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#374151", marginBottom: "15px" }}>
          🔧 Debug Information
        </h3>
        <p style={{ margin: "5px 0", color: "#6b7280" }}>
          Current URL: {window.location.href}
        </p>
        <p style={{ margin: "5px 0", color: "#6b7280" }}>
          User Agent: {navigator.userAgent.slice(0, 50)}...
        </p>
        <p style={{ margin: "5px 0", color: "#6b7280" }}>
          Timestamp: {new Date().toLocaleString()}
        </p>
        <p style={{ margin: "5px 0", color: "#6b7280" }}>
          Screen Size: {window.innerWidth} x {window.innerHeight}
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={() => alert("Button clicked! Interactivity working!")}
          style={{
            backgroundColor: "#ff6600",
            color: "white",
            border: "none",
            padding: "15px 30px",
            fontSize: "18px",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Test Interactivity
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            padding: "15px 30px",
            fontSize: "18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Root container not found!");
}
