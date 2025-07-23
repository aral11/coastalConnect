import { useState, useEffect } from 'react';
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
  TrendingUp
} from 'lucide-react';

interface Booking {
  id: number;
  type: 'homestay' | 'driver';
  reference: string;
  guest_name?: string;
  passenger_name?: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: Date;
  location: string;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock user data
  const user = {
    name: 'Aral',
    email: 'aral@coastalconnect.in',
    phone: '+91 98456 78901',
    member_since: 'January 2024'
  };

  // Mock bookings data
  const mockBookings: Booking[] = [
    {
      id: 1,
      type: 'homestay',
      reference: 'CC' + Date.now().toString(36).toUpperCase(),
      guest_name: 'Priya Sharma',
      amount: 5000,
      status: 'confirmed',
      date: new Date('2024-02-15'),
      location: 'Coastal Heritage Homestay, Malpe'
    },
    {
      id: 2,
      type: 'driver',
      reference: 'CC' + (Date.now() + 1000).toString(36).toUpperCase(),
      passenger_name: 'Rajesh Patil',
      amount: 300,
      status: 'completed',
      date: new Date('2024-02-10'),
      location: 'Krishna Temple to Malpe Beach'
    },
    {
      id: 3,
      type: 'homestay',
      reference: 'CC' + (Date.now() + 2000).toString(36).toUpperCase(),
      guest_name: 'Anita Kumar',
      amount: 3600,
      status: 'pending',
      date: new Date('2024-02-20'),
      location: 'Backwater Bliss Homestay, Brahmavar'
    }
  ];

  useEffect(() => {
    setBookings(mockBookings);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
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

  const totalSpent = bookings.reduce((sum, booking) => sum + booking.amount, 0);
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
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
              <p className="opacity-90">Welcome back, {user.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Member since</div>
              <div className="font-medium">{user.member_since}</div>
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
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Your recent homestay and driver bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                              Ref: {booking.reference}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{booking.guest_name || booking.passenger_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{booking.date.toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="flex items-center">
                          <IndianRupee className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">₹{booking.amount}</span>
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
                        {booking.status === 'completed' && (
                          <Button variant="outline" size="sm" className="text-yellow-600">
                            <Star className="h-3 w-3 mr-1" />
                            Rate
                          </Button>
                        )}
                        {booking.status === 'confirmed' && booking.type === 'homestay' && (
                          <Button variant="outline" size="sm" className="text-red-600">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 p-3 border rounded-lg bg-gray-50">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <div className="mt-1 p-3 border rounded-lg bg-gray-50">
                      {user.phone}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Member Since</label>
                    <div className="mt-1 p-3 border rounded-lg bg-gray-50">
                      {user.member_since}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="btn-coastal">Edit Profile</Button>
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
                    <div className="text-3xl font-bold mb-2">2,450 Points</div>
                    <div className="text-sm opacity-90">
                      Next reward at 3,000 points (550 points to go)
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                      <div className="bg-white h-2 rounded-full" style={{ width: '81.6%' }}></div>
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
                        <div>• 10 points per ₹100 spent</div>
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
