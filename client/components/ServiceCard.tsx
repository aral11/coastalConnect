import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Heart, 
  Share2, 
  MapPin, 
  IndianRupee, 
  Clock,
  Users,
  Car,
  Utensils,
  Wifi,
  Camera,
  CheckCircle,
  Award,
  Navigation,
  Phone
} from 'lucide-react';
import { patterns, animations, utils } from '@/lib/design-system';

interface ServiceItem {
  id: number;
  name: string;
  description?: string;
  location: string;
  rating?: number;
  total_reviews?: number;
  image_url?: string;
  price?: number;
  type: 'homestay' | 'eatery' | 'driver' | 'creator' | 'event';
  
  // Type-specific fields
  price_per_night?: number;
  hourly_rate?: number;
  price_range?: number;
  vehicle_type?: string;
  cuisine_type?: string;
  specialty?: string;
  
  // Features/amenities
  features?: string[];
  availability?: {
    available: boolean;
    estimated_arrival?: number;
  };
  
  // Special indicators
  trending?: boolean;
  featured?: boolean;
  offers?: Array<{
    type: string;
    description: string;
    discount: number;
  }>;
}

interface ServiceCardProps {
  item: ServiceItem;
  onFavorite?: (id: number) => void;
  onShare?: (item: ServiceItem) => void;
  onBook?: (item: ServiceItem) => void;
  isFavorited?: boolean;
  showDistance?: boolean;
  distance?: number;
  className?: string;
}

export default function ServiceCard({
  item,
  onFavorite,
  onShare,
  onBook,
  isFavorited = false,
  showDistance = false,
  distance,
  className = ''
}: ServiceCardProps) {
  
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-50';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'South Indian': 'bg-orange-100 text-orange-800',
      'North Indian': 'bg-red-100 text-red-800',
      'Chinese': 'bg-yellow-100 text-yellow-800',
      'Seafood': 'bg-blue-100 text-blue-800',
      'Sedan': 'bg-blue-100 text-blue-800',
      'SUV': 'bg-green-100 text-green-800',
      'Photography': 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriceDisplay = () => {
    switch (item.type) {
      case 'homestay':
        return {
          amount: item.price_per_night || item.price || 2500,
          unit: '/night'
        };
      case 'driver':
        return {
          amount: item.hourly_rate || item.price || 350,
          unit: '/hour'
        };
      case 'eatery':
        return {
          amount: item.price_range || item.price || 450,
          unit: 'for two'
        };
      default:
        return {
          amount: item.price || 0,
          unit: ''
        };
    }
  };

  const getActionText = () => {
    switch (item.type) {
      case 'homestay': return 'Book Now';
      case 'eatery': return 'Reserve Table';
      case 'driver': return item.availability?.available ? 'Book Now' : 'Currently Busy';
      case 'creator': return 'View Profile';
      case 'event': return 'Get Tickets';
      default: return 'View Details';
    }
  };

  const getFeatureIcons = () => {
    const iconMap = {
      'WiFi': <Wifi className="h-3 w-3" />,
      'Parking': <Car className="h-3 w-3" />,
      'Delivery': <Utensils className="h-3 w-3" />,
      'AC': <CheckCircle className="h-3 w-3" />,
      'GPS': <Navigation className="h-3 w-3" />,
      'Music': <Camera className="h-3 w-3" />,
    };
    
    return item.features?.slice(0, 3).map((feature) => ({
      name: feature,
      icon: iconMap[feature as keyof typeof iconMap] || <CheckCircle className="h-3 w-3" />
    })) || [];
  };

  const priceDisplay = getPriceDisplay();
  const featureIcons = getFeatureIcons();

  return (
    <Card className={utils.cn(
      patterns.card.product,
      animations.transition.normal,
      animations.shadow.medium,
      className
    )}>
      <div className="relative">
        <img
          src={item.image_url || `https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop`}
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          {onFavorite && (
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                onFavorite(item.id);
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          )}
          {onShare && (
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                onShare(item);
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item.trending && (
            <Badge className="bg-red-600 text-white border-0">
              🔥 Trending
            </Badge>
          )}
          {item.featured && (
            <Badge className="bg-yellow-600 text-white border-0">
              <Award className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {item.offers && item.offers.length > 0 && (
            <Badge className="bg-green-600 text-white border-0">
              {item.offers[0].discount}% OFF
            </Badge>
          )}
          {item.availability?.available === false && item.type === 'driver' && (
            <Badge className="bg-yellow-500 text-white border-0">
              <Clock className="h-3 w-3 mr-1" />
              Busy
            </Badge>
          )}
          {item.availability?.available && item.type === 'driver' && (
            <Badge className="bg-green-500 text-white border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              Available
            </Badge>
          )}
        </div>

        {/* Distance/Additional Info */}
        {(showDistance && distance) || item.availability?.estimated_arrival && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="bg-black/50 text-white border-0">
              {showDistance && distance ? (
                <>
                  <Navigation className="h-3 w-3 mr-1" />
                  {distance}km away
                </>
              ) : item.availability?.estimated_arrival ? (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  {item.availability.estimated_arrival} mins
                </>
              ) : (
                <>
                  <Camera className="h-3 w-3 mr-1" />
                  Photos
                </>
              )}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="space-y-3">
          {/* Rating & Type */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(item.rating || 4.5)}`}>
                <Star className="h-3 w-3 fill-current" />
                {item.rating || '4.5'}
              </div>
              <span className="text-xs text-gray-500">
                ({item.total_reviews || 156} reviews)
              </span>
            </div>
            {(item.cuisine_type || item.vehicle_type || item.specialty) && (
              <Badge className={getTypeColor(item.cuisine_type || item.vehicle_type || item.specialty || '')}>
                {item.cuisine_type || item.vehicle_type || item.specialty}
              </Badge>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {item.description || 'Experience authentic local hospitality and comfort'}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            {item.location}
          </div>

          {/* Features/Amenities */}
          {featureIcons.length > 0 && (
            <div className="flex items-center gap-3">
              {featureIcons.map((feature, index) => (
                <div key={index} className="flex items-center gap-1 text-xs text-gray-500">
                  {feature.icon}
                  {feature.name}
                </div>
              ))}
            </div>
          )}

          {/* Special Features for specific types */}
          {item.type === 'driver' && item.availability?.estimated_arrival && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Arrives in {item.availability.estimated_arrival} minutes
            </div>
          )}

          {/* Price & Booking */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <IndianRupee className="h-4 w-4 text-gray-700" />
              <span className="font-bold text-lg text-gray-900">
                {priceDisplay.amount}
              </span>
              <span className="text-sm text-gray-500">{priceDisplay.unit}</span>
            </div>
            
            {onBook && (
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  onBook(item);
                }}
                disabled={item.type === 'driver' && item.availability?.available === false}
                className="bg-blue-600 hover:bg-blue-700 px-6"
              >
                {getActionText()}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton for ServiceCard
export function ServiceCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <Card className={utils.cn('overflow-hidden animate-pulse', className)}>
      <div className="h-48 bg-gray-200"></div>
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-9 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Grid container for service cards
export function ServiceGrid({ 
  children, 
  loading = false, 
  loadingCount = 6,
  className = '' 
}: { 
  children?: React.ReactNode;
  loading?: boolean;
  loadingCount?: number;
  className?: string;
}) {
  if (loading) {
    return (
      <div className={utils.cn('grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6', className)}>
        {Array.from({ length: loadingCount }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={utils.cn('grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6', className)}>
      {children}
    </div>
  );
}
