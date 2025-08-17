import React from "react";
import { Link } from "react-router-dom";

export default function Phase1Homepage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: "rgba(255, 255, 255, 0.95)",
        padding: "1rem 2rem",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#2563eb",
            margin: 0
          }}>
            CoastalConnect
          </h1>
          <nav style={{ display: "flex", gap: "2rem" }}>
            <Link 
              to="/guide" 
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: "500",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                transition: "all 0.2s"
              }}
            >
              Guide
            </Link>
            <Link 
              to="/feedback" 
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: "500",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                transition: "all 0.2s"
              }}
            >
              Feedback
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "4rem 2rem",
        textAlign: "center",
        color: "white"
      }}>
        {/* Success Banner */}
        <div style={{
          background: "#10b981",
          color: "white",
          padding: "1rem 2rem",
          borderRadius: "12px",
          marginBottom: "3rem",
          fontSize: "1.1rem",
          fontWeight: "600"
        }}>
          🎉 SUCCESS! Phase 1 CoastalConnect is Live - No Loading Screens!
        </div>

        <h1 style={{
          fontSize: "3.5rem",
          fontWeight: "900",
          marginBottom: "1.5rem",
          lineHeight: "1.1"
        }}>
          Udupi & Manipal
          <br />
          <span style={{
            background: "linear-gradient(45deg, #f59e0b, #ef4444)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Visitor Guide
          </span>
        </h1>

        <p style={{
          fontSize: "1.3rem",
          marginBottom: "3rem",
          opacity: 0.9,
          maxWidth: "600px",
          margin: "0 auto 3rem auto",
          lineHeight: "1.6"
        }}>
          Discover the best places to eat, stay, visit, and experience in beautiful coastal Karnataka. Your complete guide to local gems.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "4rem"
        }}>
          <Link 
            to="/guide"
            style={{
              background: "linear-gradient(45deg, #f59e0b, #ef4444)",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "1.1rem",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              transition: "transform 0.2s",
              display: "inline-block"
            }}
            onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
          >
            🗺️ Open Visitor Guide
          </Link>
          
          <button
            onClick={() => alert("PDF download coming soon in Phase 1.1!")}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "2px solid white",
              padding: "1rem 2rem",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "white";
              e.target.style.color = "#4f46e5";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(255,255,255,0.2)";
              e.target.style.color = "white";
            }}
          >
            📄 Download PDF Guide
          </button>
        </div>

        {/* Categories Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginTop: "4rem"
        }}>
          {[
            { name: "Restaurants", emoji: "🍽️", color: "#ef4444" },
            { name: "Stays", emoji: "🏨", color: "#3b82f6" },
            { name: "Places", emoji: "🏛️", color: "#10b981" },
            { name: "Experiences", emoji: "🎭", color: "#8b5cf6" },
            { name: "Transport", emoji: "🚗", color: "#f59e0b" },
            { name: "Festivals", emoji: "🎉", color: "#ec4899" }
          ].map((category) => (
            <Link
              key={category.name}
              to={`/guide?category=${category.name.toLowerCase()}`}
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "16px",
                padding: "2rem 1rem",
                textDecoration: "none",
                color: "white",
                transition: "all 0.3s",
                display: "block"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.background = "rgba(255,255,255,0.25)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.background = "rgba(255,255,255,0.15)";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                {category.emoji}
              </div>
              <h3 style={{ 
                fontSize: "1.3rem", 
                fontWeight: "600", 
                margin: "0 0 0.5rem 0" 
              }}>
                {category.name}
              </h3>
              <p style={{ 
                fontSize: "0.9rem", 
                opacity: 0.8, 
                margin: 0 
              }}>
                Explore {category.name.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "2rem",
        textAlign: "center",
        marginTop: "4rem"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3 style={{ 
            fontSize: "1.5rem", 
            marginBottom: "1rem",
            color: "#f59e0b"
          }}>
            CoastalConnect Phase 1
          </h3>
          <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
            Your trusted companion for exploring Udupi & Manipal
          </p>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap"
          }}>
            <Link to="/guide" style={{ color: "#60a5fa", textDecoration: "none" }}>
              Visitor Guide
            </Link>
            <Link to="/feedback" style={{ color: "#60a5fa", textDecoration: "none" }}>
              Feedback
            </Link>
            <Link to="/contact" style={{ color: "#60a5fa", textDecoration: "none" }}>
              Contact
            </Link>
          </div>
          <p style={{ 
            marginTop: "2rem", 
            fontSize: "0.9rem", 
            opacity: 0.6 
          }}>
            © 2024 CoastalConnect. Made with ❤️ for coastal Karnataka.
          </p>
        </div>
      </footer>
    </div>
  );
}
