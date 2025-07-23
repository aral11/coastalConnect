import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Users
} from 'lucide-react';

export default function Drivers() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const placeholderDrivers = [
    {
      id: 1,
      name: "Miguel Rodriguez",
      location: "Coastal Bay Area",
      rating: 4.9,
      reviews: 156,
      experience: "5 years",
      vehicle: "Toyota Camry 2022",
      hourlyRate: "$25",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      specialties: ["Airport Transfers", "City Tours", "Long Distance"]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      location: "Marina District",
      rating: 4.8,
      reviews: 203,
      experience: "7 years",
      vehicle: "Honda CR-V 2023",
      hourlyRate: "$30",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face",
      specialties: ["Family Trips", "Shopping Tours", "Beach Excursions"]
    },
    {
      id: 3,
      name: "James Park",
      location: "Sunset Beach",
      rating: 4.9,
      reviews: 89,
      experience: "3 years",
      vehicle: "Tesla Model 3 2023",
      hourlyRate: "$35",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      specialties: ["Eco-Friendly", "Tech Tours", "Night Rides"]
    }
  ];

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
              <Link to="/hotels" className="text-gray-600 hover:text-coastal-600 transition-colors">Hotels</Link>
              <Link to="/drivers" className="text-ocean-600 font-medium">Drivers</Link>
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
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Driver Services</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Professional, licensed drivers for all your transportation needs
          </p>
        </div>
      </section>

      {/* Search & Booking Form */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Pickup location" 
                className="pl-10 h-12"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Drop-off location" 
                className="pl-10 h-12"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                type="datetime-local" 
                className="pl-10 h-12"
              />
            </div>
            <Button className="btn-ocean h-12">
              Find Drivers
            </Button>
          </div>
        </div>
      </section>

      {/* Drivers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Available Drivers</h2>
            <p className="text-gray-600">{placeholderDrivers.length} drivers available</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderDrivers.map((driver) => (
              <Card key={driver.id} className="card-coastal overflow-hidden group cursor-pointer hover:shadow-ocean">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={driver.avatar} 
                      alt={driver.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold">{driver.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1 text-ocean-500" />
                        {driver.location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{driver.rating}</span>
                      <span className="text-gray-500 ml-2">({driver.reviews})</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-ocean-600">{driver.hourlyRate}</div>
                      <div className="text-sm text-gray-500">per hour</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Car className="h-4 w-4 mr-2 text-gray-400" />
                      {driver.vehicle}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {driver.experience} experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      Licensed & Insured
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {driver.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {driver.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{driver.specialties.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-ocean-600 border-ocean-200">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      className="btn-ocean"
                      size="sm"
                      onClick={() => {
                        if (!isAuthenticated) {
                          // Store the intended booking for after login
                          localStorage.setItem('pendingBooking', JSON.stringify({
                            type: 'driver',
                            driver: driver
                          }));
                          navigate('/login?redirect=/drivers');
                        } else {
                          // Open driver booking modal (to be implemented)
                          alert('Driver booking functionality coming soon! Please check back later.');
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

          {/* Service Types */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-2 border-ocean-200 hover:border-ocean-400 transition-colors">
              <Car className="h-12 w-12 mx-auto text-ocean-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">City Rides</h3>
              <p className="text-gray-600">Quick and convenient transportation within the city</p>
            </Card>
            
            <Card className="text-center p-6 border-2 border-ocean-200 hover:border-ocean-400 transition-colors">
              <Users className="h-12 w-12 mx-auto text-ocean-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Group Tours</h3>
              <p className="text-gray-600">Comfortable rides for families and groups</p>
            </Card>
            
            <Card className="text-center p-6 border-2 border-ocean-200 hover:border-ocean-400 transition-colors">
              <Clock className="h-12 w-12 mx-auto text-ocean-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Service</h3>
              <p className="text-gray-600">Round-the-clock availability for your needs</p>
            </Card>
          </div>

          {/* Placeholder Message */}
          <div className="mt-16 text-center py-12 bg-gray-50 rounded-xl">
            <Car className="h-16 w-16 mx-auto text-ocean-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Driver Booking System Coming Soon!</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              We're building a comprehensive driver booking platform with real-time availability, 
              route optimization, and secure payment processing. This preview shows the interface 
              for our upcoming driver services.
            </p>
            <Link to="/">
              <Button className="btn-ocean">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
