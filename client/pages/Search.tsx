import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { designSystem, layouts } from '@/lib/design-system';
import {
  Search,
  MapPin,
  Star,
  Users,
  Phone,
  ArrowLeft,
  Filter,
  SlidersHorizontal,
  Bed,
  UtensilsCrossed,
  Car,
  Camera,
  Store,
  Calendar,
  Loader2
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  price?: string;
  image?: string;
  link: string;
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'Udupi, Karnataka');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: <SlidersHorizontal className="h-4 w-4" /> },
    { id: 'homestays', label: 'Homestays', icon: <Bed className="h-4 w-4" /> },
    { id: 'eateries', label: 'Eateries', icon: <UtensilsCrossed className="h-4 w-4" /> },
    { id: 'drivers', label: 'Drivers', icon: <Car className="h-4 w-4" /> },
    { id: 'creators', label: 'Creators', icon: <Camera className="h-4 w-4" /> },
    { id: 'services', label: 'Services', icon: <Store className="h-4 w-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="h-4 w-4" /> }
  ];

  useEffect(() => {
    const query = searchParams.get('q');
    const location = searchParams.get('location');
    
    if (query) {
      setSearchQuery(query);
      performSearch(query, location || selectedLocation);
    }
  }, [searchParams]);

  const performSearch = async (query: string, location: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&category=${selectedCategory}`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      } else {
        // Search directly in Supabase services
        try {
          const { data: services, error } = await supabase
            .from('services')
            .select(`
              *,
              locations(name),
              service_categories(name)
            `)
            .eq('status', 'approved')
            .eq('is_active', true)
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(20);

          if (!error && services) {
            const searchResults: SearchResult[] = services.map(service => ({
              id: service.id,
              title: service.name,
              description: service.description || service.short_description || '',
              category: service.service_categories?.name || service.service_type,
              location: service.locations?.name || 'Coastal Karnataka',
              rating: service.average_rating || 0,
              reviewCount: service.total_reviews || 0,
              price: `₹${service.base_price}`,
              link: `/service/${service.id}`
            }));
            setResults(searchResults);
          } else {
            setResults([]);
          }
        } catch (error) {
          console.error('Supabase search error:', error);
          setResults([]);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery, location: selectedLocation });
      performSearch(searchQuery, selectedLocation);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'homestays': return <Bed className="h-4 w-4" />;
      case 'eateries': return <UtensilsCrossed className="h-4 w-4" />;
      case 'drivers': return <Car className="h-4 w-4" />;
      case 'creators': return <Camera className="h-4 w-4" />;
      case 'services': return <Store className="h-4 w-4" />;
      case 'events': return <Calendar className="h-4 w-4" />;
      default: return <SlidersHorizontal className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'homestays': return 'bg-blue-100 text-blue-700';
      case 'eateries': return 'bg-green-100 text-green-700';
      case 'drivers': return 'bg-purple-100 text-purple-700';
      case 'creators': return 'bg-pink-100 text-pink-700';
      case 'services': return 'bg-orange-100 text-orange-700';
      case 'events': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className={layouts.container}>
            <div className="py-6">
              <div className="flex items-center mb-6">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
              </div>

              {/* Search Bar */}
              <div className="max-w-4xl">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Location Selector */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                        <select 
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="w-full lg:w-56 pl-10 pr-8 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-900 bg-gray-50 appearance-none"
                        >
                          <option value="Udupi, Karnataka">Udupi, Karnataka</option>
                          <option value="Manipal, Karnataka">Manipal, Karnataka</option>
                          <option value="Malpe, Karnataka">Malpe, Karnataka</option>
                          <option value="Kaup, Karnataka">Kaup, Karnataka</option>
                        </select>
                      </div>
                    </div>

                    {/* Search Input */}
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search for homestays, restaurants, drivers or more..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Search Button */}
                    <Button 
                      onClick={handleSearch}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200">
          <div className={layouts.container}>
            <div className="py-4">
              <div className="flex items-center space-x-2 overflow-x-auto">
                <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 whitespace-nowrap ${
                      selectedCategory === category.id 
                        ? 'bg-orange-600 text-white' 
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={layouts.container}>
          <div className="py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-3 text-gray-600">Searching...</span>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found {results.length} results for "{searchQuery}" in {selectedLocation}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((result) => (
                    <Card key={result.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(result.category)}
                            <Badge className={`text-xs ${getCategoryColor(result.category)}`}>
                              {result.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{result.rating}</span>
                            <span className="text-xs text-gray-500">({result.reviewCount})</span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{result.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{result.description}</p>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{result.location}</span>
                        </div>

                        {result.price && (
                          <div className="mb-4">
                            <span className="font-semibold text-orange-600">{result.price}</span>
                          </div>
                        )}

                        <Link to={result.link}>
                          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : searchQuery ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find anything for "{searchQuery}" in {selectedLocation}. 
                  Try adjusting your search terms or location.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link to="/homestays">
                    <Button variant="outline">Browse Homestays</Button>
                  </Link>
                  <Link to="/eateries">
                    <Button variant="outline">Browse Eateries</Button>
                  </Link>
                  <Link to="/drivers">
                    <Button variant="outline">Browse Drivers</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h3>
                <p className="text-gray-600">
                  Enter a search term above to find homestays, restaurants, drivers, and more.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
