/**
 * Modern Services Listing Page - Swiggy/Zomato Style
 * Real-time filtering and search with Supabase
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  getServices,
  getServiceCategories,
  getLocations,
  searchServices,
  trackEvent,
  subscribeToServices,
  SupabaseService,
  SupabaseCategory,
  SupabaseLocation
} from '@/lib/supabase';
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
  Loader2
} from 'lucide-react';

interface Filters {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  location: string;
  serviceType: string[];
  featured: boolean;
  availability: 'all' | 'available' | 'unavailable';
}

type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'popular';
type ViewMode = 'grid' | 'list';

export default function ModernServices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL-driven state
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialLocation = searchParams.get('location') || '';
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Filters>({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: [0, 50000],
    rating: 0,
    location: initialLocation,
    serviceType: [],
    featured: false,
    availability: 'all'
  });
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

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
    setupRealTimeSubscriptions();
  }, []);

  useEffect(() => {
    performSearch();
  }, [searchQuery, filters, sortBy, currentPage]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, locationsData] = await Promise.all([
        getServiceCategories(),
        getLocations()
      ]);

      setCategories(categoriesData || []);
      setLocations(locationsData || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const setupRealTimeSubscriptions = () => {
    const subscription = subscribeToServices((payload) => {
      console.log('Services updated:', payload);
      // Refresh current search when data changes
      performSearch();
    });

    return () => {
      subscription.unsubscribe();
    };
  };

  const performSearch = async () => {
    try {
      setSearching(true);
      
      // Track search
      await trackEvent('services_search', {
        query: searchQuery,
        filters,
        sort: sortBy,
        page: currentPage,
        user_id: user?.id
      });

      let results: SupabaseService[] = [];

      if (searchQuery.trim()) {
        // Use search function for queries
        results = await searchServices(searchQuery, {
          type: filters.serviceType.length > 0 ? filters.serviceType[0] : undefined,
          location_id: filters.location || undefined,
          min_price: filters.priceRange[0],
          max_price: filters.priceRange[1],
          min_rating: filters.rating
        });
      } else {
        // Use regular getServices for browsing
        results = await getServices({
          type: filters.serviceType.length > 0 ? filters.serviceType[0] : undefined,
          location_id: filters.location || undefined,
          status: 'approved',
          featured: filters.featured || undefined,
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage
        });
      }

      // Apply additional filters
      let filteredResults = results || [];

      // Filter by categories
      if (filters.categories.length > 0) {
        filteredResults = filteredResults.filter(service => 
          filters.categories.includes(service.category_id || '')
        );
      }

      // Filter by price range
      filteredResults = filteredResults.filter(service => 
        service.base_price >= filters.priceRange[0] && 
        service.base_price <= filters.priceRange[1]
      );

      // Filter by rating
      if (filters.rating > 0) {
        filteredResults = filteredResults.filter(service => 
          service.average_rating >= filters.rating
        );
      }

      // Sort results
      filteredResults = sortServices(filteredResults, sortBy);

      if (currentPage === 1) {
        setServices(filteredResults);
      } else {
        setServices(prev => [...prev, ...filteredResults]);
      }

      setTotalResults(filteredResults.length);
      setHasMore(filteredResults.length === itemsPerPage);

    } catch (error) {
      console.error('Error searching services:', error);
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  const sortServices = (services: SupabaseService[], sortOption: SortOption): SupabaseService[] => {
    const sorted = [...services];
    
    switch (sortOption) {
      case 'price_low':
        return sorted.sort((a, b) => a.base_price - b.base_price);
      case 'price_high':
        return sorted.sort((a, b) => b.base_price - a.base_price);
      case 'rating':
        return sorted.sort((a, b) => b.average_rating - a.average_rating);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'popular':
        return sorted.sort((a, b) => b.total_reviews - a.total_reviews);
      case 'relevance':
      default:
        return sorted;
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('q', value);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleServiceClick = async (service: SupabaseService) => {
    await trackEvent('service_detail_click', {
      service_id: service.id,
      service_name: service.name,
      service_type: service.service_type,
      from_page: 'services_listing',
      user_id: user?.id
    });

    navigate(`/service/${service.id}`);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 50000],
      rating: 0,
      location: '',
      serviceType: [],
      featured: false,
      availability: 'all'
    });
    setCurrentPage(1);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) count++;
    if (filters.rating > 0) count++;
    if (filters.location) count++;
    if (filters.serviceType.length > 0) count++;
    if (filters.featured) count++;
    if (filters.availability !== 'all') count++;
    return count;
  }, [filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search services, locations, or providers..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>
                {totalResults} services found
                {searchQuery && ` for "${searchQuery}"`}
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <Checkbox
                          checked={filters.categories.includes(category.id)}
                          onCheckedChange={(checked) => {
                            const newCategories = checked
                              ? [...filters.categories, category.id]
                              : filters.categories.filter(id => id !== category.id);
                            handleFilterChange({ categories: newCategories });
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange({ priceRange: value as [number, number] })}
                      max={50000}
                      step={500}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{filters.priceRange[0].toLocaleString()}</span>
                      <span>₹{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <Checkbox
                          checked={filters.rating === rating}
                          onCheckedChange={(checked) => {
                            handleFilterChange({ rating: checked ? rating : 0 });
                          }}
                        />
                        <div className="ml-2 flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-700">{rating}+ stars</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange({ location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Type */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Service Type</h4>
                  <div className="space-y-2">
                    {['homestay', 'restaurant', 'driver', 'event_services'].map((type) => (
                      <label key={type} className="flex items-center">
                        <Checkbox
                          checked={filters.serviceType.includes(type)}
                          onCheckedChange={(checked) => {
                            const newTypes = checked
                              ? [...filters.serviceType, type]
                              : filters.serviceType.filter(t => t !== type);
                            handleFilterChange({ serviceType: newTypes });
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{type.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Featured */}
                <div>
                  <label className="flex items-center">
                    <Checkbox
                      checked={filters.featured}
                      onCheckedChange={(checked) => handleFilterChange({ featured: !!checked })}
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured only</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {services.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="text-orange-500 border-orange-500 hover:bg-orange-50"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Services Grid/List */}
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      viewMode={viewMode}
                      onClick={() => handleServiceClick(service)}
                    />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={searching}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
                    >
                      {searching ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        'Load More Services'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Service Card Component
function ServiceCard({ 
  service, 
  viewMode, 
  onClick 
}: { 
  service: SupabaseService; 
  viewMode: ViewMode; 
  onClick: () => void; 
}) {
  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await trackEvent('service_favorited', {
      service_id: service.id,
      service_name: service.name
    });
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
      >
        <div className="flex gap-6">
          <div className="w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={service.primary_image_id || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop'}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{service.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{service.service_type}</p>
              </div>
              <button onClick={handleFavorite} className="text-gray-400 hover:text-red-500">
                <Heart className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-3 line-clamp-2">
              {service.short_description || service.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{service.locations?.name || 'Coastal Karnataka'}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                  <span>{service.average_rating.toFixed(1)} ({service.total_reviews})</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-semibold text-gray-900">
                  ₹{service.base_price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  per {service.service_type === 'homestay' ? 'night' : 'booking'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={service.primary_image_id || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop'}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white text-gray-900 border-0 shadow-sm">
            <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
            {service.average_rating.toFixed(1)}
          </Badge>
        </div>
        <button 
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors mb-1">
            {service.name}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{service.service_type}</p>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {service.short_description || service.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{service.locations?.name || 'Coastal Karnataka'}</span>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-900">
              ₹{service.base_price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              per {service.service_type === 'homestay' ? 'night' : 'booking'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
