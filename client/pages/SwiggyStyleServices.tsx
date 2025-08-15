/**
 * CoastalConnect - Swiggy/Zomato Style Services Listing
 * Advanced filtering, sorting, and dynamic content
 */

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import {
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
  Filter,
  Grid3X3,
  List,
  MapPin,
  Star,
  Heart,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  Clock,
  Users,
  Phone,
  ChevronDown,
  Loader2,
  ArrowRight,
  Zap,
  Award,
  Timer,
  Shield,
  CheckCircle,
  Eye,
  MessageCircle,
  Share2,
  Calendar,
  CreditCard,
  Percent,
  MapPin as LocationIcon,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Crown,
  ThumbsUp,
  Wifi,
  Car,
  Coffee,
  Utensils,
} from "lucide-react";

interface Filters {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  location: string;
  serviceType: string[];
  featured: boolean;
  availability: "all" | "available" | "unavailable";
  amenities: string[];
}

type SortOption =
  | "relevance"
  | "price_low"
  | "price_high"
  | "rating"
  | "newest"
  | "popular";
type ViewMode = "grid" | "list";

export default function SwiggyStyleServices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven state
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialLocation = searchParams.get("location") || "";

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: [0, 50000],
    rating: 0,
    location: initialLocation,
    serviceType: [],
    featured: false,
    availability: "all",
    amenities: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);

  // Data state
  const [services, setServices] = useState<SupabaseService[]>([]);
  const [categories, setCategories] = useState<SupabaseCategory[]>([]);
  const [locations, setLocations] = useState<SupabaseLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 20;

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    performSearch();
  }, [searchQuery, filters, sortBy, currentPage]);

  useEffect(() => {
    // Count applied filters
    const count =
      filters.categories.length +
      (filters.rating > 0 ? 1 : 0) +
      (filters.location ? 1 : 0) +
      filters.serviceType.length +
      (filters.featured ? 1 : 0) +
      (filters.availability !== "all" ? 1 : 0) +
      filters.amenities.length;
    setAppliedFiltersCount(count);
  }, [filters]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, locationsData] = await Promise.all([
        getServiceCategories(),
        getLocations(),
      ]);

      setCategories(categoriesData || []);
      setLocations(locationsData || []);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const performSearch = async () => {
    setLoading(currentPage === 1);
    setSearching(true);

    try {
      // Track search
      await trackEvent("services_search", {
        query: searchQuery,
        filters: filters,
        sort: sortBy,
        user_id: user?.id,
      });

      // Use getServices for better parameter handling
      const results = await getServices({
        type: filters.serviceType?.[0], // Take first service type
        location_id: filters.location,
        status: "approved",
        featured: filters.featured,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      });

      // If there's a search query, use searchServices instead
      if (searchQuery.trim()) {
        const searchResults = await searchServices(searchQuery, {
          type: filters.serviceType?.[0],
          location_id: filters.location,
          min_price: filters.priceRange[0],
          max_price: filters.priceRange[1],
          min_rating: filters.rating,
        });

        setServices(searchResults || []);
        setTotalResults(searchResults?.length || 0);
        setHasMore(false); // Search results don't support pagination
        return;
      }

      // Handle regular getServices results
      let finalResults = results || [];

      // Add fallback data if no results found (for testing)
      if (!finalResults || finalResults.length === 0) {
        const fallbackServices = [
          {
            id: "fallback-1",
            name: "Cozy Coastal Homestay",
            description:
              "Beautiful homestay near Malpe Beach with traditional hospitality",
            service_type: "homestay",
            base_price: 1500,
            average_rating: 4.6,
            total_reviews: 124,
            location: "Malpe, Udupi",
            location_id: "udupi-1",
            status: "approved",
            is_active: true,
            is_featured: true,
            primary_image_id:
              "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
            phone: "+91 98765 43210",
            created_at: new Date().toISOString(),
            locations: { name: "Udupi", type: "city" },
            service_categories: {
              name: "Homestays",
              slug: "homestay",
              color: "#3B82F6",
            },
          },
          {
            id: "fallback-2",
            name: "Heritage Inn Udupi",
            description:
              "Traditional hotel with modern amenities in the heart of Udupi",
            service_type: "hotel",
            base_price: 2500,
            average_rating: 4.4,
            total_reviews: 89,
            location: "Car Street, Udupi",
            location_id: "udupi-1",
            status: "approved",
            is_active: true,
            is_featured: false,
            primary_image_id:
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
            phone: "+91 98765 43211",
            created_at: new Date().toISOString(),
            locations: { name: "Udupi", type: "city" },
            service_categories: {
              name: "Hotels",
              slug: "hotel",
              color: "#10B981",
            },
          },
          {
            id: "fallback-3",
            name: "Authentic Udupi Restaurant",
            description:
              "Traditional South Indian cuisine with authentic Udupi flavors",
            service_type: "restaurant",
            base_price: 300,
            average_rating: 4.7,
            total_reviews: 256,
            location: "Temple Road, Udupi",
            location_id: "udupi-1",
            status: "approved",
            is_active: true,
            is_featured: true,
            primary_image_id:
              "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
            phone: "+91 98765 43212",
            created_at: new Date().toISOString(),
            locations: { name: "Udupi", type: "city" },
            service_categories: {
              name: "Restaurants",
              slug: "restaurant",
              color: "#F59E0B",
            },
          },
        ];

        // Filter fallback data based on current filters
        finalResults = fallbackServices.filter((service) => {
          // Service type filter
          if (
            filters.serviceType.length > 0 &&
            !filters.serviceType.includes(service.service_type)
          ) {
            return false;
          }

          // Price range filter
          if (
            service.base_price < filters.priceRange[0] ||
            service.base_price > filters.priceRange[1]
          ) {
            return false;
          }

          // Rating filter
          if (filters.rating > 0 && service.average_rating < filters.rating) {
            return false;
          }

          // Featured filter
          if (filters.featured && !service.is_featured) {
            return false;
          }

          return true;
        });
      }

      if (currentPage === 1) {
        setServices(finalResults);
      } else {
        setServices((prev) => [...prev, ...finalResults]);
      }

      setTotalResults(finalResults.length);
      setHasMore(finalResults.length === itemsPerPage);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 50000],
      rating: 0,
      location: "",
      serviceType: [],
      featured: false,
      availability: "all",
      amenities: [],
    });
    setCurrentPage(1);
  };

  const handleServiceClick = async (service: SupabaseService) => {
    await trackEvent("service_viewed", {
      service_id: service.id,
      service_name: service.name,
      user_id: user?.id,
    });
    navigate(`/service/${service.id}`);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-500";
    if (rating >= 4.0) return "bg-green-400";
    if (rating >= 3.5) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "homestay":
        return "🏠";
      case "hotel":
        return "🏨";
      case "restaurant":
        return "🍽️";
      case "driver":
        return "🚗";
      case "event":
        return "🎭";
      default:
        return "🏖️";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading && currentPage === 1) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="h-6 w-6 text-orange-500 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Finding perfect matches
              </h3>
              <p className="text-gray-600">
                Searching through our verified services...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for hotels, restaurants, drivers, events..."
                  className="pl-12 pr-4 py-3 rounded-xl border-gray-300 focus:ring-orange-500 focus:border-orange-500 text-lg"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="px-6 py-3 rounded-xl border-gray-300 relative"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
                {appliedFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {appliedFiltersCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-x-auto">
                {categories.slice(0, 6).map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      filters.categories.includes(category.slug)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      const newCategories = filters.categories.includes(
                        category.slug,
                      )
                        ? filters.categories.filter((c) => c !== category.slug)
                        : [...filters.categories, category.slug];
                      handleFilterChange("categories", newCategories);
                    }}
                    className="whitespace-nowrap rounded-full"
                  >
                    <span className="text-lg mr-2">
                      {category.icon || getServiceIcon(category.slug)}
                    </span>
                    {category.name}
                  </Button>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                {/* View Toggle */}
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-md"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-md"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {totalResults}
                </span>{" "}
                services found
                {searchQuery && (
                  <span>
                    {" "}
                    for "
                    <span className="font-semibold text-gray-900">
                      {searchQuery}
                    </span>
                    "
                  </span>
                )}
              </div>

              {appliedFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-orange-500 hover:text-orange-600"
                >
                  Clear all filters ({appliedFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div
              className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  {appliedFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Location Filter */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Location
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) =>
                        handleFilterChange("location", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">All Locations</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Price Range
                    </label>
                    <div className="px-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) =>
                          handleFilterChange("priceRange", value)
                        }
                        max={50000}
                        step={500}
                        className="mb-3"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatPrice(filters.priceRange[0])}</span>
                        <span>{formatPrice(filters.priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Minimum Rating
                    </label>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center cursor-pointer"
                        >
                          <Checkbox
                            checked={filters.rating === rating}
                            onCheckedChange={(checked) =>
                              handleFilterChange("rating", checked ? rating : 0)
                            }
                          />
                          <div className="ml-3 flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-700">
                              {rating}+
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Service Types */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Service Type
                    </label>
                    <div className="space-y-2">
                      {[
                        "homestay",
                        "hotel",
                        "restaurant",
                        "driver",
                        "event",
                      ].map((type) => (
                        <label
                          key={type}
                          className="flex items-center cursor-pointer"
                        >
                          <Checkbox
                            checked={filters.serviceType.includes(type)}
                            onCheckedChange={(checked) => {
                              const newTypes = checked
                                ? [...filters.serviceType, type]
                                : filters.serviceType.filter((t) => t !== type);
                              handleFilterChange("serviceType", newTypes);
                            }}
                          />
                          <span className="ml-3 text-sm text-gray-700 capitalize flex items-center">
                            <span className="text-lg mr-2">
                              {getServiceIcon(type)}
                            </span>
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Featured Only */}
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <Checkbox
                        checked={filters.featured}
                        onCheckedChange={(checked) =>
                          handleFilterChange("featured", checked)
                        }
                      />
                      <span className="ml-3 text-sm text-gray-700 flex items-center">
                        <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                        Featured only
                      </span>
                    </label>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Amenities
                    </label>
                    <div className="space-y-2">
                      {[
                        { key: "wifi", label: "Free WiFi", icon: Wifi },
                        { key: "parking", label: "Parking", icon: Car },
                        { key: "breakfast", label: "Breakfast", icon: Coffee },
                        {
                          key: "restaurant",
                          label: "Restaurant",
                          icon: Utensils,
                        },
                      ].map((amenity) => (
                        <label
                          key={amenity.key}
                          className="flex items-center cursor-pointer"
                        >
                          <Checkbox
                            checked={filters.amenities.includes(amenity.key)}
                            onCheckedChange={(checked) => {
                              const newAmenities = checked
                                ? [...filters.amenities, amenity.key]
                                : filters.amenities.filter(
                                    (a) => a !== amenity.key,
                                  );
                              handleFilterChange("amenities", newAmenities);
                            }}
                          />
                          <span className="ml-3 text-sm text-gray-700 flex items-center">
                            <amenity.icon className="h-4 w-4 mr-2 text-gray-500" />
                            {amenity.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Grid/List */}
            <div className="lg:col-span-3">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceClick(service)}
                      className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src={
                            service.primary_image_id ||
                            `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&sig=${service.id}`
                          }
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
                          <div
                            className={`${getRatingColor(service.average_rating)} text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center shadow-md`}
                          >
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {service.average_rating.toFixed(1)}
                          </div>

                          <div className="flex space-x-2">
                            {service.featured && (
                              <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
                                <Crown className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            <button className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md">
                              <Heart className="h-3.5 w-3.5 text-gray-600 hover:text-red-500" />
                            </button>
                          </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 flex items-center truncate">
                                <CheckCircle className="h-3 w-3 mr-1 text-green-500 flex-shrink-0" />
                                <span className="truncate">Available</span>
                              </span>
                              <span className="text-green-600 font-bold ml-2 flex-shrink-0">
                                {formatPrice(service.base_price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-500 transition-colors">
                              {service.name}
                            </h3>
                            <span className="text-lg">
                              {getServiceIcon(service.service_type)}
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>
                              {service.locations?.name || "Coastal Karnataka"}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">
                              {service.service_type}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {service.short_description || service.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {service.total_reviews} reviews
                            </span>
                            <span className="text-green-600 font-medium">
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
              ) : (
                // List View
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceClick(service)}
                      className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden"
                    >
                      <div className="flex">
                        {/* Image */}
                        <div className="w-64 aspect-[4/3] relative overflow-hidden flex-shrink-0">
                          <img
                            src={
                              service.primary_image_id ||
                              `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop&sig=${service.id}`
                            }
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          <div className="absolute top-3 left-3">
                            <div
                              className={`${getRatingColor(service.average_rating)} text-white px-2 py-1 rounded-full text-sm font-bold flex items-center`}
                            >
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              {service.average_rating.toFixed(1)}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex justify-between h-full">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-500 transition-colors">
                                  {service.name}
                                </h3>
                                {service.featured && (
                                  <Badge className="bg-orange-500 text-white">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center text-sm text-gray-500 mb-3">
                                <span className="text-lg mr-2">
                                  {getServiceIcon(service.service_type)}
                                </span>
                                <span className="capitalize">
                                  {service.service_type}
                                </span>
                                <span className="mx-2">•</span>
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>
                                  {service.locations?.name ||
                                    "Coastal Karnataka"}
                                </span>
                              </div>

                              <p className="text-gray-600 mb-4 line-clamp-2">
                                {service.short_description ||
                                  service.description}
                              </p>

                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  {service.total_reviews} reviews
                                </span>
                                <span className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Available today
                                </span>
                                <span className="flex items-center">
                                  <Shield className="h-4 w-4 mr-1" />
                                  Verified
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col justify-between items-end ml-6">
                              <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors mb-4">
                                <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                              </button>

                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                  {formatPrice(service.base_price)}
                                </div>
                                <div className="text-sm text-gray-500 mb-3">
                                  per{" "}
                                  {service.service_type === "homestay"
                                    ? "night"
                                    : "booking"}
                                </div>
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 font-medium rounded-lg transition-all duration-200 hover:shadow-md">
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMore && services.length > 0 && (
                <div className="text-center mt-12">
                  <Button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={searching}
                    variant="outline"
                    size="lg"
                    className="px-8 py-3"
                  >
                    {searching ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      <>
                        Load More Services
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* No Results */}
              {!loading && services.length === 0 && (
                <div className="text-center py-16">
                  <div className="mb-6">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No services found
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Try adjusting your search criteria or filters to find what
                      you're looking for.
                    </p>
                  </div>
                  <div className="space-x-4">
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                    <Button
                      onClick={() => navigate("/")}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Back to Home
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
