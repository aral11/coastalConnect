import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Phase1Guide() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  const categories = [
    { id: "all", name: "All", emoji: "🌟" },
    { id: "restaurants", name: "Restaurants", emoji: "🍽️" },
    { id: "stays", name: "Stays", emoji: "🏨" },
    { id: "places", name: "Places", emoji: "🏛️" },
    { id: "experiences", name: "Experiences", emoji: "🎭" },
    { id: "transport", name: "Transport", emoji: "🚗" },
    { id: "festivals", name: "Festivals", emoji: "🎉" },
  ];

  // Static sample data for Phase 1
  const samplePlaces = [
    {
      id: 1,
      name: "Diana Restaurant",
      category: "restaurants",
      description: "Famous for authentic South Indian cuisine and seafood",
      location: "Car Street, Udupi",
      rating: "4.5",
      image: "🍽️",
    },
    {
      id: 2,
      name: "Manipal Lake",
      category: "places",
      description: "Beautiful lake perfect for evening walks and boat rides",
      location: "Manipal",
      rating: "4.3",
      image: "🏞️",
    },
    {
      id: 3,
      name: "Udupi Sri Krishna Matha",
      category: "places",
      description: "Historic temple dedicated to Lord Krishna",
      location: "Temple Street, Udupi",
      rating: "4.8",
      image: "🏛️",
    },
    {
      id: 4,
      name: "Malpe Beach",
      category: "experiences",
      description:
        "Popular beach with water sports and boat rides to St. Mary's Island",
      location: "Malpe, Udupi",
      rating: "4.4",
      image: "🏖️",
    },
    {
      id: 5,
      name: "Hotel Kidiyoor",
      category: "stays",
      description: "Heritage hotel with traditional South Indian hospitality",
      location: "Udupi",
      rating: "4.2",
      image: "🏨",
    },
    {
      id: 6,
      name: "Krishna Janmashtami",
      category: "festivals",
      description:
        "Grand celebration at Sri Krishna Matha with cultural programs",
      location: "Udupi",
      rating: "4.9",
      image: "🎉",
    },
  ];

  const filteredPlaces = samplePlaces.filter((place) => {
    const matchesCategory =
      activeCategory === "all" || place.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "white",
          padding: "1rem 2rem",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 10,
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
              to="/feedback"
              style={{
                color: "#6b7280",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Feedback
            </Link>
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
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
            Udupi & Manipal Guide
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#6b7280",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Explore the best places, restaurants, and experiences in coastal
            Karnataka
          </p>
        </div>

        {/* Search Bar */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <input
            type="text"
            placeholder="Search places, restaurants, experiences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
            overflowX: "auto",
            padding: "0.5rem",
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{
                background:
                  activeCategory === category.id ? "#3b82f6" : "white",
                color: activeCategory === category.id ? "white" : "#374151",
                border: "2px solid #e5e7eb",
                borderColor:
                  activeCategory === category.id ? "#3b82f6" : "#e5e7eb",
                padding: "0.75rem 1.5rem",
                borderRadius: "25px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseOver={(e) => {
                if (activeCategory !== category.id) {
                  e.target.style.background = "#f9fafb";
                  e.target.style.borderColor = "#9ca3af";
                }
              }}
              onMouseOut={(e) => {
                if (activeCategory !== category.id) {
                  e.target.style.background = "white";
                  e.target.style.borderColor = "#e5e7eb";
                }
              }}
            >
              <span>{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div
          style={{
            marginBottom: "2rem",
            color: "#6b7280",
            fontSize: "1rem",
          }}
        >
          Found {filteredPlaces.length} places
          {activeCategory !== "all" &&
            ` in ${categories.find((c) => c.id === activeCategory)?.name}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Places Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {place.image}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  {place.name}
                </h3>
                <div
                  style={{
                    background: "#10b981",
                    color: "white",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  ⭐ {place.rating}
                </div>
              </div>

              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  lineHeight: "1.5",
                }}
              >
                {place.description}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                }}
              >
                <span>📍</span>
                {place.location}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPlaces.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              color: "#6b7280",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              No places found
            </h3>
            <p>Try adjusting your search or category filter</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                marginTop: "1rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Show All Places
            </button>
          </div>
        )}

        {/* Phase 1 Notice */}
        <div
          style={{
            background: "#eff6ff",
            border: "2px solid #3b82f6",
            borderRadius: "12px",
            padding: "1.5rem",
            marginTop: "3rem",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              color: "#1e40af",
              fontSize: "1.3rem",
              marginBottom: "0.5rem",
            }}
          >
            🚀 Phase 1 Demo
          </h3>
          <p
            style={{
              color: "#374151",
              margin: 0,
            }}
          >
            This is a working Phase 1 guide with sample data. Connect to
            Supabase to load real places and enable full functionality!
          </p>
        </div>
      </div>
    </div>
  );
}
