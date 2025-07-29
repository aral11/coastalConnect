import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ServicePageLayout from '@/components/ServicePageLayout';
import ProfessionalBookingModal from '@/components/ProfessionalBookingModal';
import { ChefHat } from 'lucide-react';

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
  popular_dishes?: string[];
  trending?: boolean;
}

export default function Eateries() {
  const { id } = useParams();
  const [eateries, setEateries] = useState<Eatery[]>([]);
  const [filteredEateries, setFilteredEateries] = useState<Eatery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEatery, setSelectedEatery] = useState<Eatery | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter data
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

  useEffect(() => {
    setFilteredEateries(eateries);
  }, [eateries]);

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
          trending: Math.random() > 0.7,
          popular_dishes: ['Masala Dosa', 'Sambar Rice', 'Filter Coffee'].slice(0, Math.floor(Math.random() * 3) + 1),
          offers: Math.random() > 0.7 ? [{
            type: 'discount',
            description: '20% off on orders above ₹500',
            discount: 20
          }] : []
        }));
        
        setEateries(enhancedEateries);
      } else {
        throw new Error('Failed to fetch eateries');
      }
    } catch (error) {
      console.error('Error fetching eateries:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      // Fallback data
      const fallbackData: Eatery[] = [
        {
          id: 1,
          name: "Mitra Samaj Restaurant",
          description: "Authentic Udupi cuisine served in traditional style with fresh ingredients and age-old recipes.",
          location: "Car Street, Udupi",
          cuisine_type: "South Indian",
          rating: 4.6,
          total_reviews: 234,
          price_range: 350,
          opening_hours: "6:00 AM - 10:00 PM",
          image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
          delivery_available: true,
          takeaway_available: true,
          wifi_available: false,
          has_parking: true,
          pure_veg: true,
          family_friendly: true,
          trending: true,
          featured: true
        },
        {
          id: 2,
          name: "Coastal Spice Restaurant",
          description: "Fresh seafood and coastal delicacies with a modern twist. Famous for our fish curry and prawn preparations.",
          location: "Malpe Beach Road, Udupi",
          cuisine_type: "Seafood",
          rating: 4.4,
          total_reviews: 189,
          price_range: 550,
          opening_hours: "11:00 AM - 11:00 PM",
          image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
          delivery_available: true,
          takeaway_available: true,
          wifi_available: true,
          has_parking: true,
          bar_available: true,
          outdoor_seating: true,
          family_friendly: true,
          trending: false,
          featured: false
        },
        {
          id: 3,
          name: "Manipal Food Court",
          description: "Multiple cuisine options under one roof. Perfect for students and families looking for variety.",
          location: "Tiger Circle, Manipal",
          cuisine_type: "Multi Cuisine",
          rating: 4.2,
          total_reviews: 567,
          price_range: 250,
          opening_hours: "9:00 AM - 12:00 AM",
          image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
          delivery_available: true,
          takeaway_available: true,
          wifi_available: true,
          has_parking: true,
          accepts_cards: true,
          family_friendly: true,
          offers: [{
            type: 'discount',
            description: '15% off for students',
            discount: 15
          }],
          trending: true,
          featured: false
        }
      ];
      
      setEateries(fallbackData);
      setError(null);
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
        eatery.cuisine_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eatery.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEateries(filtered);
    } else {
      setFilteredEateries(eateries);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...eateries];
    
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(eatery => 
        eatery.cuisine_type?.toLowerCase().includes(filters.category) ||
        (filters.category === 'vegetarian' && eatery.pure_veg)
      );
    }
    
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(eatery => 
        eatery.location.toLowerCase().includes(filters.location)
      );
    }
    
    if (filters.priceRange && filters.priceRange[0] !== undefined) {
      filtered = filtered.filter(eatery => {
        const price = eatery.price_range || 0;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }
    
    setFilteredEateries(filtered);
  };

  const bookEatery = (item: any) => {
    const eatery = eateries.find(e => e.id === item.id);
    if (eatery) {
      setSelectedEatery(eatery);
      setShowBookingFlow(true);
    }
  };

  const handleBookingComplete = () => {
    setShowBookingFlow(false);
    setSelectedEatery(null);
  };

  const handleSortChange = (sortBy: string) => {
    let sorted = [...filteredEateries];
    
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price_low':
        sorted.sort((a, b) => (a.price_range || 0) - (b.price_range || 0));
        break;
      case 'price_high':
        sorted.sort((a, b) => (b.price_range || 0) - (a.price_range || 0));
        break;
      case 'distance':
        sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      default:
        // Recommended: featured first, then trending, then by rating
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }
    
    setFilteredEateries(sorted);
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
    <ServicePageLayout
      title="Udupi Eateries"
      description="Discover authentic local cuisine experiences with traditional Udupi flavors and coastal Karnataka specialties"
      icon={<ChefHat className="h-8 w-8" />}
      serviceType="eatery"
      items={filteredEateries.map(eatery => ({
        ...eatery,
        type: 'eatery' as const,
        price: eatery.price_range,
        features: getAmenities(eatery)
      }))}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSearch={handleSearch}
      searchPlaceholder="Search restaurants by name, cuisine, or location..."
      showFilters={true}
      filtersActive={showFilters}
      onFiltersToggle={() => setShowFilters(!showFilters)}
      filterCategories={categories}
      filterLocations={locations}
      filterAmenities={amenities}
      onFilterChange={handleFilterChange}
      onItemAction={bookEatery}
      onFavorite={toggleFavorite}
      favorites={favorites}
      onRefresh={fetchEateries}
      sortOptions={[
        { value: 'recommended', label: 'Recommended' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'distance', label: 'Distance' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
      ]}
      onSortChange={handleSortChange}
    />
  );
}

function getAmenities(eatery: Eatery): string[] {
  const amenityList = [];
  if (eatery.wifi_available) amenityList.push('WiFi');
  if (eatery.has_parking) amenityList.push('Parking');
  if (eatery.accepts_cards) amenityList.push('Cards');
  if (eatery.delivery_available) amenityList.push('Delivery');
  if (eatery.takeaway_available) amenityList.push('Takeaway');
  if (eatery.outdoor_seating) amenityList.push('Outdoor');
  if (eatery.family_friendly) amenityList.push('Family');
  if (eatery.pure_veg) amenityList.push('Veg');
  return amenityList;
}
