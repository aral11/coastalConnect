/**
 * Modern CoastalConnect Homepage - Swiggy/Zomato Style
 * 100% Supabase-driven with real-time data
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import {
  supabase,
  getServices,
  getServiceCategories,
  getLocations,
  searchServices,
  trackEvent,
  SupabaseService,
  SupabaseCategory,
  SupabaseLocation,
} from "@/lib/supabase";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  Heart,
  Filter,
  ChevronDown,
  PlayCircle,
  Award,
  Percent,
  Phone,
  Mail,
} from "lucide-react";

export default function ModernIndex() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  // Data state
  const [categories, setCategories] = useState<SupabaseCategory[]>([]);
  const [locations, setLocations] = useState<SupabaseLocation[]>([]);
  const [featuredServices, setFeaturedServices] = useState<SupabaseService[]>(
    [],
  );
  const [trendingServices, setTrendingServices] = useState<SupabaseService[]>(
    [],
  );
  const [nearbyServices, setNearbyServices] = useState<SupabaseService[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    happyCustomers: 0,
    citiesCovered: 0,
  });

  useEffect(() => {
    loadInitialData();
    setupRealTimeSubscriptions();
  }, [authLoading]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Track page view (only if auth is not loading)
      if (!authLoading) {
        try {
          await trackEvent("page_view", {
            page: "homepage",
            user_id: user?.id,
          });
        } catch (error) {
          console.warn("Failed to track page view:", error);
        }
      }

      // Load data in parallel
      const [
        categoriesData,
        locationsData,
        featuredData,
        trendingData,
        nearbyData,
      ] = await Promise.all([
        getServiceCategories(),
        getLocations(true), // Popular locations only
        getServices({ featured: true, status: "approved", limit: 8 }),
        getServices({ status: "approved", limit: 6 }), // Most recent as trending
        getServices({ status: "approved", limit: 12 }), // All nearby
      ]);

      setCategories(categoriesData || []);
      setLocations(locationsData || []);
      setFeaturedServices(featuredData || []);
      setTrendingServices(trendingData || []);
      setNearbyServices(nearbyData || []);

      // Set default location to first popular location
      if (locationsData && locationsData.length > 0) {
        setSelectedLocation(locationsData[0].id);
      }

      // Load stats
      await loadStats();
    } catch (error: any) {
      console.error("Error loading data:", error);
      console.error("Error details:", error.message || error.toString());
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get real counts from Supabase
      const [servicesCount, bookingsCount] = await Promise.all([
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalServices: servicesCount.count || 0,
        totalBookings: bookingsCount.count || 0,
        happyCustomers: Math.floor((bookingsCount.count || 0) * 0.8), // 80% satisfaction rate
        citiesCovered: locations.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const setupRealTimeSubscriptions = () => {
    // Subscribe to services changes
    const servicesSubscription = supabase
      .channel("homepage_services")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        (payload) => {
          console.log("Services updated:", payload);
          // Refresh featured services
          loadFeaturedServices();
        },
      )
      .subscribe();

    return () => {
      servicesSubscription.unsubscribe();
    };
  };

  const loadFeaturedServices = async () => {
    try {
      const data = await getServices({
        featured: true,
        status: "approved",
        limit: 8,
      });
      setFeaturedServices(data || []);
    } catch (error) {
      console.error("Error refreshing featured services:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      // Track search event
      try {
        await trackEvent("search_performed", {
          query: searchQuery,
          location_id: selectedLocation,
          user_id: user?.id,
        });
      } catch (error) {
        console.warn("Failed to track search event:", error);
      }

      navigate(
        `/search?q=${encodeURIComponent(searchQuery)}&location=${selectedLocation}`,
      );
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryClick = async (category: SupabaseCategory) => {
    try {
      await trackEvent("category_clicked", {
        category_id: category.id,
        category_name: category.name,
        user_id: user?.id,
      });
    } catch (error) {
      console.warn("Failed to track category click:", error);
    }

    navigate(
      `/services?category=${category.slug}&location=${selectedLocation}`,
    );
  };

  const handleServiceClick = async (service: SupabaseService) => {
    try {
      await trackEvent("service_clicked", {
        service_id: service.id,
        service_name: service.name,
        service_type: service.service_type,
        user_id: user?.id,
      });
    } catch (error) {
      console.warn("Failed to track service click:", error);
    }

    navigate(`/service/${service.id}`);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CoastalConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout fullWidth>
      <div className="min-h-screen bg-white">
      {/* Hero Section - Swiggy Style */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  <Zap className="h-3 w-3 mr-1" />
                  Discover Coastal Karnataka
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your Gateway to
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {" "}
                    Coastal Bliss
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Book authentic homestays, discover local flavors, hire trusted
                  drivers, and connect with talented creators in the heart of
                  Coastal Karnataka.
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-2">
                  {/* Location Selector */}
                  <div className="flex items-center px-4 py-3 border-r border-gray-100 min-w-0 md:w-1/3">
                    <MapPin className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-gray-700 font-medium"
                    >
                      <option value="">Select Location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
                  </div>

                  {/* Search Input */}
                  <div className="flex items-center px-4 py-3 flex-1">
                    <Search className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Search for hotels, restaurants, drivers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>

                  {/* Search Button */}
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalServices}+
                  </div>
                  <div className="text-sm text-gray-600">Services</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalBookings}+
                  </div>
                  <div className="text-sm text-gray-600">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.happyCustomers}+
                  </div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.citiesCovered}+
                  </div>
                  <div className="text-sm text-gray-600">Cities</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop"
                  alt="Coastal Karnataka scenic beauty showcasing beaches, temples, and local culture"
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors group"
                    onClick={() => {
                      try {
                        trackEvent("hero_video_play");
                      } catch (error) {
                        console.warn("Failed to track video play event:", error);
                      }
                    }}
                  >
                    <PlayCircle className="h-10 w-10 text-orange-500 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Verified Services
                    </div>
                    <div className="text-sm text-gray-600">
                      100% authentic experiences
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600">
              Discover the best of Coastal Karnataka
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="text-center space-y-3">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: category.color || "#f97316" }}
                  >
                    {category.icon || "🏨"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.service_count || 0} services
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Services
              </h2>
              <p className="text-gray-600 mt-2">Hand-picked by our team</p>
            </div>
            <Link
              to="/services?featured=true"
              className="text-orange-500 hover:text-orange-600 font-medium flex items-center"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={
                      service.primary_image_id ||
                      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop"
                    }
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-500 text-white border-0">
                      <Star className="h-3 w-3 mr-1" />
                      {service.average_rating.toFixed(1)}
                    </Badge>
                  </div>
                  <button
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        trackEvent("service_favorited", {
                          service_id: service.id,
                        });
                      } catch (error) {
                        console.warn("Failed to track favorite event:", error);
                      }
                    }}
                  >
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {service.service_type}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {service.short_description || service.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {service.locations?.name || "Coastal Karnataka"}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ₹{service.base_price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        per{" "}
                        {service.service_type === "homestay"
                          ? "night"
                          : "booking"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-500 mr-3" />
                Trending Now
              </h2>
              <p className="text-gray-600 mt-2">
                Most popular services this week
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingServices.map((service, index) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border border-gray-100 p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize mb-2">
                      {service.service_type}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-yellow-500">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        <span>{service.average_rating.toFixed(1)}</span>
                        <span className="text-gray-500 ml-1">
                          ({service.total_reviews})
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{service.base_price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore Coastal Karnataka?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of travelers discovering authentic local experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/services")}
              size="lg"
              className="bg-white text-orange-500 hover:bg-orange-50 px-8 py-3 text-lg font-medium"
            >
              Start Exploring
            </Button>
            <Button
              onClick={() => navigate("/vendor-register")}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 text-lg font-medium"
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
