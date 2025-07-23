import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import SearchSection from '@/components/SearchSection';
import DriverBookingModal from '@/components/DriverBookingModal';
import { designSystem, layouts, statusColors } from '@/lib/design-system';
import { 
  Search,
  MapPin, 
  Star, 
  Car,
  Clock,
  Phone,
  Shield,
  Anchor,
  ArrowLeft,
  Calendar,
  Users,
  Filter,
  RefreshCw,
  CheckCircle,
  Award,
  Heart,
  Share2,
  Navigation,
  Fuel,
  Settings,
  MessageCircle,
  IndianRupee,
  Camera,
  Wifi,
  CreditCard,
  Route,
  Gauge,
  Music
} from 'lucide-react';

interface Driver {
  id: number;
  name: string;
  location: string;
  vehicle_type?: string;
  vehicle_number?: string;
  rating?: number;
  total_reviews?: number;
  hourly_rate?: number;
  experience_years?: number;
  languages?: string;
  phone?: string;
  is_available?: boolean;
  vehicle_model?: string;
  ac_available?: boolean;
  music_system?: boolean;
  gps_enabled?: boolean;
  english_speaking?: boolean;
  local_expertise?: boolean;
  safety_rating?: number;
  profile_image?: string;
  vehicle_image?: string;
  distance?: number;
  estimated_arrival?: number;
}

