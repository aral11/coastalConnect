import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  Users, 
  Star, 
  MapPin, 
  Calendar,
  CreditCard,
  CheckCircle,
  BarChart3,
  ArrowUpRight,
  DollarSign
} from 'lucide-react';

interface PlatformStats {
  totalVendors: number;
  totalBookings: number;
  totalCustomers: number;
  totalEvents: number;
  averageRating: number;
  totalReviews: number;
  citiesServed: number;
  totalRevenue: number;
  bookingsThisMonth: number;
  conversionRate: string;
  averageOrderValue: string;
  customerSatisfaction: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  loading?: boolean;
}

function StatCard({ icon, title, value, subtitle, trend, trendUp, color = 'text-blue-600', loading }: StatCardProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          <div className="flex items-center space-x-2 mt-1">
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center space-x-1 text-xs ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                <ArrowUpRight className={`h-3 w-3 ${!trendUp && 'rotate-90'}`} />
                <span>{trend}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function PlatformStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchRealStats();
    
    // Update stats every 5 minutes
    const interval = setInterval(fetchRealStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchRealStats = async () => {
    try {
      setError(null);

      // First test if API is reachable
      console.log('Testing API connectivity...');
      const debugResponse = await fetch('/api/debug/stats');
      console.log('Debug response status:', debugResponse.status);

      if (debugResponse.status === 404) {
        throw new Error('API endpoints not found - check server routes');
      }

      const response = await fetch('/api/real/stats');
      console.log('Stats response status:', response.status);
      console.log('Stats response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        const text = await response.text();
        console.log('Response text:', text.substring(0, 200));
        throw new Error(`HTTP ${response.status}: ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to load statistics');
      
      // Fallback to basic stats for demonstration
      setStats({
        totalVendors: 25,
        totalBookings: 134,
        totalCustomers: 289,
        totalEvents: 18,
        averageRating: 4.3,
        totalReviews: 156,
        citiesServed: 5,
        totalRevenue: 245000,
        bookingsThisMonth: 42,
        conversionRate: '15.2',
        averageOrderValue: '1830',
        customerSatisfaction: '86'
      });
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  const statCards = stats ? [
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Active Vendors',
      value: stats.totalVendors,
      subtitle: 'Verified partners',
      trend: '+12%',
      trendUp: true,
      color: 'text-blue-600'
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'Total Bookings',
      value: stats.totalBookings,
      subtitle: 'All time',
      trend: `+${stats.bookingsThisMonth} this month`,
      trendUp: true,
      color: 'text-green-600'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Happy Customers',
      value: stats.totalCustomers,
      subtitle: 'Registered users',
      trend: '+8%',
      trendUp: true,
      color: 'text-purple-600'
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Live Events',
      value: stats.totalEvents,
      subtitle: 'Published events',
      color: 'text-orange-600'
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: 'Platform Rating',
      value: stats.averageRating.toFixed(1),
      subtitle: `${stats.totalReviews} reviews`,
      trend: stats.averageRating >= 4.0 ? 'Excellent' : 'Good',
      trendUp: stats.averageRating >= 4.0,
      color: 'text-yellow-600'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Cities Served',
      value: stats.citiesServed,
      subtitle: 'Across Karnataka',
      color: 'text-red-600'
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      subtitle: 'Platform earnings',
      trend: '+24%',
      trendUp: true,
      color: 'text-emerald-600'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      subtitle: 'Booking success',
      trend: '+2.1%',
      trendUp: true,
      color: 'text-indigo-600'
    }
  ] : [];

  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <StatCard key={index} icon={<div />} title="" value="" loading={true} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Platform in Numbers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time statistics showing the growth and success of our coastal Karnataka marketplace
          </p>
          
          {lastUpdated && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <BarChart3 className="h-4 w-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              {error && (
                <Badge variant="secondary" className="ml-2">
                  Fallback Data
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="text-yellow-600">⚠️</div>
              <div>
                <p className="text-sm font-medium text-yellow-800">Using fallback data</p>
                <p className="text-xs text-yellow-700">Database connection issue: {error}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchRealStats}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        {/* Additional Metrics */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Average Order Value</h3>
                  <p className="text-sm text-gray-600">Per booking</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                ₹{stats.averageOrderValue}
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Customer Satisfaction</h3>
                  <p className="text-sm text-gray-600">Based on reviews</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {stats.customerSatisfaction}%
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
                  <p className="text-sm text-gray-600">New bookings</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {stats.bookingsThisMonth}
              </p>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Join thousands of satisfied customers and trusted vendors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Start Booking
            </Button>
            <Button variant="outline">
              Become a Vendor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
