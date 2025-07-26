import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  Users,
  Calendar,
  Star,
  ArrowLeft,
  Settings,
  BarChart3,
  DollarSign,
  Clock,
  MapPin,
  Eye,
  MessageSquare
} from 'lucide-react';

interface BusinessMetrics {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  activeListings: number;
  pendingBookings: number;
}

interface RecentBooking {
  id: string;
  customerName: string;
  service: string;
  date: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

export default function BusinessDashboard() {
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    activeListings: 0,
    pendingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate API calls - replace with actual endpoints
        const metricsResponse = await fetch('/api/business/metrics');
        const bookingsResponse = await fetch('/api/business/recent-bookings');
        
        if (metricsResponse.ok && bookingsResponse.ok) {
          const metricsData = await metricsResponse.json();
          const bookingsData = await bookingsResponse.json();
          
          setMetrics(metricsData.data || {
            totalBookings: 42,
            totalRevenue: 15600,
            averageRating: 4.6,
            totalReviews: 38,
            activeListings: 5,
            pendingBookings: 3
          });
          
          setRecentBookings(bookingsData.data || [
            { id: '1', customerName: 'Priya Sharma', service: 'Beach Resort Stay', date: '2024-01-15', amount: 3500, status: 'confirmed' },
            { id: '2', customerName: 'Rajesh Kumar', service: 'Local Tour Guide', date: '2024-01-14', amount: 1200, status: 'completed' },
            { id: '3', customerName: 'Anita Desai', service: 'Coastal Photography', date: '2024-01-13', amount: 2800, status: 'pending' }
          ]);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set fallback data
        setMetrics({
          totalBookings: 42,
          totalRevenue: 15600,
          averageRating: 4.6,
          totalReviews: 38,
          activeListings: 5,
          pendingBookings: 3
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
                  <p className="text-gray-600">Manage your business and track performance</p>
                </div>
              </div>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">₹{metrics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metrics.totalBookings}</div>
                <p className="text-xs text-blue-600 mt-1">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metrics.averageRating}</div>
                <p className="text-xs text-gray-600 mt-1">{metrics.totalReviews} reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Listings</CardTitle>
                <Eye className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metrics.activeListings}</div>
                <p className="text-xs text-purple-600 mt-1">{metrics.pendingBookings} pending</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Latest bookings for your services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{booking.customerName}</h4>
                            <p className="text-sm text-gray-600">{booking.service}</p>
                            <p className="text-xs text-gray-500">{booking.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">₹{booking.amount}</p>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your business efficiently</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Bookings
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Customer Messages
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Business Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                  <CardDescription>Manage all your customer bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center py-8">Bookings management interface coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Business Analytics</CardTitle>
                  <CardDescription>Detailed insights and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center py-8">Analytics dashboard coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>Manage customer feedback and ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center py-8">Reviews management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