export default function Drivers() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    fetchDrivers();
    loadFavorites();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/drivers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Enhance drivers with additional mock data
        const enhancedDrivers = data.data.map((driver: Driver) => ({
          ...driver,
          ac_available: Math.random() > 0.3,
          music_system: Math.random() > 0.4,
          gps_enabled: Math.random() > 0.2,
          english_speaking: Math.random() > 0.5,
          local_expertise: Math.random() > 0.3,
          safety_rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          distance: Math.floor(Math.random() * 10) + 1,
          estimated_arrival: Math.floor(Math.random() * 15) + 5,
          vehicle_model: ['Maruti Dzire', 'Hyundai Xcent', 'Toyota Innova', 'Mahindra Scorpio', 'Tata Nexon'][Math.floor(Math.random() * 5)],
          profile_image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=400&fit=crop&crop=face`,
          vehicle_image: `https://images.unsplash.com/photo-${1600000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=300&fit=crop`
        }));
        
        setDrivers(enhancedDrivers);
      } else {
        throw new Error('Failed to fetch drivers');
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('driver_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (driverId: number) => {
    const newFavorites = favorites.includes(driverId)
      ? favorites.filter(id => id !== driverId)
      : [...favorites, driverId];
    
    setFavorites(newFavorites);
    localStorage.setItem('driver_favorites', JSON.stringify(newFavorites));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleBookDriver = (driver: Driver) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedDriver(driver);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDriver(null);
  };

  const handleBookingSuccess = () => {
    closeBookingModal();
    // TODO: Show success message
  };

  const shareDriver = (driver: Driver) => {
    if (navigator.share) {
      navigator.share({
        title: `${driver.name} - Driver`,
        text: `Book ${driver.name} on coastalConnect!`,
        url: window.location.href + `/${driver.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.href + `/${driver.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-50';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getVehicleTypeColor = (vehicleType: string) => {
    const colors = {
      'Sedan': 'bg-blue-100 text-blue-800',
      'SUV': 'bg-green-100 text-green-800',
      'Hatchback': 'bg-purple-100 text-purple-800',
      'MUV': 'bg-orange-100 text-orange-800',
      'Tempo': 'bg-red-100 text-red-800'
    };
    return colors[vehicleType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getAvailabilityStatus = (driver: Driver) => {
    if (driver.is_available) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Available Now
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Clock className="h-3 w-3 mr-1" />
        Busy
      </Badge>
    );
  };

  if (error) {
    return (
      <Layout>
        <PageHeader
          title="Drivers"
          description="Professional local drivers who know coastal Karnataka"
          icon={<Car className="h-8 w-8" />}
        />
        <div className={layouts.container}>
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
                <p className="font-medium">Failed to load drivers</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
              <Button onClick={fetchDrivers} className="w-full">
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
        title="Local Drivers"
        description="Professional local drivers who know coastal Karnataka like the back of their hand. Safe, reliable, and experienced."
        icon={<Car className="h-8 w-8" />}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Drivers' }
        ]}
      >
        <div className="flex justify-center items-center mt-6 space-x-6 text-sm text-blue-100">
          <span className="flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            Verified Drivers
          </span>
          <span className="flex items-center">
            <Star className="h-4 w-4 mr-1" />
            Rated & Reviewed
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            24/7 Available
          </span>
        </div>
      </PageHeader>

      <SearchSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        placeholder="Search by location or vehicle type..."
        showFilters={true}
        onFiltersClick={() => setShowFilters(!showFilters)}
        filtersActive={showFilters}
      />

      <main className="bg-white">
        <div className={layouts.container}>
          <div className="py-8">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available Drivers</h2>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Loading...' : `${drivers.length} drivers found`}
                </p>
              </div>
              
              {!loading && drivers.length > 0 && (
                <div className="hidden lg:flex items-center gap-4">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Nearest First</option>
                    <option>Highest Rated</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Experienced</option>
                  </select>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-32 w-full mb-4" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Drivers Grid */}
            {!loading && drivers.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                  <Card key={driver.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <div className="p-5">
                      {/* Driver Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={driver.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=3B82F6&color=fff&size=64`}
                              alt={driver.name}
                              className="h-16 w-16 rounded-full object-cover border-2 border-blue-100"
                            />
                            <div className="absolute -bottom-1 -right-1">
                              {driver.is_available ? (
                                <div className="h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                              ) : (
                                <div className="h-4 w-4 bg-yellow-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                              {driver.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(driver.rating || 4.6)}`}>
                                <Star className="h-3 w-3 fill-current" />
                                {driver.rating || '4.6'}
                              </div>
                              <span className="text-xs text-gray-500">
                                ({driver.total_reviews || 89} trips)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => toggleFavorite(driver.id)}
                          >
                            <Heart className={`h-4 w-4 ${favorites.includes(driver.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => shareDriver(driver)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Availability Status */}
                      <div className="mb-4">
                        {getAvailabilityStatus(driver)}
                        {driver.is_available && driver.estimated_arrival && (
                          <span className="ml-2 text-sm text-gray-500">
                            • {driver.estimated_arrival} mins away
                          </span>
                        )}
                      </div>

                      {/* Vehicle Info */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getVehicleTypeColor(driver.vehicle_type || 'Sedan')}>
                            <Car className="h-3 w-3 mr-1" />
                            {driver.vehicle_type || 'Sedan'}
                          </Badge>
                          <span className="text-sm font-medium text-gray-700">
                            {driver.vehicle_model}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          {driver.vehicle_number || 'KA 20 AB 1234'}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {driver.ac_available && (
                            <Badge variant="outline" className="text-xs">
                              <Settings className="h-3 w-3 mr-1" />
                              AC
                            </Badge>
                          )}
                          {driver.music_system && (
                            <Badge variant="outline" className="text-xs">
                              <Music className="h-3 w-3 mr-1" />
                              Music
                            </Badge>
                          )}
                          {driver.gps_enabled && (
                            <Badge variant="outline" className="text-xs">
                              <Navigation className="h-3 w-3 mr-1" />
                              GPS
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Driver Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {driver.location}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Shield className="h-4 w-4" />
                          {driver.experience_years || 8} years experience
                        </div>
                        
                        {driver.languages && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MessageCircle className="h-4 w-4" />
                            {driver.languages}
                          </div>
                        )}
                      </div>

                      {/* Special Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {driver.english_speaking && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            English Speaking
                          </Badge>
                        )}
                        {driver.local_expertise && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Local Expert
                          </Badge>
                        )}
                        {driver.safety_rating >= 4.8 && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Award className="h-3 w-3 mr-1" />
                            Top Rated
                          </Badge>
                        )}
                      </div>

                      {/* Price & Booking */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4 text-gray-700" />
                          <span className="font-bold text-lg text-gray-900">
                            {driver.hourly_rate || 350}
                          </span>
                          <span className="text-sm text-gray-500">/hour</span>
                        </div>
                        
                        <Button 
                          onClick={() => handleBookDriver(driver)}
                          disabled={!driver.is_available}
                          className="bg-blue-600 hover:bg-blue-700 px-6"
                        >
                          {driver.is_available ? 'Book Now' : 'Currently Busy'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && drivers.length === 0 && (
              <div className="text-center py-16">
                <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No drivers found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or check back later.</p>
                <Button onClick={fetchDrivers}>
                  Refresh Results
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {selectedDriver && (
        <DriverBookingModal
          driver={selectedDriver}
          isOpen={isBookingModalOpen}
          onClose={closeBookingModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </Layout>
  );
}
