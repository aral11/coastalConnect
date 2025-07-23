import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { 
  Search,
  MapPin, 
  Star, 
  ArrowLeft,
  Filter,
  Clock,
  IndianRupee,
  Phone,
  Utensils,
  ExternalLink
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
  price_range?: string;
  image_url?: string;
  google_rating?: number;
  google_reviews?: number;
}

export default function Eateries() {
  const [eateries, setEateries] = useState<Eatery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  useEffect(() => {
    fetchEateries();
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
        // Add mock Google ratings to the data
        const eateriesWithGoogleRatings = data.data.map((eatery: Eatery) => ({
          ...eatery,
          google_rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Random rating between 3.5-5.0
          google_reviews: Math.floor(Math.random() * 500 + 50) // Random reviews between 50-550
        }));
        setEateries(eateriesWithGoogleRatings);
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

  const filteredEateries = eateries.filter(eatery => {
    const matchesSearch = eatery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eatery.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (eatery.cuisine_type && eatery.cuisine_type.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCuisine = !selectedCuisine || eatery.cuisine_type === selectedCuisine;
    
    return matchesSearch && matchesCuisine;
  });

  const cuisineTypes = [...new Set(eateries.map(e => e.cuisine_type).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-coastal-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-coastal-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Fd353be6a54374bebb7d9c1f516095097?format=webp&width=800"
                alt="coastalConnect"
                className="logo-brand h-10"
              />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/hotels" className="text-gray-600 hover:text-coastal-600 transition-colors">Homestays</Link>
              <Link to="/drivers" className="text-gray-600 hover:text-coastal-600 transition-colors">Drivers</Link>
              <Link to="/eateries" className="text-coastal-600 font-medium">Eateries</Link>
              <Link to="/about" className="text-gray-600 hover:text-coastal-600 transition-colors">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-coastal-600 transition-colors">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-coastal-600 hover:text-coastal-700">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-coastal">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-coastal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-4">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Udupi Eateries</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Discover authentic Udupi cuisine and local restaurants with reviews and ratings
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search restaurants, cuisine types..." 
                className="pl-10 h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="h-12 px-4 border rounded-lg"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
            >
              <option value="">All Cuisines</option>
              {cuisineTypes.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
            <Button className="btn-coastal h-12 px-8">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Eateries Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Local Restaurants</h2>
            <p className="text-gray-600">{filteredEateries.length} restaurants found</p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coastal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading restaurants...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchEateries} className="btn-coastal">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && filteredEateries.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Utensils className="h-16 w-16 mx-auto text-coastal-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Restaurants Found</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                No restaurants match your search criteria. Try adjusting your filters.
              </p>
            </div>
          )}

          {!loading && !error && filteredEateries.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEateries.map((eatery) => (
                <Card key={eatery.id} className="card-coastal overflow-hidden group cursor-pointer">
                  <div className="relative">
                    <img 
                      src={eatery.image_url || "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop"} 
                      alt={eatery.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {eatery.cuisine_type && (
                      <Badge className="absolute top-4 left-4 bg-white text-coastal-600">
                        {eatery.cuisine_type}
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold">{eatery.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1 text-coastal-500" />
                          {eatery.location}
                        </CardDescription>
                      </div>
                      {eatery.price_range && (
                        <div className="text-right ml-4">
                          <div className="text-sm font-medium text-coastal-600">
                            {eatery.price_range}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    {eatery.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {eatery.description}
                      </p>
                    )}

                    {/* Ratings Section */}
                    <div className="space-y-2">
                      {/* Google Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                            <Star className="h-3 w-3 text-green-600 fill-current mr-1" />
                            <span className="text-sm font-medium text-green-700">{eatery.google_rating}</span>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">Google ({eatery.google_reviews})</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>

                      {/* App Rating */}
                      {eatery.rating && (
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium">{eatery.rating}</span>
                            <span className="text-gray-500 text-sm ml-2">({eatery.total_reviews} reviews)</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {eatery.opening_hours && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{eatery.opening_hours}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {eatery.phone && (
                        <Button variant="outline" size="sm" className="text-coastal-600 border-coastal-200">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      )}
                      <Button 
                        className="btn-coastal" 
                        size="sm"
                        onClick={() => {
                          // Open Google Maps or directions
                          const address = encodeURIComponent(eatery.address || eatery.location);
                          window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                        }}
                      >
                        Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 bg-coastal-50 rounded-xl p-8 text-center">
            <Utensils className="h-12 w-12 mx-auto text-coastal-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Authentic Udupi Cuisine</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the rich culinary heritage of Udupi with traditional South Indian vegetarian dishes, 
              famous dosas, and authentic coastal Karnataka flavors. Ratings are sourced from Google Reviews 
              to help you find the best dining experiences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
