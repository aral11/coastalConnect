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
  deliveryTime?: number;
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

const SAMPLE_VENDORS: Vendor[] = [
  {
    id: 'mitra-homestay',
    name: 'Mitra Samudra Homestay',
    type: 'homestay',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
    rating: 4.5,
    totalRatings: 127,
    category: 'Beach View Homestay',
    location: 'Malpe Beach',
    distance: 2.3,
    price: 2500,
    originalPrice: 3000,
    discount: 17,
    offers: ['Free Breakfast', 'Beach Access'],
    features: ['AC', 'WiFi', 'Beach View', 'Parking'],
    isPopular: true,
    link: '/homestays/mitra-samudra'
  },
  {
    id: 'udupi-garden-restaurant',
    name: 'Udupi Garden Restaurant',
    type: 'restaurant',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    rating: 4.3,
    totalRatings: 89,
    cuisine: 'South Indian, Udupi',
    category: 'Vegetarian Restaurant',
    location: 'Udupi City',
    distance: 1.5,
    deliveryTime: 25,
    price: 200,
    offers: ['20% off', 'Free Delivery'],
    features: ['Pure Veg', 'Traditional', 'Family Dining'],
    isVegetarian: true,
    isNew: true,
    link: '/eateries/udupi-garden'
  },
  {
    id: 'rajesh-driver',
    name: 'Rajesh Kumar',
    type: 'driver',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    rating: 4.8,
    totalRatings: 156,
    category: 'Local Guide Driver',
    location: 'Manipal',
    distance: 0.8,
    price: 15,
    features: ['AC Car', 'English Speaking', 'Local Expert', 'GPS'],
    promoted: true,
    link: '/drivers/rajesh-kumar'
  },
  {
    id: 'coastal-clicks',
    name: 'Coastal Clicks Studio',
    type: 'creator',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    rating: 4.6,
    totalRatings: 43,
    category: 'Photography & Videography',
    location: 'Udupi',
    distance: 3.2,
    price: 5000,
    originalPrice: 6000,
    discount: 17,
    offers: ['Portfolio Included', 'Raw Files'],
    features: ['Professional', 'Drone Shots', 'Same Day Delivery'],
    link: '/creators/coastal-clicks'
  },
  {
    id: 'spice-coast-cafe',
    name: 'Spice Coast Cafe',
    type: 'restaurant',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
    rating: 4.4,
    totalRatings: 203,
    cuisine: 'Continental, Cafe',
    category: 'Cafe & Restaurant',
    location: 'Manipal',
    distance: 1.8,
    deliveryTime: 30,
    price: 350,
    offers: ['Happy Hours'],
    features: ['Outdoor Seating', 'WiFi', 'Live Music'],
    link: '/eateries/spice-coast-cafe'
  },
  {
    id: 'silver-sands-homestay',
    name: 'Silver Sands Villa',
    type: 'homestay',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
    rating: 4.7,
    totalRatings: 98,
    category: 'Luxury Villa',
    location: 'Kaup Beach',
    distance: 5.1,
    price: 4500,
    originalPrice: 5500,
    discount: 18,
    offers: ['Pool Access', 'Complimentary Dinner'],
    features: ['Private Pool', 'Beach Access', 'Garden', 'BBQ'],
    promoted: true,
    link: '/homestays/silver-sands-villa'
  }
];

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

  useEffect(() => {
    // Filter vendors by type if specified
    let filteredVendors = type === 'all' 
      ? SAMPLE_VENDORS 
      : SAMPLE_VENDORS.filter(vendor => vendor.type === type);
    
    // Limit items if maxItems is specified
    if (maxItems) {
      filteredVendors = filteredVendors.slice(0, maxItems);
    }

    setVendors(filteredVendors);
  }, [type, maxItems]);

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

  return (
    <section className={`${className}`}>
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
          </div>
        )}

        {/* Vendors Scroll Container */}
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

                  {/* Delivery Time (for restaurants) */}
                  {vendor.deliveryTime && (
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-600" />
                        <span className="text-xs font-medium text-gray-800">
                          {vendor.deliveryTime} mins
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
      </div>
    </section>
  );
}

// Quick Vendors Component (compact version)
export function QuickVendors({ type = 'all', maxItems = 3 }: { type?: string; maxItems?: number }) {
  const vendors = SAMPLE_VENDORS.slice(0, maxItems);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vendors.map((vendor) => (
        <Link
          key={vendor.id}
          to={vendor.link}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
        >
          <div className="relative h-32">
            <img
              src={vendor.image}
              alt={vendor.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <div className={`
                flex items-center space-x-1 px-2 py-1 rounded-full text-white text-xs font-semibold
                ${getRatingColor(vendor.rating)}
              `}>
                <Star className="h-3 w-3 fill-current" />
                <span>{vendor.rating}</span>
              </div>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
              {vendor.name}
            </h3>
            <div className="text-sm text-gray-600 mb-2">{vendor.category}</div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                {formatPrice(vendor)}
              </span>
              <span className="text-xs text-gray-500">
                {vendor.distance} km
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function getRatingColor(rating: number) {
  if (rating >= 4.0) return 'bg-green-500';
  if (rating >= 3.5) return 'bg-green-400';
  if (rating >= 3.0) return 'bg-yellow-500';
  return 'bg-red-500';
}

function formatPrice(vendor: Vendor) {
  if (vendor.type === 'driver') {
    return `₹${vendor.price}/km`;
  }
  if (vendor.type === 'restaurant') {
    return `₹${vendor.price} for two`;
  }
  return `₹${vendor.price}/night`;
}
