import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Homestay, HomestayResponse } from '@shared/api';
import BookingModal from '@/components/BookingModal';
import {
  Search,
  MapPin,
  Star,
  ArrowLeft,
  Filter,
  Heart,
  IndianRupee,
  Phone,
  Waves
} from 'lucide-react';

export default function Hotels() {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHomestay, setSelectedHomestay] = useState<Homestay | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomestays();
  }, []);

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
        setHomestays(data.data);
        console.log(`Loaded ${data.data.length} homestays from ${(data as any).source || 'unknown'} source`);
      } else {
        setError(data.message || 'Failed to fetch homestays');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Network error: ${errorMessage}`);
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
                src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Fd353be6a54374bebb7d9c1f516095097?format=webp&width=800"
                alt="coastalConnect"
                className="logo-brand h-10"
              />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/hotels" className="text-coastal-600 font-medium">Homestays</Link>
              <Link to="/drivers" className="text-gray-600 hover:text-coastal-600 transition-colors">Drivers</Link>
              <Link to="/about" className="text-gray-600 hover:text-coastal-600 transition-colors">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-coastal-600 transition-colors">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="text-coastal-600 hover:text-coastal-700">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-coastal-300 text-coastal-600"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-coastal-600 hover:text-coastal-700">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="btn-coastal">Get Started</Button>
                  </Link>
                </>
              )}
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
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Udupi Homestays</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Experience authentic Udupi hospitality in traditional family homes with home-cooked meals
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
                placeholder="Search by location in Udupi..." 
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

      {/* Homestays Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Available Homestays</h2>
            <p className="text-gray-600">{homestays.length} homestays found</p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coastal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading Udupi homestays...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchHomestays} className="btn-coastal">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && homestays.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Waves className="h-16 w-16 mx-auto text-coastal-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Homestays Found</h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                We're still setting up the database connection. Please check that your SQL Server is running
                and try seeding the database with sample data.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={fetchHomestays} className="btn-coastal">
                  Refresh
                </Button>
                <Button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/seed', { method: 'POST' });
                      const result = await response.json();
                      if (result.success) {
                        fetchHomestays();
                      }
                    } catch (err) {
                      console.error('Error seeding database:', err);
                    }
                  }}
                  variant="outline"
                  className="border-coastal-300 text-coastal-600"
                >
                  Seed Database
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && homestays.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homestays.map((homestay) => (
                <Card key={homestay.id} className="card-coastal overflow-hidden group cursor-pointer">
                  <div className="relative">
                    <img 
                      src={homestay.image_url || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"} 
                      alt={homestay.name}
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
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold">{homestay.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1 text-coastal-500" />
                          {homestay.location}
                        </CardDescription>
                      </div>
                      {homestay.price_per_night && (
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold text-coastal-600 flex items-center">
                            <IndianRupee className="h-4 w-4" />
                            {homestay.price_per_night}
                          </div>
                          <div className="text-sm text-gray-500">per night</div>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {homestay.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {homestay.description}
                      </p>
                    )}

                    {homestay.rating && (
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{homestay.rating}</span>
                          <span className="text-gray-500 ml-2">({homestay.total_reviews} reviews)</span>
                        </div>
                      </div>
                    )}

                    {homestay.amenities && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {homestay.amenities.split(',').slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity.trim()}
                          </Badge>
                        ))}
                        {homestay.amenities.split(',').length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{homestay.amenities.split(',').length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {homestay.phone && (
                        <Button variant="outline" size="sm" className="text-coastal-600 border-coastal-200">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      )}
                      <Button
                        className="btn-coastal"
                        size="sm"
                        onClick={() => {
                          if (!isAuthenticated) {
                            // Store the intended booking for after login
                            localStorage.setItem('pendingBooking', JSON.stringify({
                              type: 'homestay',
                              homestay: homestay
                            }));
                            navigate('/login?redirect=/hotels');
                          } else {
                            setSelectedHomestay(homestay);
                            setIsBookingModalOpen(true);
                          }
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedHomestay && (
        <BookingModal
          homestay={selectedHomestay}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedHomestay(null);
          }}
        />
      )}
    </div>
  );
}
