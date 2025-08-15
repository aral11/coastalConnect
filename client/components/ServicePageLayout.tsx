import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import SearchSection from "@/components/SearchSection";
import SearchAndFilter from "@/components/SearchAndFilter";
import ServiceCard, { ServiceGrid } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Grid,
  List,
  Filter,
  ArrowUpDown,
  MapPin,
  Star,
  Clock,
  Users,
} from "lucide-react";
import { layouts } from "@/lib/design-system";

interface ServiceItem {
  id: number;
  name: string;
  description?: string;
  location: string;
  rating?: number;
  total_reviews?: number;
  image_url?: string;
  price?: number;
  type: "homestay" | "eatery" | "driver" | "creator" | "event";
  [key: string]: any; // Allow additional properties
}

interface ServicePageLayoutProps {
  // Page configuration
  title: string;
  description: string;
  icon: React.ReactNode;
  serviceType: "homestay" | "eatery" | "driver" | "creator" | "event";

  // Data and state
  items: ServiceItem[];
  loading: boolean;
  error: string | null;

  // Search and filtering
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  searchPlaceholder?: string;

  // Filtering
  showFilters?: boolean;
  filtersActive?: boolean;
  onFiltersToggle?: () => void;
  filterCategories?: Array<{ id: string; name: string; count: number }>;
  filterLocations?: Array<{ id: string; name: string; count: number }>;
  filterAmenities?: Array<{ id: string; name: string }>;
  onFilterChange?: (filters: any) => void;

  // Actions
  onItemAction?: (item: ServiceItem) => void;
  onFavorite?: (id: number) => void;
  onShare?: (item: ServiceItem) => void;
  favorites?: number[];

  // Additional features
  showStats?: boolean;
  statsData?: Array<{ icon: React.ReactNode; label: string; value: string }>;

  // Error handling
  onRefresh?: () => void;

  // View options
  allowViewModeToggle?: boolean;
  allowSorting?: boolean;
  sortOptions?: Array<{ value: string; label: string }>;
  onSortChange?: (sortBy: string) => void;
}

