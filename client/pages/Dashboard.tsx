import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  MapPin,
  User,
  Phone,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertCircle,
  Car,
  Home,
  Star,
  TrendingUp,
  RefreshCw,
  Edit,
  ArrowLeft
} from 'lucide-react';

interface Booking {
  id: number;
  type: 'homestay' | 'driver';
  booking_reference: string;
  guest_name?: string;
  passenger_name?: string;
  total_amount: number;
  booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  check_in_date?: Date;
  pickup_datetime?: Date;
  location?: string;
  pickup_location?: string;
  dropoff_location?: string;
  created_at: Date;
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBookings();
    }
  }, [isAuthenticated]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      
      if (data.success) {
        // Combine homestay and driver bookings with proper typing
        const combinedBookings: Booking[] = [
          ...data.data.homestays.map((b: any) => ({
            ...b,
            type: 'homestay' as const,
            location: `${b.guest_name} - Check-in: ${new Date(b.check_in_date).toLocaleDateString()}`
          })),
          ...data.data.drivers.map((b: any) => ({
            ...b,
            type: 'driver' as const,
            location: `${b.pickup_location} to ${b.dropoff_location}`
          }))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setBookings(combinedBookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
      setBookings([]); // Set empty array instead of dummy data
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coastal-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">Please login to view your dashboard.</p>
            <Button 
              onClick={() => window.location.href = '/login'} 
              className="btn-coastal"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': 
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const totalSpent = bookings
    .filter(b => b.payment_status === 'paid')
    .reduce((sum, booking) => sum + booking.total_amount, 0);
  
  const completedBookings = bookings.filter(b => b.booking_status === 'completed').length;
  const homestayBookings = bookings.filter(b => b.type === 'homestay').length;
  const driverBookings = bookings.filter(b => b.type === 'driver').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-coastal-50 to-white">
      {/* Header */}
      <div className="bg-gradient-coastal text-white p-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="opacity-90">Welcome back, {user?.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Member since</div>
              <div className="font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { 
                  month: 'long', 
                  year: 'numeric' 
                }) : 'Recently joined'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <IndianRupee className="h-8 w-8 text-coastal-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{completedBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Home className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Homestays</p>
                  <p className="text-2xl font-bold">{homestayBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Trips</p>
                  <p className="text-2xl font-bold">{driverBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>
                      Your recent homestay and driver bookings
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchUserBookings}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading bookings...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchUserBookings} variant="outline">
                      Try Again
                    </Button>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <Calendar className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-4">Start exploring coastal Karnataka and make your first booking!</p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={() => window.location.href = '/hotels'} className="btn-coastal">
                        Find Homestays
                      </Button>
                      <Button onClick={() => window.location.href = '/drivers'} variant="outline">
                        Book Drivers
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            {booking.type === 'homestay' ? (
                              <Home className="h-5 w-5 text-coastal-600" />
                            ) : (
                              <Car className="h-5 w-5 text-ocean-600" />
                            )}
                            <div>
                              <div className="font-medium">
                                {booking.type === 'homestay' ? 'Homestay Booking' : 'Driver Trip'}
                              </div>
                              <div className="text-sm text-gray-600">
                                Ref: {booking.booking_reference}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(booking.booking_status)}>
                              {getStatusIcon(booking.booking_status)}
                              <span className="ml-1 capitalize">{booking.booking_status}</span>
                            </Badge>
                            <Badge variant="outline" className={
                              booking.payment_status === 'paid' ? 'text-green-600' : 
                              booking.payment_status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                            }>
                              {booking.payment_status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{booking.guest_name || booking.passenger_name}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                              {booking.check_in_date 
                                ? new Date(booking.check_in_date).toLocaleDateString('en-IN')
                                : booking.pickup_datetime 
                                ? new Date(booking.pickup_datetime).toLocaleDateString('en-IN')
                                : 'N/A'
                              }
                            </span>
                          </div>
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium">₹{booking.total_amount}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{booking.location}</span>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {booking.booking_status === 'completed' && (
                            <Button variant="outline" size="sm" className="text-yellow-600">
                              <Star className="h-3 w-3 mr-1" />
                              Rate
                            </Button>
                          )}
                          {booking.booking_status === 'confirmed' && booking.type === 'homestay' && (
                            <Button variant="outline" size="sm" className="text-red-600">
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1 p-3 border rounded-lg bg-gray-50">
                      {user?.name || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 p-3 border rounded-lg bg-gray-50">
                      {user?.email || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <div className="mt-1 p-3 border rounded-lg bg-gray-50">
                      {user?.phone || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Account Type</label>
                    <div className="mt-1 p-3 border rounded-lg bg-gray-50 capitalize">
                      {user?.role || 'customer'}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="btn-coastal">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>Rewards & Loyalty</CardTitle>
                <CardDescription>
                  Earn points with every booking and get rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-coastal-500 to-ocean-600 text-white rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Loyalty Points</h3>
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{Math.floor(totalSpent / 10)} Points</div>
                    <div className="text-sm opacity-90">
                      Earn 1 point for every ₹10 spent
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                      <div 
                        className="bg-white h-2 rounded-full" 
                        style={{ width: `${Math.min((totalSpent % 3000) / 30, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Available Rewards</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>₹500 Homestay Discount</span>
                          <span className="text-coastal-600">2,000 pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Free Driver Trip (up to ₹300)</span>
                          <span className="text-coastal-600">2,500 pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span>VIP Customer Status</span>
                          <span className="text-coastal-600">5,000 pts</span>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">How to Earn Points</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>• 1 point per ₹10 spent</div>
                        <div>• 100 bonus points for reviews</div>
                        <div>• 500 points for referrals</div>
                        <div>• Double points on weekends</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
