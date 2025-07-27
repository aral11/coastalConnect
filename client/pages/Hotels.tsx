import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Homestay, HomestayResponse } from '@shared/api';
import ServicePageLayout from '@/components/ServicePageLayout';
import BookingModal from '@/components/BookingModal';
import { Building } from 'lucide-react';

export default function Hotels() {
  const { id } = useParams();
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [filteredHomestays, setFilteredHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHomestay, setSelectedHomestay] = useState<Homestay | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const { isAuthenticated } = useAuth();

  // Filter data
  const categories = [
    { id: 'heritage', name: 'Heritage Homes', count: 12 },
    { id: 'beachside', name: 'Beachside', count: 8 },
    { id: 'traditional', name: 'Traditional', count: 15 },
    { id: 'modern', name: 'Modern', count: 10 },
    { id: 'family', name: 'Family-friendly', count: 20 },
    { id: 'luxury', name: 'Luxury', count: 6 },
  ];

  const locations = [
    { id: 'udupi', name: 'Udupi City', count: 25 },
    { id: 'malpe', name: 'Malpe Beach', count: 15 },
    { id: 'manipal', name: 'Manipal', count: 12 },
    { id: 'kaup', name: 'Kaup', count: 8 },
    { id: 'karkala', name: 'Karkala', count: 5 },
  ];

  const amenities = [
    { id: 'wifi', name: 'Free WiFi' },
    { id: 'parking', name: 'Free Parking' },
    { id: 'ac', name: 'Air Conditioning' },
    { id: 'breakfast', name: 'Complimentary Breakfast' },
    { id: 'beach_access', name: 'Beach Access' },
    { id: 'kitchen', name: 'Kitchen Access' },
    { id: 'laundry', name: 'Laundry Service' },
    { id: 'pickup', name: 'Airport Pickup' },
  ];

  useEffect(() => {
    if (id) {
      fetchHomestayById(parseInt(id));
    } else {
      fetchHomestays();
    }
    loadFavorites();
  }, [id]);

  useEffect(() => {
    setFilteredHomestays(homestays);
  }, [homestays]);

  const fetchHomestayById = async (homestayId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/homestays/${homestayId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Homestay not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const homestay = {
          ...data.data,
          features: extractHomestayFeatures(data.data),
          trending: false,
          featured: true,
          offers: []
        };

        setHomestays([homestay]);
        setSelectedHomestay(homestay);
        setIsBookingModalOpen(true); // Auto-open booking modal for detail view
      } else {
        throw new Error('Failed to fetch homestay details');
      }
    } catch (error) {
      console.error('❌ Error fetching homestay:', error);
      setError(error instanceof Error ? error.message : 'Failed to load homestay details');

      // Fallback: try to find in existing data or redirect to list view
      if (homestays.length === 0) {
        await fetchHomestays(); // Load all homestays as fallback
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHomestays = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/homestays');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HomestayResponse = await response.json();

      if (data.success && data.data) {
        // Enhance homestays with additional features
        const enhancedHomestays = data.data.map((homestay) => ({
          ...homestay,
          features: extractHomestayFeatures(homestay),
          trending: Math.random() > 0.8,
          featured: Math.random() > 0.9,
          offers: Math.random() > 0.7 ? [{
            type: 'discount',
            description: '15% off on bookings above 3 nights',
            discount: 15
          }] : []
        }));
        
        setHomestays(enhancedHomestays);
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
          description: "Experience traditional Udupi hospitality in our heritage home with authentic local cuisine and modern amenities.",
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
        },
        {
          id: 2,
          name: "Udupi Traditional Home",
          description: "Stay with a local family and experience authentic Udupi culture, cuisine, and hospitality.",
          location: "Car Street, Udupi",
          address: "Near Krishna Temple, Car Street, Udupi, Karnataka 576101",
          price_per_night: 2000,
          rating: 4.6,
          total_reviews: 89,
          phone: "+91 94834 56789",
          email: "info@udupihome.com",
          amenities: "Traditional Breakfast, WiFi, Cultural Tours, Temple Nearby",
          image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
          latitude: 13.3389,
          longitude: 74.7421,
          is_active: true
        },
        {
          id: 3,
          name: "Manipal Comfort Stay",
          description: "Modern homestay perfect for families and students visiting Manipal University.",
          location: "Manipal University Road",
          address: "Tiger Circle, Manipal, Karnataka 576104",
          price_per_night: 1800,
          rating: 4.4,
          total_reviews: 156,
          phone: "+91 91234 56789",
          email: "stay@manipalcomfort.com",
          amenities: "AC Rooms, WiFi, Study Area, University Pickup",
          image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
          latitude: 13.3525,
          longitude: 74.7864,
          is_active: true
        }
      ];
      
      const enhancedFallback = fallbackData.map((homestay) => ({
        ...homestay,
        features: extractHomestayFeatures(homestay),
        trending: Math.random() > 0.7,
        featured: Math.random() > 0.8,
        offers: Math.random() > 0.6 ? [{
          type: 'discount',
          description: '20% off on extended stays',
          discount: 20
        }] : []
      }));
      
      setHomestays(enhancedFallback);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('homestay_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (homestayId: number) => {
    const newFavorites = favorites.includes(homestayId)
      ? favorites.filter(id => id !== homestayId)
      : [...favorites, homestayId];
    
    setFavorites(newFavorites);
    localStorage.setItem('homestay_favorites', JSON.stringify(newFavorites));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filtered = homestays.filter(homestay =>
        homestay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        homestay.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        homestay.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        homestay.amenities?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHomestays(filtered);
    } else {
      setFilteredHomestays(homestays);
    }
  };

  const handleFilterChange = (filters: any) => {
    // Apply multiple filters - in a real app this would be more sophisticated
    let filtered = [...homestays];
    
    if (filters.category && filters.category !== 'all') {
      // Filter by category based on amenities or description
      filtered = filtered.filter(homestay => {
        const description = homestay.description?.toLowerCase() || '';
        const amenities = homestay.amenities?.toLowerCase() || '';
        return description.includes(filters.category) || amenities.includes(filters.category);
      });
    }
    
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(homestay => 
        homestay.location.toLowerCase().includes(filters.location)
      );
    }
    
    if (filters.priceRange && filters.priceRange[0] !== undefined) {
      filtered = filtered.filter(homestay => {
        const price = homestay.price_per_night || 0;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }
    
    setFilteredHomestays(filtered);
  };

  const handleBookHomestay = (item: any) => {
    const homestay = homestays.find(h => h.id === item.id);
    if (homestay) {
      setSelectedHomestay(homestay);
      setIsBookingModalOpen(true);
    }
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedHomestay(null);
  };

  const handleBookingSuccess = () => {
    closeBookingModal();
  };

  const handleSortChange = (sortBy: string) => {
    let sorted = [...filteredHomestays];
    
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price_low':
        sorted.sort((a, b) => (a.price_per_night || 0) - (b.price_per_night || 0));
        break;
      case 'price_high':
        sorted.sort((a, b) => (b.price_per_night || 0) - (a.price_per_night || 0));
        break;
      case 'reviews':
        sorted.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
        break;
      default:
        // Keep recommended order (featured first, then trending, then by rating)
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }
    
    setFilteredHomestays(sorted);
  };

  return (
    <>
      <ServicePageLayout
        title="Udupi Homestays"
        description="Experience authentic Udupi hospitality in traditional family homes with home-cooked meals and modern amenities"
        icon={<Building className="h-8 w-8" />}
        serviceType="homestay"
        items={filteredHomestays.map(homestay => ({
          ...homestay,
          type: 'homestay' as const,
          price: homestay.price_per_night
        }))}
        loading={loading}
        error={error}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        searchPlaceholder="Search by location, amenities, or homestay name..."
        showFilters={true}
        filtersActive={showFilters}
        onFiltersToggle={() => setShowFilters(!showFilters)}
        filterCategories={categories}
        filterLocations={locations}
        filterAmenities={amenities}
        onFilterChange={handleFilterChange}
        onItemAction={handleBookHomestay}
        onFavorite={toggleFavorite}
        favorites={favorites}
        onRefresh={fetchHomestays}
        sortOptions={[
          { value: 'recommended', label: 'Recommended' },
          { value: 'rating', label: 'Highest Rated' },
          { value: 'reviews', label: 'Most Reviewed' },
          { value: 'price_low', label: 'Price: Low to High' },
          { value: 'price_high', label: 'Price: High to Low' },
        ]}
        onSortChange={handleSortChange}
      />

      {/* Booking Modal */}
      {selectedHomestay && (
        <BookingModal
          homestay={selectedHomestay}
          isOpen={isBookingModalOpen}
          onClose={closeBookingModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
}

// Helper function to extract features from homestay data
function extractHomestayFeatures(homestay: Homestay): string[] {
  const features: string[] = [];
  const amenities = homestay.amenities?.toLowerCase() || '';
  
  if (amenities.includes('wifi') || amenities.includes('internet')) {
    features.push('WiFi');
  }
  if (amenities.includes('parking')) {
    features.push('Parking');
  }
  if (amenities.includes('ac') || amenities.includes('air conditioning')) {
    features.push('AC');
  }
  if (amenities.includes('breakfast')) {
    features.push('Breakfast');
  }
  if (amenities.includes('beach')) {
    features.push('Beach Access');
  }
  if (amenities.includes('kitchen')) {
    features.push('Kitchen');
  }
  
  return features;
}
