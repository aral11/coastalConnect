import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import DriverBookingModal from '@/components/DriverBookingModal';
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
  RefreshCw
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
}

export default function Drivers() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchDrivers();
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
        setDrivers(data.data);
        console.log(`Loaded ${data.data.length} drivers from ${(data as any).source || 'unknown'} source`);
      } else {
        setError(data.message || 'Failed to fetch drivers');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Network error: ${errorMessage}`);
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-ocean-200 sticky top-0 z-50">
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
              <Link to="/hotels" className="text-gray-600 hover:text-ocean-600 transition-colors">Homestays</Link>
              <Link to="/drivers" className="text-ocean-600 font-medium">Drivers</Link>
              <Link to="/eateries" className="text-gray-600 hover:text-ocean-600 transition-colors">Eateries</Link>
              <Link to="/about" className="text-gray-600 hover:text-ocean-600 transition-colors">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-ocean-600 transition-colors">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="text-ocean-600 hover:text-ocean-700">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-ocean-300 text-ocean-600"
                    onClick={() => {
                      navigate('/');
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-ocean-600 hover:text-ocean-700">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="btn-ocean">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-ocean text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-4">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Local Drivers</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Professional local drivers who know coastal Karnataka like the back of their hand
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
                placeholder="Search by location or vehicle type..." 
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button variant="outline" className="h-12 px-6">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="btn-ocean h-12 px-8">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Drivers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Available Drivers</h2>
            <p className="text-gray-600">{drivers.length} drivers found</p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading drivers...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchDrivers} className="btn-ocean">
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && drivers.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Car className="h-16 w-16 mx-auto text-ocean-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Drivers Found</h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                We're setting up driver database. Please check that your SQL Server is running
                and try seeding the database with sample data.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={fetchDrivers} className="btn-ocean">
                  Refresh
                </Button>
                <Button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/seed', { method: 'POST' });
                      const result = await response.json();
                      if (result.success) {
                        fetchDrivers();
                      }
                    } catch (err) {
                      console.error('Error seeding database:', err);
                    }
                  }}
                  variant="outline"
                  className="border-ocean-300 text-ocean-600"
                >
                  Seed Database
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && drivers.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {drivers.map((driver) => (
                <Card key={driver.id} className="card-ocean overflow-hidden group cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold">{driver.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1 text-ocean-500" />
                          {driver.location}
                        </CardDescription>
                      </div>
                      {driver.is_available && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Available
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {driver.rating && (
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{driver.rating}</span>
                          <span className="text-gray-500 ml-2">({driver.total_reviews} reviews)</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-2 text-sm">
                      {driver.vehicle_type && (
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-ocean-500" />
                          <span>{driver.vehicle_type}</span>
                          {driver.vehicle_number && (
                            <span className="ml-2 text-gray-500">({driver.vehicle_number})</span>
                          )}
                        </div>
                      )}
                      {driver.experience_years && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-ocean-500" />
                          <span>{driver.experience_years} years experience</span>
                        </div>
                      )}
                      {driver.languages && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-ocean-500" />
                          <span>{driver.languages}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        Licensed & Insured
                      </div>
                    </div>

                    {driver.hourly_rate && (
                      <div className="bg-ocean-50 p-3 rounded-lg">
                        <div className="text-center">
                          <div className="text-xl font-bold text-ocean-600">₹{driver.hourly_rate}/hour</div>
                          <div className="text-sm text-gray-600">Starting rate</div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {driver.phone && (
                        <Button variant="outline" size="sm" className="text-ocean-600 border-ocean-200">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      )}
                      <Button
                        className="btn-ocean"
                        size="sm"
                        onClick={() => {
                          if (!isAuthenticated) {
                            localStorage.setItem('pendingBooking', JSON.stringify({
                              type: 'driver',
                              driver: driver
                            }));
                            navigate('/login?redirect=/drivers');
                          } else {
                            setSelectedDriver(driver);
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
      {selectedDriver && (
        <DriverBookingModal
          driver={selectedDriver}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedDriver(null);
          }}
        />
      )}
    </div>
  );
}
