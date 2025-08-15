/**
 * CoastalConnect - Swiggy/Zomato Inspired Homepage
 * Modern, dynamic UI with video hero and enhanced UX
 */

import React, { useState, useEffect, useRef } from "react";
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
  ChevronRight,
  Eye,
  Calendar,
  MapPin as LocationIcon,
  Timer,
  Sparkles,
  Shield,
  Crown,
  FastForward,
  Camera,
  Volume2,
} from "lucide-react";

// Authentic Udupi images - Dynamic video URL will be loaded from Supabase
const DEFAULT_HERO_VIDEO_THUMBNAIL =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format";
const UDUPI_COASTAL_BACKGROUND =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1080&fit=crop&auto=format";

export default function SwiggyStyleIndex() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>("");
  const [videoThumbnail, setVideoThumbnail] = useState<string>(
    DEFAULT_HERO_VIDEO_THUMBNAIL,
  );
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState<string>(
    UDUPI_COASTAL_BACKGROUND,
  );

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
  const [offers, setOffers] = useState<any[]>([]);
  const [serviceCounts, setServiceCounts] = useState<Record<string, number>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    happyCustomers: 0,
    citiesCovered: 0,
    avgRating: 4.8,
  });

  useEffect(() => {
    if (!authLoading) {
      loadInitialData();
      setupRealTimeSubscriptions();
    }

    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn("Loading timeout reached - forcing app to load");
      setLoading(false);
    }, 5000); // 5 seconds max

    return () => clearTimeout(timeout);
  }, [authLoading]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log("Starting to load initial data...");

      // Test Supabase connection first
      try {
        const { data: testData, error: testError } = await supabase
          .from('service_categories')
          .select('id')
          .limit(1);

        if (testError) {
          console.error("Supabase connection test failed:", testError);
          // Continue with fallback data
        } else {
          console.log("Supabase connection successful");
        }
      } catch (error) {
        console.error("Supabase connection error:", error);
        // Continue with fallback data
      }

      // Track page view
      if (!authLoading) {
        try {
          await trackEvent("page_view", {
            page: "swiggy_homepage",
            user_id: user?.id,
          });
        } catch (error) {
          console.warn("Failed to track page view:", error);
        }
      }

      // Load hero video URL from database
      try {
        const { data: videoConfig } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "homepage_video_url")
          .eq("is_public", true)
          .single();

        if (videoConfig?.value) {
          setHeroVideoUrl(videoConfig.value);
          // If it's an Instagram reel, use a coastal Karnataka thumbnail
          if (videoConfig.value.includes("instagram.com")) {
            setVideoThumbnail(DEFAULT_HERO_VIDEO_THUMBNAIL);
          }
        }
      } catch (error) {
        console.warn("Failed to load video URL:", error);
      }

      // Load hero background URL from database
      try {
        const { data: backgroundConfig } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "homepage_background_url")
          .eq("is_public", true)
          .single();

        if (backgroundConfig?.value) {
          setHeroBackgroundUrl(backgroundConfig.value);
        }
      } catch (error) {
        console.warn("Failed to load background URL:", error);
      }

      console.log("Loading core data...");

      // Load data in parallel with better error handling and shorter timeout
      const dataPromises = [
        getServiceCategories(),
        getLocations(true),
        getServices({ featured: true, status: "approved", limit: 12 }),
        getServices({ status: "approved", limit: 8 }),
        getServices({ status: "approved", limit: 16 }),
      ];

      // Add timeout to each promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 3000)
      );

      const dataResults = await Promise.allSettled(
        dataPromises.map(p => Promise.race([p, timeoutPromise]))
      );

      // Extract results with fallbacks
      const categoriesData = dataResults[0].status === 'fulfilled' ? dataResults[0].value : [];
      const locationsData = dataResults[1].status === 'fulfilled' ? dataResults[1].value : [];
      const featuredData = dataResults[2].status === 'fulfilled' ? dataResults[2].value : [];
      const trendingData = dataResults[3].status === 'fulfilled' ? dataResults[3].value : [];
      const nearbyData = dataResults[4].status === 'fulfilled' ? dataResults[4].value : [];

      console.log("Data loaded:", {
        categories: categoriesData?.length || 0,
        locations: locationsData?.length || 0,
        featured: featuredData?.length || 0,
        trending: trendingData?.length || 0,
        nearby: nearbyData?.length || 0
      });


      setCategories(categoriesData || []);
      setLocations(locationsData || []);
      setFeaturedServices(featuredData || []);
      setTrendingServices(trendingData || []);
      setNearbyServices(nearbyData || []);

      // Set default location
      if (locationsData && locationsData.length > 0) {
        setSelectedLocation(locationsData[0].id);
      }

      // Load dynamic offers from database
      try {
        const { data: couponsData } = await supabase
          .from("coupons")
          .select("*")
          .eq("is_active", true)
          .gte("valid_until", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(3);

        if (couponsData && couponsData.length > 0) {
          const formattedOffers = couponsData.map((coupon, index) => ({
            id: coupon.id,
            title: coupon.title,
            subtitle: coupon.description,
            code: coupon.code,
            bgColor: [
              "from-orange-400 to-red-500",
              "from-green-400 to-blue-500",
              "from-purple-400 to-pink-500",
            ][index % 3],
          }));
          setOffers(formattedOffers);
        } else {
          // Fallback offers if none in database
          setOffers([
            {
              id: "fallback-1",
              title: "Welcome Offer",
              subtitle: "Special discount for new users",
              code: "WELCOME",
              bgColor: "from-orange-400 to-red-500",
            },
          ]);
        }
      } catch (error) {
        console.warn("Failed to load offers:", error);
        // Fallback to default offer
        setOffers([
          {
            id: "fallback-1",
            title: "Welcome Offer",
            subtitle: "Special discount for new users",
            code: "WELCOME",
            bgColor: "from-orange-400 to-red-500",
          },
        ]);
      }

      // Load additional data with error handling
      const additionalResults = await Promise.allSettled([
        loadStats(),
        loadServiceCounts()
      ]);

      // Log any failures for debugging
      additionalResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`Additional data load ${index} failed:`, result.reason);
        }
      });
    } catch (error: any) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [servicesCount, bookingsCount, locationsCount, avgRatingData] =
        await Promise.all([
          supabase
            .from("services")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("bookings")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("locations")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("services")
            .select("average_rating")
            .not("average_rating", "is", null),
        ]);

      // Calculate dynamic average rating
      const validRatings =
        avgRatingData.data?.filter((service) => service.average_rating > 0) ||
        [];
      const dynamicAvgRating =
        validRatings.length > 0
          ? validRatings.reduce(
              (sum, service) => sum + service.average_rating,
              0,
            ) / validRatings.length
          : 4.8;

      setStats({
        totalServices: servicesCount.count || 0,
        totalBookings: bookingsCount.count || 0,
        happyCustomers: Math.floor((bookingsCount.count || 0) * 0.95), // Assuming 95% satisfaction
        citiesCovered: locationsCount.count || 0,
        avgRating: Number(dynamicAvgRating.toFixed(1)),
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      // Fallback stats
      setStats({
        totalServices: 0,
        totalBookings: 0,
        happyCustomers: 0,
        citiesCovered: 0,
        avgRating: 4.8,
      });
    }
  };

  const loadServiceCounts = async () => {
    try {
      const categoryMappings = {
        "hotels-resorts-homestays": [
          "hotels-resorts-homestays",
          "accommodation",
        ],
        "restaurants-cafes": ["restaurants-cafes", "food"],
        transportation: ["transportation", "drivers"],
        "event-services": ["event-services", "events"],
        "wellness-spa": ["wellness-spa", "beauty"],
        "content-creators": ["content-creators", "photography"],
      };

      const counts: Record<string, number> = {};

      for (const [key, categories] of Object.entries(categoryMappings)) {
        const { count } = await supabase
          .from("services")
          .select("id", { count: "exact", head: true })
          .eq("status", "approved")
          .in("service_type", categories);
        counts[key] = count || 0;
      }

      setServiceCounts(counts);
    } catch (error) {
      console.error("Error loading service counts:", error);
      setServiceCounts({});
    }
  };

  const setupRealTimeSubscriptions = () => {
    const servicesSubscription = supabase
      .channel("homepage_services")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        () => loadFeaturedServices(),
      )
      .subscribe();

    return () => servicesSubscription.unsubscribe();
  };

  const loadFeaturedServices = async () => {
    try {
      const data = await getServices({
        featured: true,
        status: "approved",
        limit: 12,
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
      await trackEvent("search_performed", {
        query: searchQuery,
        location_id: selectedLocation,
        user_id: user?.id,
      });

      navigate(
        `/services?q=${encodeURIComponent(searchQuery)}&location=${selectedLocation}`,
      );
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayVideo = () => {
    try {
      trackEvent("hero_video_play", {
        video_url: heroVideoUrl,
        user_id: user?.id,
      });
      if (heroVideoUrl) {
        window.open(heroVideoUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.warn("Failed to track video play event:", error);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Loading CoastalConnect
            </h3>
            <p className="text-gray-600">
              Preparing your coastal experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout fullWidth>
      <div className="min-h-screen bg-white">
        {/* Redesigned Hero Section - Clean & Modern */}
        <section className="relative bg-white overflow-hidden">
          {/* Background with subtle pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-red-50/50"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
            {/* Hero Content */}
            <div className="text-center space-y-12">
              {/* Badges */}
              <div className="flex justify-center items-center space-x-4">
                <Badge className="bg-orange-500 text-white border-0 px-6 py-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 mr-2" />
                  #1 Coastal Platform
                </Badge>
                <Badge className="bg-green-500 text-white border-0 px-6 py-2 text-sm font-semibold">
                  <Shield className="h-4 w-4 mr-2" />
                  Verified Partners
                </Badge>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
                  Your Gateway to
                  <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                    Coastal Bliss
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Book authentic homestays, discover local flavors, hire trusted
                  drivers, and connect with talented creators in beautiful
                  Coastal Karnataka.
                </p>
              </div>

              {/* Stats */}
              <div className="flex justify-center items-center space-x-12">
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900">
                    {stats.totalServices}+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Verified Services
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900">
                    {stats.avgRating}
                  </div>
                  <div className="text-sm text-gray-600 font-medium flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    Average Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900">
                    {stats.happyCustomers}+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Happy Travelers
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="p-3">
                    <div className="flex flex-col md:flex-row gap-2">
                      {/* Location */}
                      <div className="flex items-center px-6 py-4 bg-gray-50 rounded-2xl md:flex-1">
                        <LocationIcon className="h-5 w-5 text-orange-500 mr-3" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                            Location
                          </div>
                          <select
                            value={selectedLocation}
                            onChange={(e) =>
                              setSelectedLocation(e.target.value)
                            }
                            className="w-full bg-transparent border-none outline-none text-gray-900 font-semibold"
                          >
                            <option value="">Choose destination</option>
                            {locations.map((location) => (
                              <option key={location.id} value={location.id}>
                                {location.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Search */}
                      <div className="flex items-center px-6 py-4 bg-gray-50 rounded-2xl md:flex-[2]">
                        <Search className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                            Search
                          </div>
                          <input
                            type="text"
                            placeholder="Hotels, restaurants, drivers, events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleSearch()
                            }
                            className="w-full bg-transparent border-none outline-none text-gray-900 font-semibold placeholder-gray-400"
                          />
                        </div>
                      </div>

                      {/* Search Button */}
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching || !searchQuery.trim()}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isSearching ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Search className="h-5 w-5 mr-2" />
                            Explore
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                {
                  key: "hotels-resorts-homestays",
                  label: "Hotels & Homestays",
                  path: "/services?category=hotels-resorts-homestays",
                  image:
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop&auto=format",
                  alt: "Coastal homestays and resorts",
                },
                {
                  key: "restaurants-cafes",
                  label: "Restaurants",
                  path: "/services?category=restaurants-cafes",
                  image:
                    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop&auto=format",
                  alt: "Traditional South Indian cuisine",
                },
                {
                  key: "transportation",
                  label: "Transport",
                  path: "/services?category=transportation",
                  image:
                    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop&auto=format",
                  alt: "Local transportation services",
                },
                {
                  key: "event-services",
                  label: "Events",
                  path: "/services?category=event-services",
                  image:
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&auto=format",
                  alt: "Udupi cultural festivals",
                },
                {
                  key: "content-creators",
                  label: "Creators",
                  path: "/services?category=content-creators",
                  image:
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop&auto=format",
                  alt: "Photography and content creation",
                },
                {
                  key: "wellness-spa",
                  label: "Wellness",
                  path: "/services?category=wellness-spa",
                  image:
                    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=300&h=200&fit=crop&auto=format",
                  alt: "Ayurvedic spa and wellness",
                },
                {
                  key: "visit-guide",
                  label: "Udupi Guide",
                  path: "/visit-udupi-guide",
                  image:
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop&auto=format",
                  alt: "Udupi attractions",
                },
              ].map((action, index) => {
                const count = serviceCounts[action.key] || 0;
                // Only show "Coming Soon" for specific services we know aren't ready
                // Allow navigation to show "No services available" message instead
                const isComingSoon = false; // Temporarily disable coming soon to allow navigation

                return (
                  <div
                    key={index}
                    onClick={() => !isComingSoon && navigate(action.path)}
                    className={`group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 ${
                      isComingSoon
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer hover:-translate-y-1"
                    }`}
                  >
                    <div className="aspect-[3/2] relative">
                      <img
                        src={action.image}
                        alt={action.alt}
                        className={`w-full h-full object-cover ${
                          isComingSoon ? "grayscale" : "group-hover:scale-105"
                        } transition-transform duration-500`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                      {/* Badge */}
                      <div className="absolute top-2 right-2">
                        <div
                          className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            isComingSoon
                              ? "bg-gray-500 text-white"
                              : "bg-orange-500 text-white"
                          }`}
                        >
                          {isComingSoon
                            ? "Soon"
                            : action.key === "visit-guide"
                              ? "📖"
                              : count}
                        </div>
                      </div>

                      {/* Label */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2">
                          <h3 className="text-white font-bold text-base leading-tight mb-1">
                            {action.label}
                          </h3>
                          <p className="text-white/90 text-sm font-medium">
                            {isComingSoon
                              ? "Coming Soon"
                              : action.key === "visit-guide"
                                ? "Explore Guide"
                                : `${count} available`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Offers Banner */}
        {offers.length > 0 && (
          <section className="py-8 bg-gradient-to-r from-orange-500 to-red-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white min-w-[250px] border border-white/20"
                  >
                    <div className="font-bold text-lg mb-1">{offer.title}</div>
                    <div className="text-sm opacity-90 mb-2">
                      {offer.subtitle}
                    </div>
                    <div className="text-xs bg-white/20 px-3 py-1 rounded-full inline-block">
                      Code: {offer.code}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* What are you looking for - Redesigned */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-6">
                <Crown className="h-4 w-4 mr-2" />
                Explore Categories
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                What are you looking for?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From beachside stays to local delicacies, we've got everything
                for your perfect coastal getaway
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  onClick={() =>
                    navigate(
                      `/services?category=${category.slug}&location=${selectedLocation}`,
                    )
                  }
                  className="group cursor-pointer bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="relative p-8 text-center">
                    {/* Background Pattern */}
                    <div
                      className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-all duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${category.color || "#f97316"}, ${category.color || "#f97316"}99)`,
                      }}
                    ></div>

                    {/* Icon */}
                    <div className="relative mb-6">
                      <div
                        className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl"
                        style={{ backgroundColor: category.color || "#f97316" }}
                      >
                        {category.icon || "🏨"}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative space-y-3">
                      <h3 className="font-bold text-2xl text-gray-900 group-hover:text-orange-500 transition-colors leading-tight">
                        {category.name}
                      </h3>
                      <p className="text-lg text-gray-600 font-semibold">
                        {category.service_count || 0} options available
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-8 pb-8">
                    <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 shadow-lg text-center">
                      Explore Now
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rest of the sections continue with enhanced styling... */}
        {/* Featured Services - Swiggy Card Style */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                  Featured This Week
                </h2>
                <p className="text-xl text-gray-600">
                  Hand-picked experiences just for you
                </p>
              </div>
              <Link
                to="/services?featured=true"
                className="flex items-center text-orange-500 hover:text-orange-600 font-bold text-lg"
              >
                View All <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredServices.slice(0, 8).map((service) => (
                <div
                  key={service.id}
                  onClick={() => navigate(`/service/${service.id}`)}
                  className="group cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={
                        service.primary_image_id ||
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format"
                      }
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {service.average_rating.toFixed(1)}
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md z-10">
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                    </button>

                    {/* Quick Info */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 flex items-center truncate">
                            <Timer className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">Available</span>
                          </span>
                          <span className="text-green-600 font-bold ml-2 flex-shrink-0">
                            ₹{service.base_price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize font-medium">
                        {service.service_type} •{" "}
                        {service.locations?.name || "Coastal Karnataka"}
                      </p>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {service.short_description || service.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {service.total_reviews} reviews
                        </span>
                        <span className="text-xs text-green-600 font-bold">
                          Free cancellation
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Ready for Your Coastal Adventure?
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-10 font-medium">
              Join thousands discovering authentic experiences in Karnataka's
              coastal paradise
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => navigate("/services")}
                size="lg"
                className="bg-white text-orange-500 hover:bg-orange-50 px-10 py-4 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Start Exploring
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
              <Button
                onClick={() => navigate("/partner-with-us")}
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-10 py-4 text-xl font-bold rounded-2xl"
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
