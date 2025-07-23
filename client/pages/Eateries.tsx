import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import SearchAndFilter from '@/components/SearchAndFilter';
import BookingFlow from '@/components/BookingFlow';
import { designSystem, layouts, statusColors } from '@/lib/design-system';
import { 
  MapPin, 
  Star, 
  ArrowLeft,
  Clock,
  IndianRupee,
  Phone,
  Utensils,
  ExternalLink,
  Heart,
  Share2,
  Calendar,
  Loader2,
  Users,
  Wifi,
  Car,
  CreditCard,
  Camera,
  Bookmark,
  ShoppingBag,
  Navigation,
  Zap,
  Award,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';

interface Eatery {
  id: number;
  name: string;
  description?: string;
  location: string;
  address?: string;
  cuisine_type?: string;
  rating?: number;
  total_reviews?: number;
  phone?: string;
  opening_hours?: string;
  price_range?: number;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
  featured?: boolean;
  delivery_available?: boolean;
  takeaway_available?: boolean;
  seating_capacity?: number;
  has_parking?: boolean;
  wifi_available?: boolean;
  accepts_cards?: boolean;
  live_music?: boolean;
  outdoor_seating?: boolean;
  family_friendly?: boolean;
  bar_available?: boolean;
  pure_veg?: boolean;
  halal_certified?: boolean;
  distance?: number;
  offers?: Array<{
    type: string;
    description: string;
    discount: number;
  }>;
  timings?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  popular_dishes?: string[];
  safety_measures?: string[];
}

export default function EateriesModern() {
  const [eateries, setEateries] = useState<Eatery[]>([]);
  const [filteredEateries, setFilteredEateries] = useState<Eatery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEatery, setSelectedEatery] = useState<Eatery | null>(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for search filters
  const categories = [
    { id: 'south_indian', name: 'South Indian', count: 45 },
    { id: 'north_indian', name: 'North Indian', count: 23 },
    { id: 'chinese', name: 'Chinese', count: 18 },
    { id: 'continental', name: 'Continental', count: 12 },
    { id: 'seafood', name: 'Seafood', count: 34 },
    { id: 'vegetarian', name: 'Vegetarian', count: 56 },
    { id: 'fast_food', name: 'Fast Food', count: 28 },
    { id: 'desserts', name: 'Desserts', count: 15 }
  ];

  const locations = [
    { id: 'udupi', name: 'Udupi', count: 67 },
    { id: 'manipal', name: 'Manipal', count: 89 },
    { id: 'malpe', name: 'Malpe', count: 23 },
    { id: 'kaup', name: 'Kaup', count: 12 },
    { id: 'kundapur', name: 'Kundapur', count: 34 }
  ];

  const amenities = [
    { id: 'wifi', name: 'Free WiFi' },
    { id: 'parking', name: 'Parking Available' },
    { id: 'cards', name: 'Cards Accepted' },
    { id: 'outdoor', name: 'Outdoor Seating' },
    { id: 'delivery', name: 'Home Delivery' },
    { id: 'takeaway', name: 'Takeaway' },
    { id: 'bar', name: 'Bar Available' },
    { id: 'live_music', name: 'Live Music' },
    { id: 'family', name: 'Family Friendly' },
    { id: 'pure_veg', name: 'Pure Vegetarian' },
    { id: 'halal', name: 'Halal Certified' }
  ];

  useEffect(() => {
    fetchEateries();
    loadFavorites();
  }, []);

  const fetchEateries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/eateries');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Enhance eateries with additional mock data for demo
        const enhancedEateries = data.data.map((eatery: Eatery) => ({
          ...eatery,
          rating: eatery.rating || (3.5 + Math.random() * 1.5), // Random rating between 3.5-5
          total_reviews: eatery.total_reviews || Math.floor(Math.random() * 500) + 50,
          delivery_available: Math.random() > 0.3,
          takeaway_available: Math.random() > 0.2,
          has_parking: Math.random() > 0.4,
          wifi_available: Math.random() > 0.6,
          accepts_cards: Math.random() > 0.3,
          outdoor_seating: Math.random() > 0.5,
          family_friendly: Math.random() > 0.2,
          pure_veg: Math.random() > 0.4,
          distance: Math.round((Math.random() * 10 + 0.5) * 10) / 10, // Distance in km
          offers: Math.random() > 0.6 ? [
            {
              type: 'discount',
              description: '20% off on orders above ₹500',
              discount: 20
            }
          ] : [],
          popular_dishes: ['Masala Dosa', 'Idli Sambar', 'Mangalore Buns', 'Fish Curry'].slice(0, Math.floor(Math.random() * 3) + 1),
          safety_measures: ['Sanitized Dining', 'Contactless Menu', 'Staff Vaccinated']
        }));
        
        setEateries(enhancedEateries);
        setFilteredEateries(enhancedEateries);
      } else {
        setError(data.message || 'Failed to fetch eateries');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Network error: ${errorMessage}`);
      console.error('Error fetching eateries:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('coastalConnect_favorites_eateries');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (eateryId: number) => {
    const newFavorites = favorites.includes(eateryId)
      ? favorites.filter(id => id !== eateryId)
      : [...favorites, eateryId];
    
    setFavorites(newFavorites);
    localStorage.setItem('coastalConnect_favorites_eateries', JSON.stringify(newFavorites));
  };

  const handleSearchChange = (filters: any) => {
    let filtered = [...eateries];

    // Apply search query
    if (filters.query) {
      filtered = filtered.filter(eatery => 
        eatery.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        eatery.cuisine_type?.toLowerCase().includes(filters.query.toLowerCase()) ||
        eatery.description?.toLowerCase().includes(filters.query.toLowerCase())
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(eatery => 
        eatery.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(eatery => 
        eatery.cuisine_type?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Apply price range filter
    if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000)) {
      filtered = filtered.filter(eatery => {
        const price = (eatery.price_range || 500); // Default price if not set
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(eatery => (eatery.rating || 0) >= filters.rating);
    }

    // Apply amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(eatery => {
        return filters.amenities.some((amenity: string) => {
          switch (amenity) {
            case 'wifi': return eatery.wifi_available;
            case 'parking': return eatery.has_parking;
            case 'cards': return eatery.accepts_cards;
            case 'outdoor': return eatery.outdoor_seating;
            case 'delivery': return eatery.delivery_available;
            case 'takeaway': return eatery.takeaway_available;
            case 'bar': return eatery.bar_available;
            case 'family': return eatery.family_friendly;
            case 'pure_veg': return eatery.pure_veg;
            case 'halal': return eatery.halal_certified;
            default: return false;
          }
        });
      });
    }

    // Apply availability filter
    if (filters.availability) {
      filtered = filtered.filter(eatery => eatery.is_active);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price_low':
        filtered.sort((a, b) => (a.price_range || 0) - (b.price_range || 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.price_range || 0) - (a.price_range || 0));
        break;
      case 'distance':
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default: // relevance
        // Keep original order
        break;
    }

    setFilteredEateries(filtered);
  };

  const handleBookNow = (eatery: Eatery) => {
    setSelectedEatery(eatery);
    setShowBookingFlow(true);
  };

  const handleBookingComplete = (booking: any) => {
    setShowBookingFlow(false);
    setSelectedEatery(null);
    // Show success message or redirect
    alert('Booking confirmed! You will receive a confirmation email shortly.');
  };

  const shareEatery = (eatery: Eatery) => {
    if (navigator.share) {
      navigator.share({
        title: eatery.name,
        text: `Check out ${eatery.name} on coastalConnect!`,
        url: window.location.href + `/${eatery.id}`
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href + `/${eatery.id}`);
      alert('Link copied to clipboard!');
    }
  };

  if (showBookingFlow && selectedEatery) {
    return (
      <BookingFlow
        item={{
          id: selectedEatery.id.toString(),
          name: selectedEatery.name,
          type: 'restaurant',
          price: selectedEatery.price_range || 500,
          image: selectedEatery.image_url || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
          rating: selectedEatery.rating || 4,
          location: selectedEatery.location,
          description: selectedEatery.description || '',
          cancellationPolicy: '24 hours free cancellation',
          amenities: getAmenities(selectedEatery)
        }}
        onBookingComplete={handleBookingComplete}
        onCancel={() => {
          setShowBookingFlow(false);
          setSelectedEatery(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className={layouts.container}>
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" className="flex items-center space-x-3 text-white hover:text-orange-100 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites ({favorites.length})
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                Best Eateries in Coastal Karnataka
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Discover authentic local cuisine, from traditional Udupi dishes to coastal delicacies
              </p>
              <div className="flex justify-center items-center mt-4 space-x-6 text-sm">
                <span className="flex items-center">
                  <Utensils className="h-4 w-4 mr-1" />
                  {eateries.length}+ Restaurants
                </span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Verified Reviews
                </span>
                <span className="flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Delivery Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`${layouts.container} -mt-8`}>
        <SearchAndFilter
          onSearchChange={handleSearchChange}
          categories={categories}
          locations={locations}
          amenities={amenities}
          loading={loading}
          resultCount={filteredEateries.length}
          className="mb-8"
        />
      </div>

      {/* Results Section */}
      <div className={layouts.container}>
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${filteredEateries.length} Restaurants Found`}
            </h2>
            <p className="text-gray-600">
              Showing restaurants in Udupi, Manipal, and nearby areas
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={fetchEateries} className="bg-orange-600 hover:bg-orange-700">
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredEateries.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Utensils className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No restaurants found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Try adjusting your filters or search criteria to find more restaurants.
            </p>
            <Button onClick={() => window.location.reload()} className="bg-orange-600 hover:bg-orange-700">
              Reset Filters
            </Button>
          </div>
        )}

        {/* Eateries Grid/List */}
        {!loading && !error && filteredEateries.length > 0 && (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredEateries.map((eatery) => (
              <EateryCard
                key={eatery.id}
                eatery={eatery}
                isFavorite={favorites.includes(eatery.id)}
                onToggleFavorite={() => toggleFavorite(eatery.id)}
                onBookNow={() => handleBookNow(eatery)}
                onShare={() => shareEatery(eatery)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Eatery Card Component
function EateryCard({ 
  eatery, 
  isFavorite, 
  onToggleFavorite, 
  onBookNow, 
  onShare,
  viewMode 
}: {
  eatery: Eatery;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookNow: () => void;
  onShare: () => void;
  viewMode: 'grid' | 'list';
}) {
  const cardClass = viewMode === 'list' 
    ? 'flex items-center space-x-4 p-4' 
    : 'overflow-hidden';

  return (
    <Card className={`${designSystem.components.card.default} hover:shadow-lg transition-all duration-300 ${cardClass}`}>
      {/* Image */}
      <div className={viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'relative h-48 overflow-hidden'}>
        <img 
          src={eatery.image_url || "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop"} 
          alt={eatery.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay badges - only in grid view */}
        {viewMode === 'grid' && (
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {eatery.featured && (
              <Badge className="bg-orange-500 text-white text-xs">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {eatery.offers && eatery.offers.length > 0 && (
              <Badge className="bg-green-500 text-white text-xs">
                {eatery.offers[0].discount}% OFF
              </Badge>
            )}
          </div>
        )}
        
        {/* Favorite and Share buttons */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/80 hover:bg-white h-8 w-8 p-0"
            onClick={onToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/80 hover:bg-white h-8 w-8 p-0"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className={viewMode === 'list' ? 'flex-1 p-0' : 'p-4'}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{eatery.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">{eatery.rating?.toFixed(1)}</span>
                <span className="text-gray-500">({eatery.total_reviews})</span>
              </div>
              {eatery.distance && (
                <div className="flex items-center">
                  <Navigation className="h-3 w-3 mr-1" />
                  <span>{eatery.distance} km</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-medium text-gray-900">₹{eatery.price_range || 500}</div>
            <div className="text-xs text-gray-500">for two</div>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{eatery.location}</span>
        </div>

        <div className="text-sm text-gray-600 mb-3">
          {eatery.cuisine_type} • {eatery.description?.slice(0, 50)}...
        </div>

        {/* Popular dishes */}
        {eatery.popular_dishes && eatery.popular_dishes.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1">Popular:</div>
            <div className="flex flex-wrap gap-1">
              {eatery.popular_dishes.slice(0, 2).map((dish, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {dish}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {eatery.delivery_available && (
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Delivery
            </Badge>
          )}
          {eatery.wifi_available && (
            <Badge variant="outline" className="text-xs">
              <Wifi className="h-3 w-3 mr-1" />
              WiFi
            </Badge>
          )}
          {eatery.has_parking && (
            <Badge variant="outline" className="text-xs">
              <Car className="h-3 w-3 mr-1" />
              Parking
            </Badge>
          )}
          {eatery.accepts_cards && (
            <Badge variant="outline" className="text-xs">
              <CreditCard className="h-3 w-3 mr-1" />
              Cards
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            onClick={onBookNow}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Book Table
          </Button>
          {eatery.phone && (
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get amenities for booking flow
function getAmenities(eatery: Eatery): string[] {
  const amenities = [];
  if (eatery.wifi_available) amenities.push('Free WiFi');
  if (eatery.has_parking) amenities.push('Parking');
  if (eatery.accepts_cards) amenities.push('Card Payment');
  if (eatery.outdoor_seating) amenities.push('Outdoor Seating');
  if (eatery.delivery_available) amenities.push('Home Delivery');
  if (eatery.takeaway_available) amenities.push('Takeaway');
  if (eatery.family_friendly) amenities.push('Family Friendly');
  if (eatery.pure_veg) amenities.push('Pure Vegetarian');
  return amenities;
}
