import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Homestay, HomestayResponse } from '@shared/api';
import {
  Search,
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Waves,
  Anchor,
  ArrowLeft,
  Filter,
  Heart,
  IndianRupee
} from 'lucide-react';

export default function Hotels() {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHomestays();
  }, []);

  const fetchHomestays = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/homestays');
      const data: HomestayResponse = await response.json();

      if (data.success && data.data) {
        setHomestays(data.data);
      } else {
        setError(data.message || 'Failed to fetch homestays');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching homestays:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-coastal-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-coastal-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Fabdf57ca676049e3bb2813b741a90763?format=webp&width=800"
                alt="coastalConnect"
                className="logo-brand h-10"
              />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/hotels" className="text-coastal-600 font-medium">Hotels</Link>
              <Link to="/drivers" className="text-gray-600 hover:text-coastal-600 transition-colors">Drivers</Link>
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
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Hotels & Homestays</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Discover beautiful coastal accommodations for your perfect getaway
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
                placeholder="Search by location, property name..." 
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button variant="outline" className="h-12 px-6">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="btn-coastal h-12 px-8">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Available Properties</h2>
            <p className="text-gray-600">{placeholderHotels.length} properties found</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderHotels.map((hotel) => (
              <Card key={hotel.id} className="card-coastal overflow-hidden group cursor-pointer">
                <div className="relative">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold">{hotel.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1 text-coastal-500" />
                        {hotel.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-coastal-600">{hotel.price}</div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{hotel.rating}</span>
                      <span className="text-gray-500 ml-2">({hotel.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{hotel.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <Button className="w-full btn-coastal">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Placeholder Message */}
          <div className="mt-16 text-center py-12 bg-gray-50 rounded-xl">
            <Waves className="h-16 w-16 mx-auto text-coastal-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">More Properties Coming Soon!</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              We're continuously adding more beautiful coastal properties to our platform. 
              This is a preview of our hotel booking system - the full implementation with 
              search, filtering, and booking capabilities will be available soon.
            </p>
            <Link to="/">
              <Button className="btn-coastal">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
