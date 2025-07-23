import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import SearchSection from '@/components/SearchSection';
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
  MessageCircle,
  ChefHat,
  CheckCircle,
  Filter,
  Grid,
  List
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

export default function Eateries() {
  const [eateries, setEateries] = useState<Eatery[]>([]);
  const [filteredEateries, setFilteredEateries] = useState<Eatery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEatery, setSelectedEatery] = useState<Eatery | null>(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
          delivery_available: Math.random() > 0.3,
          takeaway_available: Math.random() > 0.2,
          wifi_available: Math.random() > 0.4,
          has_parking: Math.random() > 0.5,
          accepts_cards: Math.random() > 0.3,
          outdoor_seating: Math.random() > 0.6,
          family_friendly: Math.random() > 0.2,
          pure_veg: Math.random() > 0.4,
          distance: Math.floor(Math.random() * 15) + 1,
          featured: Math.random() > 0.8,
          popular_dishes: ['Masala Dosa', 'Sambar Rice', 'Filter Coffee'].slice(0, Math.floor(Math.random() * 3) + 1),
          offers: Math.random() > 0.7 ? [{
            type: 'discount',
            description: '20% off on orders above ₹500',
            discount: 20
          }] : []
        }));
        
        setEateries(enhancedEateries);
        setFilteredEateries(enhancedEateries);
      } else {
        throw new Error('Failed to fetch eateries');
      }
    } catch (error) {
      console.error('Error fetching eateries:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('eatery_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (eateryId: number) => {
    const newFavorites = favorites.includes(eateryId)
      ? favorites.filter(id => id !== eateryId)
      : [...favorites, eateryId];
    
    setFavorites(newFavorites);
    localStorage.setItem('eatery_favorites', JSON.stringify(newFavorites));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filtered = eateries.filter(eatery =>
        eatery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eatery.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eatery.cuisine_type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEateries(filtered);
    } else {
      setFilteredEateries(eateries);
    }
  };

  const handleSearchChange = (filters: any) => {
    // Implementation for SearchAndFilter component
    // This would apply multiple filters
    console.log('Search filters changed:', filters);
  };

  const bookEatery = (eatery: Eatery) => {
    setSelectedEatery(eatery);
    setShowBookingFlow(true);
  };

  const handleBookingComplete = () => {
    setShowBookingFlow(false);
    setSelectedEatery(null);
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
      navigator.clipboard.writeText(window.location.href + `/${eatery.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const getAmenities = (eatery: Eatery) => {
    const amenityList = [];
    if (eatery.wifi_available) amenityList.push('Free WiFi');
    if (eatery.has_parking) amenityList.push('Parking');
    if (eatery.accepts_cards) amenityList.push('Cards Accepted');
    if (eatery.delivery_available) amenityList.push('Home Delivery');
    if (eatery.takeaway_available) amenityList.push('Takeaway');
    if (eatery.outdoor_seating) amenityList.push('Outdoor Seating');
    if (eatery.family_friendly) amenityList.push('Family Friendly');
    if (eatery.pure_veg) amenityList.push('Pure Vegetarian');
    return amenityList;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-50';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getCuisineBadgeColor = (cuisine: string) => {
    const colors = {
      'South Indian': 'bg-orange-100 text-orange-800',
      'North Indian': 'bg-red-100 text-red-800',
      'Chinese': 'bg-yellow-100 text-yellow-800',
      'Continental': 'bg-purple-100 text-purple-800',
      'Seafood': 'bg-blue-100 text-blue-800',
      'Fast Food': 'bg-gray-100 text-gray-800',
      'Desserts': 'bg-pink-100 text-pink-800'
    };
    return colors[cuisine as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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

  if (error) {
    return (
      <Layout>
        <PageHeader
          title="Eateries"
          description="Discover authentic local cuisine experiences"
          icon={<ChefHat className="h-8 w-8" />}
        />
        <div className={layouts.container}>
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
                <p className="font-medium">Failed to load eateries</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
              <Button onClick={fetchEateries} className="w-full">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout fullWidth>
      <PageHeader
        title="Udupi Eateries"
        description="Discover authentic local cuisine experiences with traditional Udupi flavors and coastal Karnataka specialties"
        icon={<ChefHat className="h-8 w-8" />}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Eateries' }
        ]}
      >
        <div className="flex justify-center items-center mt-6 space-x-6 text-sm text-blue-100">
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
      </PageHeader>

      <SearchSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        placeholder="Search restaurants by name, cuisine, or location..."
        showFilters={true}
        onFiltersClick={() => setShowFilters(!showFilters)}
        filtersActive={showFilters}
      >
        {showFilters && (
          <SearchAndFilter
            onSearchChange={handleSearchChange}
            categories={categories}
            locations={locations}
            amenities={amenities}
            loading={loading}
            resultCount={filteredEateries.length}
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
                  {loading ? 'Loading...' : `${filteredEateries.length} Restaurants Found`}
                </h2>
                <p className="text-gray-600 mt-1">
                  Showing restaurants in Udupi, Manipal, and nearby areas
                </p>
              </div>
              
              {!loading && (
                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Recommended</option>
                    <option>Rating</option>
                    <option>Distance</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Eateries Grid */}
            {!loading && filteredEateries.length > 0 && (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredEateries.map((eatery) => (
                  <Card key={eatery.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <div className="relative">
                      <img
                        src={eatery.image_url || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop'}
                        alt={eatery.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Overlay Actions */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={() => toggleFavorite(eatery.id)}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(eatery.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={() => shareEatery(eatery)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Offers Badge */}
                      {eatery.offers && eatery.offers.length > 0 && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-green-600 text-white border-0">
                            {eatery.offers[0].discount}% OFF
                          </Badge>
                        </div>
                      )}

                      {/* Distance Badge */}
                      <div className="absolute bottom-3 right-3">
                        <Badge variant="secondary" className="bg-black/50 text-white border-0">
                          <Navigation className="h-3 w-3 mr-1" />
                          {eatery.distance}km away
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <div className="space-y-3">
                        {/* Rating & Cuisine */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(eatery.rating || 4.2)}`}>
                              <Star className="h-3 w-3 fill-current" />
                              {eatery.rating || '4.2'}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({eatery.total_reviews || 128} reviews)
                            </span>
                          </div>
                          <Badge className={getCuisineBadgeColor(eatery.cuisine_type || 'South Indian')}>
                            {eatery.cuisine_type || 'South Indian'}
                          </Badge>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {eatery.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {eatery.description || 'Authentic local cuisine with fresh ingredients and traditional recipes'}
                          </p>
                        </div>

                        {/* Location & Hours */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            {eatery.location}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {eatery.opening_hours || 'Open 7:00 AM - 10:00 PM'}
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2">
                          {eatery.delivery_available && (
                            <Badge variant="outline" className="text-xs">
                              <ShoppingBag className="h-3 w-3 mr-1" />
                              Delivery
                            </Badge>
                          )}
                          {eatery.takeaway_available && (
                            <Badge variant="outline" className="text-xs">
                              <Utensils className="h-3 w-3 mr-1" />
                              Takeaway
                            </Badge>
                          )}
                          {eatery.wifi_available && (
                            <Badge variant="outline" className="text-xs">
                              <Wifi className="h-3 w-3 mr-1" />
                              WiFi
                            </Badge>
                          )}
                        </div>

                        {/* Price & Booking */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4 text-gray-700" />
                            <span className="font-bold text-lg text-gray-900">
                              {eatery.price_range || 450}
                            </span>
                            <span className="text-sm text-gray-500">for two</span>
                          </div>
                          
                          <Button 
                            onClick={() => bookEatery(eatery)}
                            className="bg-blue-600 hover:bg-blue-700 px-6"
                          >
                            Reserve Table
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredEateries.length === 0 && (
              <div className="text-center py-16">
                <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No eateries found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or check back later.</p>
                <Button onClick={fetchEateries}>
                  Refresh Results
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