export default function ServicePageLayout({
  title,
  description,
  icon,
  serviceType,
  items,
  loading,
  error,
  searchQuery,
  onSearchChange,
  onSearch,
  searchPlaceholder = "Search...",
  showFilters = true,
  filtersActive = false,
  onFiltersToggle,
  filterCategories = [],
  filterLocations = [],
  filterAmenities = [],
  onFilterChange,
  onItemAction,
  onFavorite,
  onShare,
  favorites = [],
  showStats = true,
  statsData = [],
  onRefresh,
  allowViewModeToggle = true,
  allowSorting = true,
  sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "rating", label: "Highest Rated" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "distance", label: "Distance" },
  ],
  onSortChange,
}: ServicePageLayoutProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentSort, setCurrentSort] = useState("recommended");

  // Default stats based on service type
  const defaultStats = {
    homestay: [
      {
        icon: <MapPin className="h-4 w-4" />,
        label: "Verified Homestays",
        value: `${items.length}+`,
      },
      {
        icon: <Star className="h-4 w-4" />,
        label: "Average Rating",
        value: "4.8★",
      },
      {
        icon: <Users className="h-4 w-4" />,
        label: "Happy Guests",
        value: "10k+",
      },
    ],
    eatery: [
      {
        icon: <MapPin className="h-4 w-4" />,
        label: "Restaurants",
        value: `${items.length}+`,
      },
      {
        icon: <Star className="h-4 w-4" />,
        label: "Verified Reviews",
        value: "25k+",
      },
      {
        icon: <Clock className="h-4 w-4" />,
        label: "Delivery Available",
        value: "80%",
      },
    ],
    driver: [
      {
        icon: <MapPin className="h-4 w-4" />,
        label: "Verified Drivers",
        value: `${items.length}+`,
      },
      {
        icon: <Star className="h-4 w-4" />,
        label: "Safety Rating",
        value: "4.9★",
      },
      {
        icon: <Clock className="h-4 w-4" />,
        label: "24/7 Available",
        value: "Yes",
      },
    ],
    creator: [
      {
        icon: <MapPin className="h-4 w-4" />,
        label: "Local Creators",
        value: `${items.length}+`,
      },
      {
        icon: <Star className="h-4 w-4" />,
        label: "Portfolio Rating",
        value: "4.8★",
      },
      {
        icon: <Users className="h-4 w-4" />,
        label: "Projects Done",
        value: "500+",
      },
    ],
    event: [
      {
        icon: <MapPin className="h-4 w-4" />,
        label: "Upcoming Events",
        value: `${items.length}+`,
      },
      {
        icon: <Star className="h-4 w-4" />,
        label: "Event Rating",
        value: "4.7★",
      },
      {
        icon: <Users className="h-4 w-4" />,
        label: "Attendees",
        value: "50k+",
      },
    ],
  };

  const currentStats =
    statsData.length > 0 ? statsData : defaultStats[serviceType];

  const handleItemAction = (item: ServiceItem) => {
    if (
      !isAuthenticated &&
      (serviceType === "homestay" ||
        serviceType === "driver" ||
        serviceType === "eatery")
    ) {
      navigate("/login");
      return;
    }

    if (onItemAction) {
      onItemAction(item);
    }
  };

  const handleSortChange = (value: string) => {
    setCurrentSort(value);
    if (onSortChange) {
      onSortChange(value);
    }
  };

  const handleShare = (item: ServiceItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `Check out ${item.name} on coastalConnect!`,
        url: `${window.location.origin}/${serviceType}s/${item.id}`,
      });
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/${serviceType}s/${item.id}`,
      );
      // You could show a toast here
    }

    if (onShare) {
      onShare(item);
    }
  };

  // Error state
  if (error) {
    return (
      <Layout>
        <PageHeader title={title} description={description} icon={icon} />
        <div className={layouts.container}>
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
                <p className="font-medium">Failed to load {serviceType}s</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
              {onRefresh && (
                <Button onClick={onRefresh} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout fullWidth>
      <PageHeader
        title={title}
        description={description}
        icon={icon}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: title.replace("Udupi ", "").replace("Local ", "") },
        ]}
      >
        {showStats && currentStats && (
          <div className="flex justify-center items-center mt-6 space-x-6 text-sm text-blue-100">
            {currentStats.map((stat, index) => (
              <span key={index} className="flex items-center">
                {stat.icon}
                <span className="ml-1">
                  {stat.value} {stat.label}
                </span>
              </span>
            ))}
          </div>
        )}
      </PageHeader>

      <SearchSection
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        placeholder={searchPlaceholder}
        showFilters={showFilters}
        onFiltersClick={onFiltersToggle}
        filtersActive={filtersActive}
      >
        {filtersActive && onFilterChange && (
          <SearchAndFilter
            onSearchChange={onFilterChange}
            categories={filterCategories}
            locations={filterLocations}
            amenities={filterAmenities}
            loading={loading}
            resultCount={items.length}
          />
        )}
      </SearchSection>

      <main className="bg-white">
        <div className={layouts.container}>
          <div className="py-8">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading
                    ? "Loading..."
                    : `${items.length} ${title.replace("Udupi ", "").replace("Local ", "")} Found`}
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing {serviceType}s in Udupi, Manipal, and nearby areas
                </p>
              </div>

              {!loading && items.length > 0 && (
                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  {allowViewModeToggle && (
                    <div className="hidden lg:flex items-center gap-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Sort Dropdown */}
                  {allowSorting && (
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-gray-500" />
                      <select
                        value={currentSort}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Service Items Grid */}
            <ServiceGrid
              loading={loading}
              loadingCount={6}
              className={viewMode === "list" ? "grid-cols-1" : undefined}
            >
              {!loading &&
                items.map((item) => (
                  <ServiceCard
                    key={item.id}
                    item={{
                      ...item,
                      type: serviceType,
                      features:
                        item.features || extractFeatures(item, serviceType),
                      availability:
                        item.availability || getAvailability(item, serviceType),
                    }}
                    onFavorite={onFavorite}
                    onShare={handleShare}
                    onBook={handleItemAction}
                    isFavorited={favorites.includes(item.id)}
                    showDistance={true}
                    distance={
                      item.distance || Math.floor(Math.random() * 15) + 1
                    }
                  />
                ))}
            </ServiceGrid>

            {/* Empty State */}
            {!loading && items.length === 0 && (
              <div className="text-center py-16">
                {icon && (
                  <div className="h-16 w-16 text-gray-300 mx-auto mb-4">
                    {icon}
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {serviceType}s found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or check back later.
                </p>
                {onRefresh && (
                  <Button onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Results
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}

// Helper functions
function extractFeatures(item: any, serviceType: string): string[] {
  const features: string[] = [];

  switch (serviceType) {
    case "homestay":
      if (item.amenities?.includes("WiFi") || item.wifi_available)
        features.push("WiFi");
      if (item.amenities?.includes("Parking") || item.has_parking)
        features.push("Parking");
      if (item.amenities?.includes("AC") || item.ac_available)
        features.push("AC");
      break;

    case "eatery":
      if (item.wifi_available) features.push("WiFi");
      if (item.has_parking) features.push("Parking");
      if (item.delivery_available) features.push("Delivery");
      if (item.takeaway_available) features.push("Takeaway");
      break;

    case "driver":
      if (item.ac_available) features.push("AC");
      if (item.gps_enabled) features.push("GPS");
      if (item.music_system) features.push("Music");
      break;
  }

  return features;
}

function getAvailability(
  item: any,
  serviceType: string,
): { available: boolean; estimated_arrival?: number } {
  if (serviceType === "driver") {
    return {
      available: item.is_available !== false,
      estimated_arrival:
        item.estimated_arrival ||
        (item.is_available ? Math.floor(Math.random() * 15) + 5 : undefined),
    };
  }

  return { available: true };
}
