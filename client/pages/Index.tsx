import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import SwiggyLocationSelector from "@/components/SwiggyLocationSelector";
import SwiggyCategories from "@/components/SwiggyCategories";
import RealDataVendors from "@/components/RealDataVendors";
import PlatformStats from "@/components/PlatformStats";
import { swiggyTheme } from "@/lib/swiggy-design-system";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import {
  Search,
  Star,
  Clock,
  Shield,
  Heart,
  MapPin,
  ChevronRight,
  Download,
  PlayCircle,
  Calendar,
  Home,
  Car,
} from "lucide-react";

export default function Index() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Udupi, Karnataka");
  const [locationsLoaded, setLocationsLoaded] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Load user-specific data and locations
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationsLoaded(true);
    }, 100);

    // Load user-specific data if authenticated
    if (isAuthenticated && user) {
      loadUserData();
    }

    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      // Load user bookings
      const bookingsResponse = await fetch("/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        if (bookingsData.success) {
          const allBookings = [
            ...(bookingsData.data.homestays || []),
            ...(bookingsData.data.drivers || []),
          ];
          setUserBookings(allBookings.slice(0, 3)); // Show only latest 3
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  return (
    <Layout fullWidth>
      {/* Main Header Section (Swiggy Style) */}
      <section className="bg-white py-8 lg:py-12">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Personalized Tagline */}
              <div className="mb-6">
                {isAuthenticated ? (
                  <>
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                      Welcome back,
                      <br />
                      <span className="text-orange-500">
                        {user?.name?.split(" ")[0] || "Explorer"}
                      </span>
                      !<br />
                      <span className="text-3xl lg:text-4xl xl:text-5xl">
                        Ready for your next adventure?
                      </span>
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                      Continue exploring coastal Karnataka with personalized
                      recommendations based on your preferences.
                      {userBookings.length > 0 &&
                        ` You have ${userBookings.length} recent booking${userBookings.length > 1 ? "s" : ""}.`}
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                      Discover local
                      <br />
                      <span className="text-orange-500">experiences</span>
                      <br />
                      in coastal Karnataka
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                      Book authentic hotels, resorts & homestays, discover local
                      restaurants, hire trusted drivers, and connect with
                      talented creators. Your complete guide to coastal
                      Karnataka.
                    </p>
                  </>
                )}
              </div>

              {/* Search Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Location Selector */}
                  <SwiggyLocationSelector
                    selectedLocation={selectedLocation}
                    onLocationChange={setSelectedLocation}
                    className="lg:w-64"
                  />

                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search for hotels, resorts, homestays, restaurants, drivers, experiences..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-12 pr-4 py-4 text-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                    />
                  </div>

                  {/* Search Button */}
                  <Button
                    onClick={handleSearch}
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg text-lg"
                  >
                    Search
                  </Button>
                </div>

                {/* Popular Searches */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Popular:</span>
                  {[
                    "Beachside hotels & resorts",
                    "Udupi restaurants",
                    "Local drivers",
                    "Wedding photography",
                  ].map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="text-sm text-orange-600 hover:text-orange-800 font-medium hover:underline"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* User-specific content or Platform Stats */}
              {isAuthenticated && userBookings.length > 0 ? (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                    Your Recent Bookings
                  </h3>
                  <div className="space-y-3">
                    {userBookings.map((booking: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            {booking.type === "homestay" ? (
                              <Home className="h-5 w-5 text-orange-600" />
                            ) : (
                              <Car className="h-5 w-5 text-orange-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {booking.type === "homestay"
                                ? "Homestay Booking"
                                : "Driver Trip"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {booking.booking_reference}
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/dashboard"
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center mt-4 text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View All Bookings
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              ) : (
                <PlatformStats />
              )}
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=500&fit=crop"
                  alt="Udupi Krishna Temple - Coastal Karnataka"
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                {/* Play Button Overlay for Instagram Video */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button
                    onClick={() => window.open('https://www.instagram.com/p/your-instagram-post/', '_blank')}
                    className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <PlayCircle className="h-10 w-10 text-orange-500" />
                  </button>
                </div>
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    🏛️ Discover Udupi Heritage
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <SwiggyCategories className="py-12 lg:py-16 bg-gray-50" maxItems={8} />

      {/* Featured Homestays Section */}
      <RealDataVendors
        title="Featured Hotels & Homestays"
        subtitle="Top-rated accommodations in coastal Karnataka"
        serviceType="homestay"
        maxItems={6}
        showFeatured={true}
        className="bg-white"
      />

      {/* Popular Restaurants Section */}
      <RealDataVendors
        title="Popular Restaurants & Cafes"
        subtitle="Authentic local dining experiences"
        serviceType="restaurant"
        maxItems={6}
        className="bg-gray-50"
      />

      {/* Trusted Drivers Section */}
      <RealDataVendors
        title="Trusted Local Drivers"
        subtitle="Professional transportation services"
        serviceType="driver"
        maxItems={4}
        className="bg-white"
      />

      {/* Trust & Safety Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why CoastalConnect?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted marketplace for authentic coastal Karnataka
              experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12 text-green-500" />,
                title: "Verified Services",
                description:
                  "All vendors are personally verified for quality and authenticity",
              },
              {
                icon: <Clock className="h-12 w-12 text-blue-500" />,
                title: "Quick Delivery",
                description:
                  "Fast response times and efficient service delivery",
              },
              {
                icon: <Star className="h-12 w-12 text-yellow-500" />,
                title: "Top Rated",
                description:
                  "Highly rated services with genuine customer reviews",
              },
              {
                icon: <Heart className="h-12 w-12 text-red-500" />,
                title: "Local Community",
                description:
                  "Supporting local businesses and authentic experiences",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities We Serve */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              We deliver in
            </h2>
            <p className="text-lg text-gray-600">
              Expanding across coastal Karnataka
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Udupi", status: "live" },
              { name: "Manipal", status: "live" },
              { name: "Malpe", status: "live" },
              { name: "Kaup", status: "live" },
              { name: "Kundapura", status: "coming" },
              { name: "Mangalore", status: "coming" },
            ].map((city, index) => (
              <div
                key={index}
                className={`
                  bg-white rounded-lg p-4 text-center border-2 transition-colors
                  ${
                    city.status === "live"
                      ? "border-green-200 hover:border-green-300"
                      : "border-gray-200"
                  }
                `}
              >
                <div
                  className={`
                  w-3 h-3 rounded-full mx-auto mb-2
                  ${city.status === "live" ? "bg-green-500" : "bg-gray-400"}
                `}
                />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {city.name}
                </h3>
                <p
                  className={`
                  text-sm
                  ${city.status === "live" ? "text-green-600" : "text-gray-500"}
                `}
                >
                  {city.status === "live" ? "Available" : "Coming Soon"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Coming Soon Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-4">
                📱 Coming Soon
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                CoastalConnect Mobile App
              </h2>
              <p className="text-lg mb-8 text-orange-100 max-w-2xl mx-auto">
                We're working on native mobile apps for iOS and Android to make
                booking coastal Karnataka experiences even easier. Stay tuned
                for launch updates!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="bg-black/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg flex items-center space-x-3 opacity-75">
                <Download className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-xs">Coming to</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg flex items-center space-x-3 opacity-75">
                <Download className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-xs">Coming to</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-lg mx-auto">
              <h3 className="text-lg font-semibold mb-3">
                Get Notified When We Launch
              </h3>
              <p className="text-sm text-orange-100 mb-4">
                Be the first to know when our mobile apps go live
              </p>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white focus:ring-white"
                />
                <Button className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-6">
                  Notify Me
                </Button>
              </div>
            </div>

            <p className="text-sm text-orange-100 mt-6">
              ⚡ Meanwhile, enjoy the full experience on our web platform
            </p>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-12 lg:py-16 bg-white">
        <div className={swiggyTheme.layouts.container.xl}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular locations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the most sought-after destinations in coastal Karnataka
            </p>
          </div>

          {!locationsLoaded ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-gray-200 rounded-xl h-64 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Malpe Beach Area",
                  description: "Beach resorts, water sports, seafood",
                  count: "45+ places",
                  image:
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop",
                  featured: true,
                },
                {
                  name: "Udupi City Center",
                  description: "Temples, restaurants, shopping",
                  count: "120+ places",
                  image:
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop",
                  featured: true,
                },
                {
                  name: "Manipal University Area",
                  description: "Student-friendly, cafes, hostels",
                  count: "80+ places",
                  image:
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop",
                  featured: false,
                },
                {
                  name: "Kaup Lighthouse",
                  description: "Scenic views, photography spots",
                  count: "25+ places",
                  image:
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
                  featured: false,
                },
              ].map((location, index) => (
                <Link
                  key={`location-${index}`}
                  to={`/search?location=${encodeURIComponent(location.name)}`}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    // Add click feedback
                    console.log(`Navigating to: ${location.name}`);
                  }}
                >
                  {/* Featured Badge */}
                  {location.featured && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        🔥 Popular
                      </span>
                    </div>
                  )}

                  <div className="relative h-40 lg:h-48">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src =
                          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="font-bold text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        {location.count}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {location.description}
                    </p>

                    {/* Action indicator */}
                    <div className="mt-3 flex items-center text-orange-600 text-sm font-medium">
                      <span>Explore now</span>
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          )}

          {/* View All Locations Link */}
          <div className="text-center mt-8">
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <MapPin className="h-5 w-5 mr-2" />
              View All Locations
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
