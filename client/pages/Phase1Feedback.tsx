import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Phase1Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    visitPurpose: "",
    feedbackType: "",
    message: "",
    rating: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In Phase 1, just show success message
    setSubmitted(true);
    console.log("Phase 1 Feedback:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "3rem",
            textAlign: "center",
            maxWidth: "500px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "1rem",
            }}
          >
            Thank You!
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "1.1rem",
              marginBottom: "2rem",
              lineHeight: "1.6",
            }}
          >
            Your feedback has been received! In Phase 2, this will be saved to
            our database and help us improve CoastalConnect.
          </p>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <Link
              to="/"
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Back to Home
            </Link>
            <Link
              to="/guide"
              style={{
                background: "#10b981",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Explore Guide
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "white",
          padding: "1rem 2rem",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#2563eb",
              textDecoration: "none",
            }}
          >
            CoastalConnect
          </Link>
          <nav style={{ display: "flex", gap: "2rem" }}>
            <Link
              to="/"
              style={{
                color: "#6b7280",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Home
            </Link>
            <Link
              to="/guide"
              style={{
                color: "#6b7280",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Guide
            </Link>
          </nav>
        </div>
      </header>

      <div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2rem" }}
      >
        {/* Page Title */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "900",
              color: "#111827",
              marginBottom: "1rem",
            }}
          >
            Share Your Feedback
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#6b7280",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Help us build Phase 2 by sharing your thoughts and suggestions about
            CoastalConnect
          </p>
        </div>

        {/* Feedback Form */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Name and Email */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            {/* Visit Purpose */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Purpose of Visit
              </label>
              <select
                name="visitPurpose"
                value={formData.visitPurpose}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  background: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              >
                <option value="">Select purpose...</option>
                <option value="tourism">Tourism/Sightseeing</option>
                <option value="business">Business Travel</option>
                <option value="education">
                  Education (Manipal University)
                </option>
                <option value="pilgrimage">Pilgrimage</option>
                <option value="medical">Medical Treatment</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Feedback Type */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Feedback Type
              </label>
              <select
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  background: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              >
                <option value="">Select feedback type...</option>
                <option value="suggestion">Suggestion for Phase 2</option>
                <option value="missing-place">Missing Place/Business</option>
                <option value="incorrect-info">Incorrect Information</option>
                <option value="new-feature">New Feature Request</option>
                <option value="general">General Feedback</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>

            {/* Rating */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Rate your experience with Phase 1
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, rating: star.toString() })
                    }
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "2rem",
                      color:
                        parseInt(formData.rating) >= star
                          ? "#f59e0b"
                          : "#d1d5db",
                      cursor: "pointer",
                      transition: "color 0.2s",
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Share your thoughts, suggestions, or any places we should add to the guide..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                color: "white",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) =>
                (e.target.style.transform = "translateY(-2px)")
              }
              onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
            >
              Submit Feedback
            </button>
          </form>
        </div>

        {/* Phase 2 Preview */}
        <div
          style={{
            background: "linear-gradient(45deg, #8b5cf6, #a855f7)",
            borderRadius: "16px",
            padding: "2rem",
            marginTop: "3rem",
            color: "white",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Coming in Phase 2
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            <div>📱 Online Bookings</div>
            <div>🎭 Event Management</div>
            <div>🚗 Transport Booking</div>
            <div>🍕 Food Delivery</div>
          </div>
        </div>
      </div>
    </div>
  );
}
