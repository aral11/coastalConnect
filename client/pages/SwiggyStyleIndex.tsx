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

// Dynamic video URL will be loaded from Supabase
const DEFAULT_HERO_VIDEO_THUMBNAIL = "https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop";
const UDUPI_COASTAL_BACKGROUND = "https://images.pexels.com/photos/2099194/pexels-photo-2099194.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop";

export default function SwiggyStyleIndex() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>("");
  const [videoThumbnail, setVideoThumbnail] = useState<string>(DEFAULT_HERO_VIDEO_THUMBNAIL);
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState<string>(UDUPI_COASTAL_BACKGROUND);

  // Data state
  const [categories, setCategories] = useState<SupabaseCategory[]>([]);
  const [locations, setLocations] = useState<SupabaseLocation[]>([]);
  const [featuredServices, setFeaturedServices] = useState<SupabaseService[]>([]);
  const [trendingServices, setTrendingServices] = useState<SupabaseService[]>([]);
  const [nearbyServices, setNearbyServices] = useState<SupabaseService[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
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
    loadInitialData();
    setupRealTimeSubscriptions();
  }, [authLoading]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

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
          .from('site_config')
          .select('value')
          .eq('key', 'homepage_video_url')
          .eq('is_public', true)
          .single();

        if (videoConfig?.value) {
          setHeroVideoUrl(videoConfig.value);
          // If it's an Instagram reel, use a coastal Karnataka thumbnail
          if (videoConfig.value.includes('instagram.com')) {
            setVideoThumbnail(DEFAULT_HERO_VIDEO_THUMBNAIL);
          }
        }
      } catch (error) {
        console.warn("Failed to load video URL:", error);
      }

      // Load hero background URL from database
      try {
        const { data: backgroundConfig } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'homepage_background_url')
          .eq('is_public', true)
          .single();

        if (backgroundConfig?.value) {
          setHeroBackgroundUrl(backgroundConfig.value);
        }
      } catch (error) {
        console.warn("Failed to load background URL:", error);
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
        getLocations(true),
        getServices({ featured: true, status: "approved", limit: 12 }),
        getServices({ status: "approved", limit: 8 }),
        getServices({ status: "approved", limit: 16 }),
      ]);

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
          .from('coupons')
          .select('*')
          .eq('is_active', true)
          .gte('valid_until', new Date().toISOString())
          .order('created_at', { ascending: false })
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
              "from-purple-400 to-pink-500"
            ][index % 3],
          }));
          setOffers(formattedOffers);
        } else {
          // Fallback offers if none in database
          setOffers([
            {
              id: 'fallback-1',
              title: "Welcome Offer",
              subtitle: "Special discount for new users",
              code: "WELCOME",
              bgColor: "from-orange-400 to-red-500",
            }
          ]);
        }
      } catch (error) {
        console.warn("Failed to load offers:", error);
        // Fallback to default offer
        setOffers([
          {
            id: 'fallback-1',
            title: "Welcome Offer",
            subtitle: "Special discount for new users",
            code: "WELCOME",
            bgColor: "from-orange-400 to-red-500",
          }
        ]);
      }

      await loadStats();
    } catch (error: any) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [servicesCount, bookingsCount, locationsCount, avgRatingData] = await Promise.all([
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("locations").select("id", { count: "exact", head: true }),
        supabase.from("services").select("average_rating").not("average_rating", "is", null),
      ]);

      // Calculate dynamic average rating
      const validRatings = avgRatingData.data?.filter(service => service.average_rating > 0) || [];
      const dynamicAvgRating = validRatings.length > 0
        ? validRatings.reduce((sum, service) => sum + service.average_rating, 0) / validRatings.length
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

  const setupRealTimeSubscriptions = () => {
    const servicesSubscription = supabase
      .channel("homepage_services")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        () => loadFeaturedServices()
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
        `/services?q=${encodeURIComponent(searchQuery)}&location=${selectedLocation}`
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
        user_id: user?.id
      });
      if (heroVideoUrl) {
        window.open(heroVideoUrl, '_blank', 'noopener,noreferrer');
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
            <h3 className="text-lg font-semibold text-gray-900">Loading CoastalConnect</h3>
            <p className="text-gray-600">Preparing your coastal experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout fullWidth>
      <div className="min-h-screen bg-white">
        {/* Enhanced Hero Section - Swiggy Style with Video */}
        <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden border-b border-gray-100">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-full">
              <img
                src={heroBackgroundUrl}
                alt="Beautiful Udupi coastal landscape with palms and beach"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-transparent to-red-900/30"></div>
              <div className="absolute inset-0 bg-white/30"></div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-orange-500 text-white border-0 px-4 py-2 text-sm font-medium">
                      <Sparkles className="h-4 w-4 mr-2" />
                      #1 Coastal Platform
                    </Badge>
                    <Badge className="bg-green-500 text-white border-0 px-4 py-2 text-sm font-medium">
                      <Shield className="h-4 w-4 mr-2" />
                      Verified Partners
                    </Badge>
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[0.9]">
                    Your Gateway to
                    <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                      Coastal Bliss
                    </span>
                  </h1>

                  <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium">
                    Book authentic homestays, discover local flavors, hire trusted drivers,
                    and connect with talented creators in beautiful Coastal Karnataka.
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center space-x-8 pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-black text-gray-900">{stats.totalServices}+</div>
                      <div className="text-sm text-gray-600 font-medium">Verified Services</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-gray-900">{stats.avgRating}</div>
                      <div className="text-sm text-gray-600 font-medium flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        Average Rating
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-gray-900">{stats.happyCustomers}+</div>
                      <div className="text-sm text-gray-600 font-medium">Happy Travelers</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Search Bar - Swiggy Style */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="p-2">
                    <div className="flex flex-col lg:flex-row">
                      {/* Location Selector */}
                      <div className="flex items-center px-6 py-4 border-b lg:border-b-0 lg:border-r border-gray-100 lg:w-1/3">
                        <LocationIcon className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</div>
                          <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-gray-900 font-semibold text-lg"
                          >
                            <option value="">Choose destination</option>
                            {locations.map((location) => (
                              <option key={location.id} value={location.id}>
                                {location.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
                      </div>

                      {/* Search Input */}
                      <div className="flex items-center px-6 py-4 flex-1">
                        <Search className="h-6 w-6 text-gray-400 mr-3" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Search</div>
                          <input
                            type="text"
                            placeholder="Hotels, restaurants, drivers, events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            className="w-full bg-transparent border-none outline-none text-gray-900 font-semibold text-lg placeholder-gray-400"
                          />
                        </div>
                      </div>

                      {/* Search Button */}
                      <div className="p-2">
                        <Button
                          onClick={handleSearch}
                          disabled={isSearching || !searchQuery.trim()}
                          className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                          {isSearching ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Search className="h-6 w-6 mr-3" />
                              Explore Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap gap-3 md:gap-4">
                  {[
                    { icon: "🏨", label: "Hotels & Homestays", path: "/services?category=hotels-resorts-homestays" },
                    { icon: "🍽️", label: "Restaurants & Cafes", path: "/services?category=restaurants-cafes" },
                    { icon: "🚗", label: "Local Transport", path: "/services?category=transportation" },
                    { icon: "🎭", label: "Events & Experiences", path: "/services?category=event-services" },
                    { icon: "💆", label: "Beauty & Wellness", path: "/services?category=wellness-spa" },
                    { icon: "📸", label: "Content Creators", path: "/services?category=content-creators" },
                  ].map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => navigate(action.path)}
                      className="flex items-center justify-center space-x-2 px-4 md:px-6 py-3 rounded-xl border-2 border-white bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-200 font-semibold text-center"
                    >
                      <span className="text-lg">{action.icon}</span>
                      <span className="text-gray-700 text-sm md:text-base">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Right Content - Video & Features */}
              <div className="relative space-y-6">
                {/* Video Section */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={videoThumbnail}
                      alt="Experience Beautiful Coastal Karnataka - Watch Our Story"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={handlePlayVideo}
                        className="group w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 shadow-xl"
                      >
                        <PlayCircle className="h-12 w-12 text-orange-500 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>

                    {/* Video Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">Discover Coastal Karnataka</h3>
                            <p className="text-sm text-gray-600">{heroVideoUrl ? 'Watch on Instagram' : 'Experience Coastal Karnataka'}</p>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Eye className="h-4 w-4" />
                            <span>{heroVideoUrl ? 'Watch Reel' : 'Preview'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">100% Verified</div>
                        <div className="text-sm text-gray-600">All partners verified</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FastForward className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Instant Booking</div>
                        <div className="text-sm text-gray-600">Book in seconds</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Offers Banner */}
          <div className="absolute bottom-6 left-4 right-4 z-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className={`flex-shrink-0 bg-gradient-to-r ${offer.bgColor} rounded-lg p-3 text-white min-w-[180px] shadow-lg backdrop-blur-sm`}
                  >
                    <div className="font-bold text-base">{offer.title}</div>
                    <div className="text-xs opacity-90">{offer.subtitle}</div>
                    <div className="text-xs opacity-75 mt-1">Code: {offer.code}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Enhanced */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
                <Crown className="h-4 w-4 mr-2" />
                Explore Categories
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                What are you looking for?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From beachside stays to local delicacies, we've got everything for your perfect coastal getaway
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => navigate(`/services?category=${category.slug}&location=${selectedLocation}`)}
                  className="group relative p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  {/* Background Gradient */}
                  <div 
                    className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${category.color || '#f97316'}, ${category.color || '#f97316'}66)` }}
                  ></div>
                  
                  <div className="relative text-center space-y-4">
                    <div
                      className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg"
                      style={{ backgroundColor: category.color || "#f97316" }}
                    >
                      {category.icon || "🏨"}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {category.service_count || 0} options available
                      </p>
                      <div className="inline-flex items-center text-xs text-orange-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ChevronRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                </button>
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
                <p className="text-xl text-gray-600">Hand-picked experiences just for you</p>
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
                      src={service.primary_image_id || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"}
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
                        {service.service_type} • {service.locations?.name || "Coastal Karnataka"}
                      </p>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {service.short_description || service.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{service.total_reviews} reviews</span>
                        <span className="text-xs text-green-600 font-bold">Free cancellation</span>
                      </div>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md">
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
              Join thousands discovering authentic experiences in Karnataka's coastal paradise
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
