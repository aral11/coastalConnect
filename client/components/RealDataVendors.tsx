import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Heart, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface RealService {
  id: number;
  name: string;
  description: string;
  price: number;
  pricePerUnit: number;
  location: string;
  city: string;
  rating: number;
  reviews: number;
  image: string;
  vendor: {
    name: string;
    phone: string;
    id: number;
  };
  features: Record<string, any>;
  completedBookings: number;
  isFeatured: boolean;
}

interface RealDataVendorsProps {
  title?: string;
  subtitle?: string;
  serviceType: 'homestay' | 'restaurant' | 'driver';
  maxItems?: number;
  showFeatured?: boolean;
  city?: string;
  className?: string;
}

export default function RealDataVendors({
  title = "Popular Services",
  subtitle = "Top-rated in your area",
  serviceType,
  maxItems = 8,
  showFeatured = false,
  city = '',
  className = ''
}: RealDataVendorsProps) {
  const [services, setServices] = useState<RealService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchServices();
  }, [serviceType, maxItems, showFeatured, city]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        type: serviceType,
        limit: maxItems.toString()
      });

      if (showFeatured) {
        params.append('featured', 'true');
      }

      if (city) {
        params.append('city', city);
      }

      const response = await fetch(`/api/real/services?${params}`);
      const data = await response.json();

      if (data.success) {
        setServices(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError(error instanceof Error ? error.message : 'Failed to load services');
      
      // Fallback data for development
      const fallbackServices: RealService[] = [
        {
          id: 1,
          name: 'Sample Homestay',
          description: 'Beautiful beachside accommodation',
          price: 3500,
          pricePerUnit: 3500,
          location: 'Malpe, Udupi',
          city: 'Udupi',
          rating: 4.5,
          reviews: 23,
          image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
          vendor: { name: 'Demo Vendor', phone: '+91-9876543210', id: 1 },
          features: { rooms: 3, amenities: ['WiFi', 'AC'] },
          completedBookings: 45,
          isFeatured: true
        }
      ];
      
      setServices(serviceType === 'homestay' ? fallbackServices : []);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (serviceId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(serviceId)) {
        newFavorites.delete(serviceId);
      } else {
        newFavorites.add(serviceId);
      }
      return newFavorites;
    });
  };

  const getServiceIcon = () => {
    switch (serviceType) {
      case 'homestay': return '🏠';
      case 'restaurant': return '🍽️';
      case 'driver': return '🚗';
      default: return '⭐';
    }
  };

  const getServiceLink = (service: RealService) => {
    switch (serviceType) {
      case 'homestay': return `/homestays/${service.id}`;
      case 'restaurant': return `/restaurants/${service.id}`;
      case 'driver': return `/drivers/${service.id}`;
      default: return `/${serviceType}s/${service.id}`;
    }
  };

  const formatPrice = (price: number) => {
    if (serviceType === 'driver') {
      return `₹${price}/trip`;
    } else if (serviceType === 'restaurant') {
      return `₹${price}/person`;
    } else {
      return `₹${price}/night`;
    }
  };

  if (loading) {
    return (
      <section className={`py-12 lg:py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: maxItems }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0 && !error) {
    return (
      <section className={`py-12 lg:py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{getServiceIcon()}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {serviceType}s available
            </h3>
            <p className="text-gray-600">
              We're working on adding more services in your area.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 lg:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600">{subtitle}</p>
            {error && (
              <Badge variant="secondary" className="mt-2">
                Using fallback data
              </Badge>
            )}
          </div>
          
          <Link
            to={`/${serviceType}s`}
            className="hidden md:flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
                    }}
                  />
                  
                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(service.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.has(service.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>

                  {/* Featured badge */}
                  {service.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-orange-500 text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Quick stats overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span>{service.rating.toFixed(1)}</span>
                          <span className="text-gray-300">({service.reviews})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{service.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {service.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-500">
                      by {service.vendor.name}
                    </div>
                    <div className="text-sm text-green-600">
                      {service.completedBookings} bookings
                    </div>
                  </div>

                  {/* Features */}
                  {service.features && Object.keys(service.features).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {Object.entries(service.features).slice(0, 2).map(([key, value], index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {Array.isArray(value) ? value[0] : value}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-lg text-gray-900">
                      {formatPrice(service.price)}
                    </div>
                    
                    <Link to={getServiceLink(service)}>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button (Mobile) */}
        <div className="mt-8 text-center md:hidden">
          <Link to={`/${serviceType}s`}>
            <Button variant="outline" className="w-full">
              View All {serviceType}s
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Error retry */}
        {error && (
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              onClick={fetchServices}
              className="mx-auto"
            >
              Retry Loading
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
