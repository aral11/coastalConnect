import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import ServicePageLayout from '@/components/ServicePageLayout';
import DriverBookingModal from '@/components/DriverBookingModal';
import { Car } from 'lucide-react';

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
  trending?: boolean;
  featured?: boolean;
}

export default function Drivers() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Filter data
  const categories = [
    { id: 'sedan', name: 'Sedan', count: 25 },
    { id: 'suv', name: 'SUV', count: 18 },
    { id: 'hatchback', name: 'Hatchback', count: 15 },
    { id: 'muv', name: 'MUV/MPV', count: 12 },
    { id: 'tempo', name: 'Tempo', count: 8 },
    { id: 'luxury', name: 'Luxury', count: 5 },
  ];

  const locations = [
    { id: 'udupi', name: 'Udupi City', count: 35 },
    { id: 'manipal', name: 'Manipal', count: 28 },
    { id: 'malpe', name: 'Malpe', count: 15 },
    { id: 'kaup', name: 'Kaup', count: 12 },
    { id: 'kundapur', name: 'Kundapur', count: 8 },
  ];

  const amenities = [
    { id: 'ac', name: 'Air Conditioning' },
    { id: 'gps', name: 'GPS Navigation' },
    { id: 'music', name: 'Music System' },
    { id: 'english', name: 'English Speaking' },
    { id: 'local_expert', name: 'Local Expert' },
    { id: 'wifi', name: 'WiFi Hotspot' },
    { id: 'phone_charger', name: 'Phone Charger' },
    { id: 'water', name: 'Complimentary Water' },
  ];

  useEffect(() => {
    fetchDrivers();
    loadFavorites();
  }, []);

  useEffect(() => {
    setFilteredDrivers(drivers);
  }, [drivers]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use Supabase getServices function to fetch driver/transport services
      const { getServices } = await import('@/lib/supabase');
      const servicesData = await getServices({
        type: 'driver',
        status: 'approved',
        limit: 50
      });

      if (servicesData && servicesData.length > 0) {
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
          profile_image: `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&size=200&background=3B82F6&color=FFFFFF&bold=true&format=png`,
          vehicle_image: `https://images.unsplash.com/photo-${1600000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=300&fit=crop`,
          trending: Math.random() > 0.8,
          featured: Math.random() > 0.9
        }));
        
        setDrivers(enhancedDrivers);
      } else {
        throw new Error('Failed to fetch drivers');
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      // Fallback data
      const fallbackData: Driver[] = [
        {
          id: 1,
          name: "Rajesh Kumar",
          location: "Udupi City",
          vehicle_type: "Sedan",
          vehicle_model: "Maruti Dzire",
          vehicle_number: "KA 20 AB 1234",
          rating: 4.8,
          total_reviews: 156,
          hourly_rate: 350,
          experience_years: 8,
          languages: "English, Hindi, Kannada",
          phone: "+91 98765 43210",
          is_available: true,
          ac_available: true,
          music_system: true,
          gps_enabled: true,
          english_speaking: true,
          local_expertise: true,
          distance: 2,
          estimated_arrival: 8,
          trending: true,
          featured: true
        },
        {
          id: 2,
          name: "Suresh Shetty",
          location: "Manipal",
          vehicle_type: "SUV",
          vehicle_model: "Toyota Innova",
          vehicle_number: "KA 20 CD 5678",
          rating: 4.6,
          total_reviews: 234,
          hourly_rate: 450,
          experience_years: 12,
          languages: "English, Kannada, Tulu",
          phone: "+91 97654 32109",
          is_available: true,
          ac_available: true,
          music_system: true,
          gps_enabled: true,
          english_speaking: true,
          local_expertise: true,
          distance: 5,
          estimated_arrival: 12,
          trending: false,
          featured: false
        },
        {
          id: 3,
          name: "Mohan Bhat",
          location: "Malpe",
          vehicle_type: "Hatchback",
          vehicle_model: "Tata Nexon",
          vehicle_number: "KA 20 EF 9012",
          rating: 4.4,
          total_reviews: 89,
          hourly_rate: 280,
          experience_years: 5,
          languages: "Kannada, Hindi",
          phone: "+91 96543 21087",
          is_available: false,
          ac_available: true,
          music_system: false,
          gps_enabled: true,
          english_speaking: false,
          local_expertise: true,
          distance: 8,
          estimated_arrival: 25,
          trending: false,
          featured: false
        }
      ];
      
      setDrivers(fallbackData);
      setError(null);
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
      const filtered = drivers.filter(driver =>
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.vehicle_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.vehicle_model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.languages?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDrivers(filtered);
    } else {
      setFilteredDrivers(drivers);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...drivers];
    
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(driver => 
        driver.vehicle_type?.toLowerCase().includes(filters.category)
      );
    }
    
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(driver => 
        driver.location.toLowerCase().includes(filters.location)
      );
    }
    
    if (filters.available !== undefined) {
      filtered = filtered.filter(driver => driver.is_available === filters.available);
    }
    
    if (filters.priceRange && filters.priceRange[0] !== undefined) {
      filtered = filtered.filter(driver => {
        const rate = driver.hourly_rate || 0;
        return rate >= filters.priceRange[0] && rate <= filters.priceRange[1];
      });
    }
    
    setFilteredDrivers(filtered);
  };

  const handleBookDriver = (item: any) => {
    const driver = drivers.find(d => d.id === item.id);
    if (driver) {
      setSelectedDriver(driver);
      setIsBookingModalOpen(true);
    }
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDriver(null);
  };

  const handleBookingSuccess = () => {
    closeBookingModal();
  };

  const handleSortChange = (sortBy: string) => {
    let sorted = [...filteredDrivers];
    
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price_low':
        sorted.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0));
        break;
      case 'price_high':
        sorted.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0));
        break;
      case 'distance':
        sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'experience':
        sorted.sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0));
        break;
      default:
        // Recommended: available first, then featured, then trending, then by rating
        sorted.sort((a, b) => {
          if (a.is_available && !b.is_available) return -1;
          if (!a.is_available && b.is_available) return 1;
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }
    
    setFilteredDrivers(sorted);
  };

  return (
    <>
      <ServicePageLayout
        title="Local Drivers"
        description="Professional local drivers who know coastal Karnataka like the back of their hand. Safe, reliable, and experienced."
        icon={<Car className="h-8 w-8" />}
        serviceType="driver"
        items={filteredDrivers.map(driver => ({
          ...driver,
          type: 'driver' as const,
          price: driver.hourly_rate,
          features: getDriverFeatures(driver),
          availability: {
            available: driver.is_available || false,
            estimated_arrival: driver.estimated_arrival
          }
        }))}
        loading={loading}
        error={error}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        searchPlaceholder="Search by driver name, location, or vehicle type..."
        showFilters={true}
        filtersActive={showFilters}
        onFiltersToggle={() => setShowFilters(!showFilters)}
        filterCategories={categories}
        filterLocations={locations}
        filterAmenities={amenities}
        onFilterChange={handleFilterChange}
        onItemAction={handleBookDriver}
        onFavorite={toggleFavorite}
        favorites={favorites}
        onRefresh={fetchDrivers}
        sortOptions={[
          { value: 'recommended', label: 'Recommended' },
          { value: 'distance', label: 'Nearest First' },
          { value: 'rating', label: 'Highest Rated' },
          { value: 'price_low', label: 'Price: Low to High' },
          { value: 'price_high', label: 'Price: High to Low' },
          { value: 'experience', label: 'Most Experienced' },
        ]}
        onSortChange={handleSortChange}
      />

      {/* Booking Modal */}
      {selectedDriver && (
        <DriverBookingModal
          driver={selectedDriver}
          isOpen={isBookingModalOpen}
          onClose={closeBookingModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
}

function getDriverFeatures(driver: Driver): string[] {
  const features: string[] = [];
  if (driver.ac_available) features.push('AC');
  if (driver.gps_enabled) features.push('GPS');
  if (driver.music_system) features.push('Music');
  if (driver.english_speaking) features.push('English');
  if (driver.local_expertise) features.push('Local Expert');
  return features;
}
