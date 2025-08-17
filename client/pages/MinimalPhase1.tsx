import React from "react";

const MinimalPhase1: React.FC = () => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)",
      fontFamily: "system-ui, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h1 style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#ea580c",
            margin: 0
          }}>
            CoastalConnect
          </h1>
          <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <a href="/guide" style={{ color: "#374151", textDecoration: "none", fontWeight: "500" }}>Guide</a>
            <a href="/feedback" style={{ color: "#374151", textDecoration: "none", fontWeight: "500" }}>Feedback</a>
            <button style={{
              background: "#ea580c",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: "pointer"
            }}>
              Download PDF
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          {/* Success Banner */}
          <div style={{
            background: "#dcfce7",
            border: "1px solid #bbf7d0",
            color: "#166534",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "48px",
            fontSize: "18px",
            fontWeight: "600"
          }}>
            🎉 SUCCESS! Phase 1 CoastalConnect is now LIVE! No more loading screens!
          </div>

          {/* Badges */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "48px",
            flexWrap: "wrap"
          }}>
            <span style={{
              background: "#ea580c",
              color: "white",
              padding: "8px 24px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              ⭐ Phase 1: Visitor Guide
            </span>
            <span style={{
              background: "#16a34a",
              color: "white",
              padding: "8px 24px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              ✓ Local Verified
            </span>
          </div>

          {/* Main Heading */}
          <div style={{ marginBottom: "48px" }}>
            <h1 style={{
              fontSize: "clamp(48px, 8vw, 96px)",
              fontWeight: "900",
              color: "#111827",
              lineHeight: "1.1",
              margin: "0 0 24px 0"
            }}>
              Udupi & Manipal
              <br />
              <span style={{
                background: "linear-gradient(45deg, #ea580c, #dc2626, #e11d48)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Visitor Guide
              </span>
            </h1>
            <p style={{
              fontSize: "clamp(18px, 3vw, 28px)",
              color: "#6b7280",
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: "1.6"
            }}>
              Discover the best places to eat, stay, visit, and experience in 
              beautiful coastal Karnataka. Your complete guide to local gems.
            </p>
          </div>

          {/* CTA Buttons */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "48px",
            flexWrap: "wrap"
          }}>
            <a href="/guide" style={{
              background: "linear-gradient(45deg, #ea580c, #dc2626)",
              color: "white",
              padding: "16px 32px",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "0 10px 25px rgba(234, 88, 12, 0.3)",
              transition: "transform 0.2s",
              display: "inline-block"
            }}>
              🧭 Open Udupi–Manipal Guide →
            </a>
            
            <button style={{
              background: "transparent",
              color: "#ea580c",
              border: "2px solid #ea580c",
              padding: "16px 32px",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              📥 Download PDF Guide
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ maxWidth: "600px", margin: "0 auto 80px auto" }}>
            <div style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              display: "flex"
            }}>
              <input
                type="text"
                placeholder="Search restaurants, places, experiences..."
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  fontSize: "16px",
                  border: "none",
                  outline: "none",
                  background: "transparent"
                }}
              />
              <button style={{
                background: "#ea580c",
                color: "white",
                border: "none",
                padding: "16px 32px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}>
                Search
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div style={{ marginBottom: "80px" }}>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "16px"
            }}>
              Explore by Category
            </h2>
            <p style={{
              fontSize: "20px",
              color: "#6b7280",
              marginBottom: "48px",
              maxWidth: "600px",
              margin: "0 auto 48px auto"
            }}>
              Browse our comprehensive guide organized by what matters most to visitors
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              maxWidth: "1000px",
              margin: "0 auto"
            }}>
              {[
                { name: "Restaurants", emoji: "🍽️", color: "#dc2626" },
                { name: "Stays", emoji: "🏨", color: "#2563eb" },
                { name: "Places", emoji: "🌲", color: "#16a34a" },
                { name: "Experiences", emoji: "📸", color: "#9333ea" },
                { name: "Transport", emoji: "🚗", color: "#ea580c" },
                { name: "Festivals", emoji: "🎵", color: "#7c3aed" }
              ].map((category, index) => (
                <a key={index} href={`/guide?category=${category.name.toLowerCase()}`} style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #f3f4f6",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "block"
                }}>
                  <div style={{
                    fontSize: "48px",
                    marginBottom: "16px"
                  }}>
                    {category.emoji}
                  </div>
                  <h3 style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: category.color,
                    margin: "0 0 8px 0"
                  }}>
                    {category.name}
                  </h3>
                  <p style={{
                    color: "#6b7280",
                    fontSize: "14px",
                    margin: 0
                  }}>
                    Discover the best {category.name.toLowerCase()} in Udupi & Manipal
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Phase 2 Preview */}
          <div style={{
            background: "linear-gradient(45deg, #fef3c7, #ddd6fe)",
            borderRadius: "16px",
            padding: "48px 24px",
            marginBottom: "80px"
          }}>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "24px"
            }}>
              What's Coming in Phase 2? 🚀
            </h2>
            <p style={{
              fontSize: "18px",
              color: "#6b7280",
              marginBottom: "32px",
              maxWidth: "600px",
              margin: "0 auto 32px auto"
            }}>
              We're building something bigger! Your feedback will help us prioritize these features:
            </p>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              marginBottom: "32px"
            }}>
              {[
                { name: "Online Bookings", emoji: "📅", color: "#2563eb" },
                { name: "Event Management", emoji: "👥", color: "#16a34a" },
                { name: "Driver Booking", emoji: "🚗", color: "#9333ea" },
                { name: "Food Delivery", emoji: "☕", color: "#dc2626" }
              ].map((feature, index) => (
                <div key={index} style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{feature.emoji}</div>
                  <p style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    margin: 0
                  }}>
                    {feature.name}
                  </p>
                </div>
              ))}
            </div>

            <a href="/feedback" style={{
              background: "linear-gradient(45deg, #9333ea, #e11d48)",
              color: "white",
              padding: "16px 32px",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "600",
              textDecoration: "none",
              display: "inline-block"
            }}>
              ❤️ Share Your Feedback
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: "#111827",
        color: "white",
        padding: "48px 24px"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "32px"
        }}>
          <div>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#ea580c",
              marginBottom: "16px"
            }}>
              CoastalConnect
            </h3>
            <p style={{
              color: "#9ca3af",
              fontSize: "14px",
              lineHeight: "1.6"
            }}>
              Your trusted companion for exploring the beautiful coastal region of Udupi & Manipal.
            </p>
          </div>
          
          <div>
            <h4 style={{
              fontWeight: "600",
              marginBottom: "16px",
              fontSize: "16px"
            }}>
              Quick Links
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a href="/guide" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "14px" }}>
                Visitor Guide
              </a>
              <a href="/feedback" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "14px" }}>
                Feedback
              </a>
            </div>
          </div>
          
          <div>
            <h4 style={{
              fontWeight: "600",
              marginBottom: "16px",
              fontSize: "16px"
            }}>
              Contact
            </h4>
            <div style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.6" }}>
              <p style={{ margin: "0 0 4px 0" }}>hello@coastalconnect.in</p>
              <p style={{ margin: "0 0 4px 0" }}>+91 820 252 0187</p>
              <p style={{ margin: 0 }}>Udupi & Manipal, Karnataka</p>
            </div>
          </div>
        </div>
        
        <div style={{
          borderTop: "1px solid #374151",
          marginTop: "32px",
          paddingTop: "32px",
          textAlign: "center"
        }}>
          <p style={{
            color: "#9ca3af",
            fontSize: "14px",
            margin: 0
          }}>
            © 2024 CoastalConnect. Made with ❤️ for coastal Karnataka.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MinimalPhase1;
