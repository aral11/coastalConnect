import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ChevronLeft, ChevronRight, Heart, Bike, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { swiggyTheme } from '@/lib/swiggy-design-system';

interface Vendor {
  id: string;
  name: string;
  type: 'homestay' | 'restaurant' | 'driver' | 'creator' | 'service';
  image: string;
  rating: number;
  totalRatings: number;
  cuisine?: string;
  category: string;
  location: string;
  distance: number;
  responseTime?: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  offers?: string[];
  features: string[];
  isVegetarian?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  isFavorite?: boolean;
  promoted?: boolean;
  link: string;
}

interface SwiggyVendorsProps {
  title?: string;
  subtitle?: string;
  type?: 'all' | 'homestay' | 'restaurant' | 'driver' | 'creator' | 'service';
  showTitle?: boolean;
  maxItems?: number;
  className?: string;
}

export default function SwiggyVendors({
  title = "Popular near you",
  subtitle = "Trending in your area",
  type = 'all',
  showTitle = true,
  maxItems,
  className = ''
}: SwiggyVendorsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, [type, maxItems]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      let apiEndpoint = '/api';

      // Determine API endpoint based on vendor type
      switch (type) {
        case 'homestay':
          apiEndpoint = '/api/homestays';
          break;
        case 'restaurant':
          apiEndpoint = '/api/eateries';
          break;
        case 'driver':
          apiEndpoint = '/api/drivers';
          break;
        case 'creator':
          apiEndpoint = '/api/creators';
          break;
        default:
          // For 'all' type, we'll fetch a mix of vendors
          apiEndpoint = '/api/vendors/mixed';
          break;
      }

      const response = await fetch(apiEndpoint);

      if (response.ok) {
        const data = await response.json();

        // Transform API data to our Vendor interface
        let transformedVendors = transformApiData(data.data || [], type);

        // Limit items if maxItems is specified
        if (maxItems) {
          transformedVendors = transformedVendors.slice(0, maxItems);
        }

        setVendors(transformedVendors);
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      
      // Don't use fallback data in production - show empty state
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to match our Vendor interface
  const transformApiData = (apiData: any[], vendorType: string): Vendor[] => {
    return apiData.map((item, index) => {
      const baseVendor = {
        id: item.id?.toString() || `${vendorType}-${index}`,
        name: item.name || 'Unknown Vendor',
        rating: item.rating || 4.0,
        totalRatings: item.total_reviews || 0,
        location: item.location || 'Udupi',
        distance: Math.round((Math.random() * 5 + 0.5) * 10) / 10, // Simulated distance
        features: item.amenities ? item.amenities.split(', ').slice(0, 4) : ['Professional'],
        image: item.image_url || `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=300&fit=crop`
      };

      if (vendorType === 'homestay' || item.price_per_night) {
        return {
          ...baseVendor,
          type: 'homestay' as const,
          category: 'Homestay',
          price: item.price_per_night || 2500,
          link: `/homestays/${item.id || baseVendor.id}`
        };
      } else if (vendorType === 'restaurant' || item.cuisine_type) {
        return {
          ...baseVendor,
          type: 'restaurant' as const,
          category: item.cuisine_type || 'Restaurant',
          cuisine: item.cuisine_type,
          price: 300,
          responseTime: 25,
          link: `/eateries/${item.id || baseVendor.id}`
        };
      } else if (vendorType === 'driver' || item.vehicle_type) {
        return {
          ...baseVendor,
          type: 'driver' as const,
          category: 'Local Driver',
          price: item.hourly_rate || 15,
          link: `/drivers/${item.id || baseVendor.id}`
        };
      } else {
        return {
          ...baseVendor,
          type: 'creator' as const,
          category: 'Creator',
          price: 5000,
          link: `/creators/${item.id || baseVendor.id}`
        };
      }
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      const newScrollLeft = scrollRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const toggleFavorite = (vendorId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(vendorId)) {
        newFavorites.delete(vendorId);
      } else {
        newFavorites.add(vendorId);
      }
      return newFavorites;
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.0) return 'bg-green-500';
    if (rating >= 3.5) return 'bg-green-400';
    if (rating >= 3.0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatPrice = (vendor: Vendor) => {
    if (vendor.type === 'driver') {
      return `₹${vendor.price}/km`;
    }
    if (vendor.type === 'restaurant') {
      return `₹${vendor.price} for two`;
    }
    return `₹${vendor.price}/night`;
  };

  if (loading) {
    return (
      <section className={className}>
        <div className={swiggyTheme.layouts.container.xl}>
          {showTitle && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-gray-600">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-72 bg-gray-200 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      <div className={swiggyTheme.layouts.container.xl}>
        {/* Section Header */}
        {showTitle && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Desktop Navigation Arrows */}
            {vendors.length > 0 && (
              <div className="hidden lg:flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scroll('left')}
                  className="w-10 h-10 rounded-full p-0 border-gray-300 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scroll('right')}
                  className="w-10 h-10 rounded-full p-0 border-gray-300 hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Vendors Content */}
        {vendors.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No {type === 'all' ? 'services' : type + 's'} available yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Vendors are being added to the platform. Check back soon for authentic coastal Karnataka experiences!
            </p>
            <div className="mt-6">
              <Link
                to="/vendor-registration"
                className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
              >
                Become a Vendor
              </Link>
            </div>
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {vendors.map((vendor) => (
              <Link
                key={vendor.id}
                to={vendor.link}
                className="flex-shrink-0 group"
              >
                <div className={`
                  w-72 bg-white rounded-xl shadow-sm hover:shadow-lg
                  transition-all duration-200 overflow-hidden border border-gray-100
                  ${swiggyTheme.animations.hover.subtle}
                `}>
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {vendor.promoted && (
                        <Badge className="bg-orange-500 text-white text-xs font-semibold">
                          ⚡ Promoted
                        </Badge>
                      )}
                      {vendor.isNew && (
                        <Badge className="bg-green-500 text-white text-xs font-semibold">
                          NEW
                        </Badge>
                      )}
                      {vendor.isPopular && (
                        <Badge className="bg-red-500 text-white text-xs font-semibold">
                          🔥 Popular
                        </Badge>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(vendor.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.has(vendor.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </button>

                    {/* Discount Badge */}
                    {vendor.discount && (
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-green-500 text-white text-xs font-semibold">
                          {vendor.discount}% OFF
                        </Badge>
                      </div>
                    )}

                    {/* Response Time (for restaurants) */}
                    {vendor.responseTime && (
                      <div className="absolute bottom-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-600" />
                          <span className="text-xs font-medium text-gray-800">
                            {vendor.responseTime} mins
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Name and Rating */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors line-clamp-1">
                        {vendor.name}
                      </h3>
                      <div className={`
                        flex items-center space-x-1 px-2 py-1 rounded-full text-white text-xs font-semibold
                        ${getRatingColor(vendor.rating)}
                      `}>
                        <Star className="h-3 w-3 fill-current" />
                        <span>{vendor.rating}</span>
                      </div>
                    </div>

                    {/* Category and Cuisine */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-600">{vendor.category}</span>
                      {vendor.cuisine && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-600">{vendor.cuisine}</span>
                        </>
                      )}
                      {vendor.isVegetarian && (
                        <div className="w-4 h-4 border-2 border-green-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Location and Distance */}
                    <div className="flex items-center space-x-1 mb-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{vendor.location}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{vendor.distance} km</span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {vendor.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {vendor.features.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          +{vendor.features.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Offers */}
                    {vendor.offers && vendor.offers.length > 0 && (
                      <div className="flex items-center space-x-1 mb-3">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600 font-medium">
                          {vendor.offers[0]}
                        </span>
                        {vendor.offers.length > 1 && (
                          <span className="text-sm text-gray-500">
                            +{vendor.offers.length - 1} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price and Ratings */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(vendor)}
                        </span>
                        {vendor.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{vendor.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        ({vendor.totalRatings} reviews)
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* View All Card */}
            <Link
              to={`/${type === 'all' ? 'search' : type === 'restaurant' ? 'eateries' : type + 's'}`}
              className="flex-shrink-0 group"
            >
              <div className="w-72 h-full bg-white border-2 border-dashed border-orange-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-orange-400 hover:bg-orange-50 transition-colors duration-200">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <MapPin className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  View All
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Discover more {type === 'all' ? 'services' : type + 's'} in your area
                </p>
                <div className="text-sm font-medium text-orange-600 group-hover:text-orange-700">
                  Explore All →
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// Remove QuickVendors component as it relies on fallback data
export function QuickVendors({ type = 'all', maxItems = 3 }: { type?: string; maxItems?: number }) {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <div className="text-gray-400 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No services available</h3>
      <p className="text-gray-500">Services will appear here once vendors are approved</p>
    </div>
  );
}
