import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Homestay, HomestayResponse } from '@shared/api';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import SearchSection from '@/components/SearchSection';
import BookingModal from '@/components/BookingModal';
import { designSystem, layouts, statusColors } from '@/lib/design-system';
import {
  Search,
  MapPin,
  Star,
  ArrowLeft,
  Filter,
  Heart,
  IndianRupee,
  Phone,
  Waves,
  Building,
  Users,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Shield,
  Clock,
  Calendar,
  ExternalLink,
  Share2,
  Bookmark,
  Loader2,
  CheckCircle,
  Award,
  Camera,
  Navigation
} from 'lucide-react';

export default function Hotels() {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHomestay, setSelectedHomestay] = useState<Homestay | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomestays();
  }, []);

  const fetchHomestays = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🏠 Fetching homestays...');

      const response = await fetch('/api/homestays');
      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HomestayResponse = await response.json();
      console.log('📊 Data received:', data);

      if (data.success && data.data) {
        setHomestays(data.data);
        console.log('✅ Homestays loaded successfully:', data.data.length, 'items');
      } else {
        throw new Error('Failed to fetch homestays - invalid response format');
      }
    } catch (error) {
      console.error('❌ Error fetching homestays:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');

      // Use fallback data if API fails
      const fallbackData: Homestay[] = [
        {
          id: 1,
          name: "Coastal Heritage Homestay",
          description: "Experience traditional Udupi hospitality in our heritage home.",
          location: "Malpe Beach Road, Udupi",
          address: "Near Malpe Beach, Udupi, Karnataka 576103",
          price_per_night: 2500,
          rating: 4.8,
          total_reviews: 124,
          phone: "+91 98456 78901",
          email: "stay@coastalheritage.com",
          amenities: "AC Rooms, Free WiFi, Traditional Breakfast, Beach Access",
          image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
          latitude: 13.3494,
          longitude: 74.7421,
          is_active: true
        }
      ];
      setHomestays(fallbackData);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      console.log('🔍 Searching homestays for:', searchQuery);

      try {
        setLoading(true);
        const response = await fetch(`/api/homestays/search?q=${encodeURIComponent(searchQuery)}`);

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setHomestays(data.data);
            console.log('✅ Search results:', data.data.length, 'homestays found');
          }
        } else {
          // Fallback to client-side filtering
          const filtered = homestays.filter(homestay =>
            homestay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            homestay.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            homestay.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setHomestays(filtered);
        }
      } catch (error) {
        console.error('Search failed, using client-side filtering:', error);
        // Client-side fallback
        const filtered = homestays.filter(homestay =>
          homestay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          homestay.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          homestay.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setHomestays(filtered);
      } finally {
        setLoading(false);
      }
    } else {
      // Reset to all homestays
      fetchHomestays();
    }
  };

  const handleBookHomestay = (homestay: Homestay) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedHomestay(homestay);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedHomestay(null);
  };

  const handleBookingSuccess = () => {
    closeBookingModal();
    // TODO: Show success message
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-50';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getAvailabilityBadge = (available: boolean) => {
    return available ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Available
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
        Fully Booked
      </Badge>
    );
  };

  if (error) {
    return (
      <Layout>
        <PageHeader
          title="Homestays"
          description="Experience authentic Udupi hospitality"
          icon={<Building className="h-8 w-8" />}
        />
        <div className={layouts.container}>
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
                <p className="font-medium">Failed to load homestays</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
              <Button onClick={fetchHomestays} className="w-full">
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
        title="Udupi Homestays"
        description="Experience authentic Udupi hospitality in traditional family homes with home-cooked meals and modern amenities"
        icon={<Building className="h-8 w-8" />}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Homestays' }
        ]}
      />

      <SearchSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        placeholder="Search by location in Udupi..."
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
                <h2 className="text-2xl font-bold text-gray-900">Available Homestays</h2>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Loading...' : `${homestays.length} homestays found`}
                </p>
              </div>
              
              {!loading && homestays.length > 0 && (
                <div className="hidden lg:flex items-center gap-4">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                    <option>Distance</option>
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

            {/* Homestays Grid */}
            {!loading && homestays.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {homestays.map((homestay) => (
                  <Card key={homestay.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <div className="relative">
                      <img
                        src={homestay.image_url || '/placeholder.svg'}
                        alt={homestay.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Overlay Actions */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Availability Badge */}
                      <div className="absolute top-3 left-3">
                        {getAvailabilityBadge(true)}
                      </div>

                      {/* Photo Count */}
                      <div className="absolute bottom-3 right-3">
                        <Badge variant="secondary" className="bg-black/50 text-white border-0">
                          <Camera className="h-3 w-3 mr-1" />
                          12 photos
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <div className="space-y-3">
                        {/* Rating & Location */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(homestay.rating || 4.5)}`}>
                              <Star className="h-3 w-3 fill-current" />
                              {homestay.rating || '4.5'}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({homestay.total_reviews || 156} reviews)
                            </span>
                          </div>
                          <Award className="h-4 w-4 text-yellow-500" />
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {homestay.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {homestay.description}
                          </p>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          {homestay.location}
                        </div>

                        {/* Amenities */}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Wifi className="h-3 w-3" />
                            WiFi
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="h-3 w-3" />
                            Parking
                          </div>
                          <div className="flex items-center gap-1">
                            <Utensils className="h-3 w-3" />
                            Meals
                          </div>
                        </div>

                        {/* Price & Booking */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4 text-gray-700" />
                            <span className="font-bold text-lg text-gray-900">
                              {homestay.price_per_night || 2500}
                            </span>
                            <span className="text-sm text-gray-500">/night</span>
                          </div>
                          
                          <Button 
                            onClick={() => handleBookHomestay(homestay)}
                            className="bg-blue-600 hover:bg-blue-700 px-6"
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && homestays.length === 0 && (
              <div className="text-center py-16">
                <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No homestays found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or check back later.</p>
                <Button onClick={fetchHomestays}>
                  Refresh Results
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {selectedHomestay && (
        <BookingModal
          homestay={selectedHomestay}
          isOpen={isBookingModalOpen}
          onClose={closeBookingModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </Layout>
  );
}
