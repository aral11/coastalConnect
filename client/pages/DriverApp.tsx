import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Car,
  MapPin,
  Clock,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Navigation,
  IndianRupee,
  Key
} from 'lucide-react';

interface TripBooking {
  id: number;
  booking_reference: string;
  passenger_name: string;
  passenger_phone: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: Date;
  total_amount: number;
  trip_code: string;
  booking_status: 'pending' | 'accepted' | 'in_progress' | 'completed';
}

export default function DriverApp() {
  const [driverLoggedIn, setDriverLoggedIn] = useState(false);
  const [tripCode, setTripCode] = useState('');
  const [activeTrip, setActiveTrip] = useState<TripBooking | null>(null);
  const [tripHistory, setTripHistory] = useState<TripBooking[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock driver data
  const driverInfo = {
    name: 'Suresh Kumar',
    phone: '+91 98456 78901',
    vehicle: 'Maruti Dzire - KA 20 A 1234',
    rating: 4.8,
    trips_completed: 156
  };

  // Mock trip data
  const mockTrips: TripBooking[] = [
    {
      id: 1,
      booking_reference: 'CC' + Date.now().toString(36).toUpperCase(),
      passenger_name: 'Priya Sharma',
      passenger_phone: '+91 98765 43210',
      pickup_location: 'Krishna Temple, Car Street',
      dropoff_location: 'Malpe Beach',
      pickup_datetime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      total_amount: 300,
      trip_code: 'ABC123',
      booking_status: 'pending'
    },
    {
      id: 2,
      booking_reference: 'CC' + (Date.now() + 1000).toString(36).toUpperCase(),
      passenger_name: 'Rajesh Patil',
      passenger_phone: '+91 97411 98765',
      pickup_location: 'Manipal University',
      dropoff_location: 'Udupi Railway Station',
      pickup_datetime: new Date(Date.now() + 90 * 60 * 1000), // 90 minutes from now
      total_amount: 250,
      trip_code: 'DEF456',
      booking_status: 'pending'
    }
  ];

  useEffect(() => {
    // Load mock trips
    setTripHistory(mockTrips);
  }, []);

  const handleDriverLogin = () => {
    if (tripCode.length >= 4) {
      setDriverLoggedIn(true);
      setTripCode('');
    } else {
      alert('Please enter a valid driver code');
    }
  };

  const handleAcceptTrip = async (trip: TripBooking) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedTrip = { ...trip, booking_status: 'accepted' as const };
      setActiveTrip(updatedTrip);
      setTripHistory(prev => prev.filter(t => t.id !== trip.id));
      
      alert(`Trip accepted! Trip code: ${trip.trip_code}\nShare this code with passenger to start the trip.`);
    } catch (error) {
      alert('Failed to accept trip');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async () => {
    if (!activeTrip) return;
    
    const enteredCode = prompt('Enter trip code provided by passenger:');
    if (enteredCode !== activeTrip.trip_code) {
      alert('Invalid trip code!');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveTrip(prev => prev ? { ...prev, booking_status: 'in_progress' } : null);
      alert('Trip started! Passenger has been notified.');
    } catch (error) {
      alert('Failed to start trip');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTrip = async () => {
    if (!activeTrip) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Trip completed successfully! Payment has been processed.');
      setActiveTrip(null);
    } catch (error) {
      alert('Failed to complete trip');
    } finally {
      setLoading(false);
    }
  };

  if (!driverLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coastal-50 to-ocean-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-coastal rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <Car className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Driver Login</CardTitle>
            <CardDescription>
              Enter your driver code to access trips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="driverCode">Driver Code</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Key className="h-4 w-4 text-gray-400" />
                <Input
                  id="driverCode"
                  type="password"
                  value={tripCode}
                  onChange={(e) => setTripCode(e.target.value)}
                  placeholder="Enter your driver code"
                  className="flex-1"
                />
              </div>
            </div>
            <Button 
              onClick={handleDriverLogin}
              className="w-full btn-coastal"
              disabled={tripCode.length < 4}
            >
              Login
            </Button>
            <div className="text-center text-sm text-gray-600">
              Demo code: Use any 4+ characters to login
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-coastal-50 to-white">
      {/* Header */}
      <div className="bg-gradient-coastal text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Driver Dashboard</h1>
            <p className="opacity-90">Welcome back, {driverInfo.name}</p>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            onClick={() => {
              setDriverLoggedIn(false);
              setActiveTrip(null);
            }}
          >
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{driverInfo.rating}</div>
            <div className="text-sm opacity-90">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{driverInfo.trips_completed}</div>
            <div className="text-sm opacity-90">Trips</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {activeTrip ? (activeTrip.booking_status === 'in_progress' ? 'BUSY' : 'TRIP') : 'FREE'}
            </div>
            <div className="text-sm opacity-90">Status</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Active Trip */}
        {activeTrip && (
          <Card className="border-coastal-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-coastal-600" />
                Active Trip
                <Badge 
                  className={`ml-auto ${
                    activeTrip.booking_status === 'accepted' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {activeTrip.booking_status === 'accepted' ? 'Ready to Start' : 'In Progress'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Passenger</Label>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{activeTrip.passenger_name}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{activeTrip.passenger_phone}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Trip Route</Label>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">{activeTrip.pickup_location}</span>
                  </div>
                  <div className="flex items-center ml-6">
                    <div className="w-px h-4 bg-gray-300 mr-6"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm">{activeTrip.dropoff_location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Pickup Time</Label>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{activeTrip.pickup_datetime.toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Amount</Label>
                  <div className="flex items-center mt-1">
                    <IndianRupee className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">₹{activeTrip.total_amount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-coastal-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Trip Code:</span>
                  <span className="font-mono text-lg font-bold text-coastal-600">
                    {activeTrip.trip_code}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Share this code with passenger to verify trip
                </div>
              </div>

              <div className="flex space-x-2">
                {activeTrip.booking_status === 'accepted' && (
                  <Button 
                    onClick={handleStartTrip}
                    className="flex-1 btn-coastal"
                    disabled={loading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Start Trip
                  </Button>
                )}
                {activeTrip.booking_status === 'in_progress' && (
                  <Button 
                    onClick={handleCompleteTrip}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={loading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Trip
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => alert('Emergency contact: +91 820 252 0001')}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Emergency
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Trips */}
        {!activeTrip && tripHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Available Trips</CardTitle>
              <CardDescription>
                Accept trips and start earning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tripHistory.map((trip) => (
                  <div key={trip.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{trip.passenger_name}</div>
                        <div className="text-sm text-gray-600">{trip.passenger_phone}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-coastal-600 flex items-center">
                          <IndianRupee className="h-4 w-4" />
                          {trip.total_amount}
                        </div>
                        <div className="text-sm text-gray-600">
                          {trip.pickup_datetime.toLocaleTimeString('en-IN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span>{trip.pickup_location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <span>{trip.dropoff_location}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleAcceptTrip(trip)}
                        className="flex-1 btn-coastal"
                        disabled={loading}
                      >
                        Accept Trip
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-200"
                        onClick={() => alert('Trip declined')}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Trips Available */}
        {!activeTrip && tripHistory.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Trips Available</h3>
              <p className="text-gray-600">
                New trip requests will appear here. Stay online to receive bookings.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
