/**
 * Analytics Dashboard Component
 * Real-time analytics using Supabase data
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase, trackEvent } from '@/lib/supabase';
import {
  Users,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  Briefcase,
  MapPin,
  Clock,
  RefreshCw,
  BarChart3,
  PieChart,
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
  avgRating: number;
  activeVendors: number;
  newUsersToday: number;
  bookingsToday: number;
  revenueToday: number;
  topServices: Array<{
    name: string;
    bookings: number;
    revenue: number;
  }>;
  monthlyGrowth: {
    users: number;
    bookings: number;
    revenue: number;
  };
  categoryStats: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

interface AnalyticsDashboardProps {
  userRole?: 'admin' | 'vendor' | 'customer';
  vendorId?: string;
}

export default function AnalyticsDashboard({ userRole = 'admin', vendorId }: AnalyticsDashboardProps) {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
    avgRating: 0,
    activeVendors: 0,
    newUsersToday: 0,
    bookingsToday: 0,
    revenueToday: 0,
    topServices: [],
    monthlyGrowth: { users: 0, bookings: 0, revenue: 0 },
    categoryStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalyticsData();
    setupRealtimeUpdates();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadAnalyticsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userRole, vendorId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Track analytics view
      await trackEvent('analytics_viewed', {
        user_id: user?.id,
        user_role: userRole,
        vendor_id: vendorId,
        timestamp: new Date().toISOString(),
      });

      if (userRole === 'admin') {
        await loadAdminAnalytics();
      } else if (userRole === 'vendor' && vendorId) {
        await loadVendorAnalytics(vendorId);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminAnalytics = async () => {
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const firstDayOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString();
    const lastDayOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString();

    // Get basic counts
    const [
      usersResult,
      servicesResult,
      bookingsResult,
      vendorsResult,
      ratingsResult,
    ] = await Promise.allSettled([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'vendor'),
      supabase.from('services').select('average_rating').not('average_rating', 'is', null),
    ]);

    // Get today's data
    const [
      newUsersResult,
      bookingsTodayResult,
    ] = await Promise.allSettled([
      supabase.from('users').select('id', { count: 'exact', head: true })
        .gte('created_at', today),
      supabase.from('bookings').select('total_amount')
        .gte('created_at', today),
    ]);

    // Calculate revenue and stats
    const totalRevenue = bookingsResult.status === 'fulfilled' 
      ? await calculateTotalRevenue() 
      : 0;
    
    const revenueToday = bookingsTodayResult.status === 'fulfilled'
      ? bookingsTodayResult.value.data?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
      : 0;

    const avgRating = ratingsResult.status === 'fulfilled'
      ? calculateAverageRating(ratingsResult.value.data || [])
      : 0;

    // Get category stats
    const categoryStats = await loadCategoryStats();

    // Calculate monthly growth
    const monthlyGrowth = await calculateMonthlyGrowth(firstDayOfMonth, firstDayOfLastMonth, lastDayOfLastMonth);

    setData({
      totalUsers: usersResult.status === 'fulfilled' ? usersResult.value.count || 0 : 0,
      totalServices: servicesResult.status === 'fulfilled' ? servicesResult.value.count || 0 : 0,
      totalBookings: bookingsResult.status === 'fulfilled' ? bookingsResult.value.count || 0 : 0,
      totalRevenue,
      avgRating,
      activeVendors: vendorsResult.status === 'fulfilled' ? vendorsResult.value.count || 0 : 0,
      newUsersToday: newUsersResult.status === 'fulfilled' ? newUsersResult.value.count || 0 : 0,
      bookingsToday: bookingsTodayResult.status === 'fulfilled' ? bookingsTodayResult.value.data?.length || 0 : 0,
      revenueToday,
      topServices: [],
      monthlyGrowth,
      categoryStats,
    });
  };

  const loadVendorAnalytics = async (vendorId: string) => {
    const today = new Date().toISOString().split('T')[0];

    // Get vendor-specific data
    const [
      servicesResult,
      bookingsResult,
      ratingsResult,
    ] = await Promise.allSettled([
      supabase.from('services').select('*').eq('vendor_id', vendorId),
      supabase.from('bookings').select('*').eq('vendor_id', vendorId),
      supabase.from('services').select('average_rating').eq('vendor_id', vendorId)
        .not('average_rating', 'is', null),
    ]);

    const services = servicesResult.status === 'fulfilled' ? servicesResult.value.data || [] : [];
    const bookings = bookingsResult.status === 'fulfilled' ? bookingsResult.value.data || [] : [];
    
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
    const bookingsToday = bookings.filter(booking => booking.created_at >= today).length;
    const revenueToday = bookings
      .filter(booking => booking.created_at >= today)
      .reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

    const avgRating = ratingsResult.status === 'fulfilled'
      ? calculateAverageRating(ratingsResult.value.data || [])
      : 0;

    setData({
      totalUsers: 0, // Not relevant for vendors
      totalServices: services.length,
      totalBookings: bookings.length,
      totalRevenue,
      avgRating,
      activeVendors: 1,
      newUsersToday: 0, // Not relevant for vendors
      bookingsToday,
      revenueToday,
      topServices: services.map(service => ({
        name: service.name,
        bookings: bookings.filter(b => b.service_id === service.id).length,
        revenue: bookings.filter(b => b.service_id === service.id)
          .reduce((sum, b) => sum + (b.total_amount || 0), 0),
      })).sort((a, b) => b.bookings - a.bookings).slice(0, 5),
      monthlyGrowth: { users: 0, bookings: 0, revenue: 0 },
      categoryStats: [],
    });
  };

  const calculateTotalRevenue = async () => {
    try {
      const { data } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('payment_status', 'completed');
      
      return data?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
    } catch (error) {
      console.error('Error calculating revenue:', error);
      return 0;
    }
  };

  const calculateAverageRating = (ratings: Array<{ average_rating: number }>) => {
    const validRatings = ratings.filter(r => r.average_rating > 0);
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((sum, r) => sum + r.average_rating, 0);
    return Math.round((sum / validRatings.length) * 10) / 10;
  };

  const loadCategoryStats = async () => {
    try {
      const { data } = await supabase
        .from('services')
        .select('service_type')
        .eq('status', 'approved');

      if (!data) return [];

      const categoryMap = data.reduce((acc, service) => {
        acc[service.service_type] = (acc[service.service_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = data.length;
      return Object.entries(categoryMap).map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / total) * 100),
      }));
    } catch (error) {
      console.error('Error loading category stats:', error);
      return [];
    }
  };

  const calculateMonthlyGrowth = async (thisMonth: string, lastMonthStart: string, lastMonthEnd: string) => {
    try {
      const [thisMonthUsers, lastMonthUsers, thisMonthBookings, lastMonthBookings] = await Promise.allSettled([
        supabase.from('users').select('id', { count: 'exact', head: true }).gte('created_at', thisMonth),
        supabase.from('users').select('id', { count: 'exact', head: true })
          .gte('created_at', lastMonthStart).lte('created_at', lastMonthEnd),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', thisMonth),
        supabase.from('bookings').select('id', { count: 'exact', head: true })
          .gte('created_at', lastMonthStart).lte('created_at', lastMonthEnd),
      ]);

      const thisMonthUserCount = thisMonthUsers.status === 'fulfilled' ? thisMonthUsers.value.count || 0 : 0;
      const lastMonthUserCount = lastMonthUsers.status === 'fulfilled' ? lastMonthUsers.value.count || 0 : 0;
      const thisMonthBookingCount = thisMonthBookings.status === 'fulfilled' ? thisMonthBookings.value.count || 0 : 0;
      const lastMonthBookingCount = lastMonthBookings.status === 'fulfilled' ? lastMonthBookings.value.count || 0 : 0;

      return {
        users: lastMonthUserCount > 0 ? Math.round(((thisMonthUserCount - lastMonthUserCount) / lastMonthUserCount) * 100) : 0,
        bookings: lastMonthBookingCount > 0 ? Math.round(((thisMonthBookingCount - lastMonthBookingCount) / lastMonthBookingCount) * 100) : 0,
        revenue: 0, // Simplified for now
      };
    } catch (error) {
      console.error('Error calculating monthly growth:', error);
      return { users: 0, bookings: 0, revenue: 0 };
    }
  };

  const setupRealtimeUpdates = () => {
    const channel = supabase.channel('analytics_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        // Refresh data when bookings change
        setTimeout(loadAnalyticsData, 1000);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        // Refresh data when users change
        setTimeout(loadAnalyticsData, 1000);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const isPositive = value >= 0;
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        {Math.abs(value)}%
      </div>
    );
  };

  const statCards = [
    {
      title: userRole === 'admin' ? 'Total Users' : 'Total Services',
      value: userRole === 'admin' ? data.totalUsers : data.totalServices,
      icon: userRole === 'admin' ? Users : Briefcase,
      growth: userRole === 'admin' ? data.monthlyGrowth.users : null,
      color: 'blue',
    },
    {
      title: 'Total Bookings',
      value: data.totalBookings,
      icon: Calendar,
      growth: data.monthlyGrowth.bookings,
      color: 'green',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(data.totalRevenue),
      icon: DollarSign,
      growth: data.monthlyGrowth.revenue,
      color: 'purple',
    },
    {
      title: 'Average Rating',
      value: data.avgRating.toFixed(1),
      icon: Star,
      suffix: '/5.0',
      color: 'yellow',
    },
  ];

  if (userRole === 'admin') {
    statCards.splice(3, 0, {
      title: 'Active Vendors',
      value: data.activeVendors,
      icon: Briefcase,
      growth: null,
      color: 'orange',
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {userRole === 'admin' ? 'Platform Analytics' : 'Vendor Analytics'}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnalyticsData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold">
                        {stat.value}
                        {stat.suffix && <span className="text-sm text-gray-600">{stat.suffix}</span>}
                      </p>
                    </div>
                    {stat.growth !== null && (
                      <div className="mt-2">
                        {formatPercentage(stat.growth)}
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userRole === 'admin' && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Users</span>
                <Badge variant="secondary">{data.newUsersToday}</Badge>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Bookings</span>
              <Badge variant="secondary">{data.bookingsToday}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Revenue Today</span>
              <Badge variant="secondary">{formatCurrency(data.revenueToday)}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution (Admin only) */}
        {userRole === 'admin' && data.categoryStats.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Service Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.categoryStats.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium capitalize">
                        {category.category.replace('_', ' ')}
                      </span>
                      <Progress value={category.percentage} className="w-24" />
                    </div>
                    <div className="text-sm text-gray-600">
                      {category.count} ({category.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Services (Vendor only) */}
        {userRole === 'vendor' && data.topServices.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Top Performing Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.topServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {service.bookings} bookings • {formatCurrency(service.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
