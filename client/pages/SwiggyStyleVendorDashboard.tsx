/**
 * CoastalConnect - Swiggy/Zomato Style Vendor Dashboard
 * Modern analytics, real-time data, and actionable insights
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase, trackEvent } from "@/lib/supabase";
import {
  TrendingUp,
  TrendingDown,
  Star,
  Users,
  Calendar,
  DollarSign,
  Eye,
  MessageCircle,
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  Settings,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
  Upload,
  Download,
  Filter,
  Search,
  ArrowRight,
  Bell,
  Gift,
  Crown,
  Zap,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Shield,
  ThumbsUp,
  Share2,
  ExternalLink,
  RefreshCw,
  Calendar as CalIcon,
} from "lucide-react";

interface VendorMetrics {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  viewsThisMonth: number;
  responseRate: number;
  completionRate: number;
  repeatCustomers: number;
  bookingTrends: { month: string; bookings: number; revenue: number }[];
  recentBookings: any[];
  upcomingBookings: any[];
  reviews: any[];
  services: any[];
}

export default function SwiggyStyleVendorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<VendorMetrics>({
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    viewsThisMonth: 0,
    responseRate: 0,
    completionRate: 0,
    repeatCustomers: 0,
    bookingTrends: [],
    recentBookings: [],
    upcomingBookings: [],
    reviews: [],
    services: [],
  });

  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadVendorData();
    loadNotifications();
  }, [selectedTimeRange]);

  const loadVendorData = async () => {
    try {
      setLoading(true);

      // Simulate vendor data loading - replace with real Supabase queries
      const mockData: VendorMetrics = {
        totalBookings: 127,
        totalRevenue: 89400,
        averageRating: 4.7,
        totalReviews: 89,
        viewsThisMonth: 1247,
        responseRate: 95,
        completionRate: 98,
        repeatCustomers: 34,
        bookingTrends: [
          { month: "Jan", bookings: 15, revenue: 12000 },
          { month: "Feb", bookings: 22, revenue: 18500 },
          { month: "Mar", bookings: 28, revenue: 23400 },
          { month: "Apr", bookings: 25, revenue: 21300 },
          { month: "May", bookings: 37, revenue: 28900 },
        ],
        recentBookings: [
          {
            id: 1,
            customer: "Priya Sharma",
            service: "Beachside Homestay",
            amount: 2400,
            status: "confirmed",
            date: "2024-01-15",
          },
          {
            id: 2,
            customer: "Raj Patel",
            service: "Local Food Tour",
            amount: 800,
            status: "pending",
            date: "2024-01-14",
          },
          {
            id: 3,
            customer: "Anita Kumar",
            service: "Driver Service",
            amount: 1200,
            status: "completed",
            date: "2024-01-13",
          },
        ],
        upcomingBookings: [
          {
            id: 4,
            customer: "Vikram Singh",
            service: "Heritage Homestay",
            amount: 3200,
            date: "2024-01-20",
            time: "2:00 PM",
          },
          {
            id: 5,
            customer: "Meera Nair",
            service: "Cooking Experience",
            amount: 1500,
            date: "2024-01-22",
            time: "10:00 AM",
          },
        ],
        reviews: [
          {
            id: 1,
            customer: "Rahul M.",
            rating: 5,
            comment: "Amazing experience! The homestay was perfect.",
            date: "2024-01-10",
          },
          {
            id: 2,
            customer: "Sneha K.",
            rating: 4,
            comment: "Great location and friendly hosts.",
            date: "2024-01-08",
          },
        ],
        services: [
          {
            id: 1,
            name: "Beachside Homestay",
            type: "homestay",
            status: "active",
            bookings: 45,
            rating: 4.8,
            price: 2400,
          },
          {
            id: 2,
            name: "Local Food Tour",
            type: "experience",
            status: "active",
            bookings: 32,
            rating: 4.6,
            price: 800,
          },
          {
            id: 3,
            name: "Driver Service",
            type: "transport",
            status: "active",
            bookings: 28,
            rating: 4.7,
            price: 1200,
          },
        ],
      };

      // Load real vendor data from Supabase
      if (user?.role === 'vendor') {
        const [bookingsResponse, servicesResponse] = await Promise.allSettled([
          supabase.from("bookings").select("*, services(name)").eq("vendor_id", user.id),
          supabase.from("services").select("*").eq("vendor_id", user.id)
        ]);

        const bookings = bookingsResponse.status === 'fulfilled' ? bookingsResponse.value.data || [] : [];
        const services = servicesResponse.status === 'fulfilled' ? servicesResponse.value.data || [] : [];

        const totalRevenue = bookings
          .filter(b => b.payment_status === 'paid')
          .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        const avgRating = services.length > 0
          ? services.reduce((sum, s) => sum + (s.average_rating || 0), 0) / services.length
          : 0;

        const recentBookings = bookings
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)
          .map(booking => ({
            id: booking.id,
            customer: booking.guest_name,
            service: booking.services?.name || 'Service',
            amount: booking.total_amount,
            status: booking.status,
            date: new Date(booking.created_at).toISOString().split('T')[0]
          }));

        const servicesData = services.map(service => ({
          id: service.id,
          name: service.name,
          type: service.service_type,
          status: service.status === 'approved' && service.is_active ? 'active' : 'inactive',
          bookings: bookings.filter(b => b.service_id === service.id).length,
          rating: service.average_rating || 0,
          price: service.base_price
        }));

        const realData: VendorMetrics = {
          totalBookings: bookings.length,
          totalRevenue,
          averageRating: Number(avgRating.toFixed(1)),
          totalReviews: services.reduce((sum, s) => sum + (s.total_reviews || 0), 0),
          viewsThisMonth: 0, // Will implement analytics later
          responseRate: 100, // Will calculate based on actual response data
          completionRate: bookings.length > 0 ? Math.round((bookings.filter(b => b.status === 'completed').length / bookings.length) * 100) : 0,
          repeatCustomers: 0, // Will calculate based on customer data
          bookingTrends: [], // Will implement monthly trends
          recentBookings,
          services: servicesData,
        };

        setMetrics(realData);
      } else {
        setMetrics(mockData); // Fallback for demo
      }

      await trackEvent("vendor_dashboard_viewed", {
        vendor_id: user?.id,
        time_range: selectedTimeRange,
      });
    } catch (error) {
      console.error("Error loading vendor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    // Real notifications will be implemented when notification system is ready
    // For now, show recent activity from bookings and reviews
    try {
      if (user?.role === 'vendor') {
        const [recentBookings, recentReviews] = await Promise.allSettled([
          supabase
            .from("bookings")
            .select("*, services(name)")
            .eq("vendor_id", user.id)
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("reviews")
            .select("*, services(name)")
            .eq("user_id", user.id)
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(2)
        ]);

        const notifications = [];
        let id = 1;

        // Add booking notifications
        if (recentBookings.status === 'fulfilled' && recentBookings.value.data) {
          recentBookings.value.data.forEach(booking => {
            notifications.push({
              id: id++,
              type: "booking",
              message: `Booking from ${booking.guest_name} for ${booking.services?.name || 'service'}`,
              time: new Date(booking.created_at).toLocaleDateString(),
              unread: new Date(booking.created_at) > new Date(Date.now() - 24*60*60*1000) // Last 24 hours
            });
          });
        }

        // Add review notifications
        if (recentReviews.status === 'fulfilled' && recentReviews.value.data) {
          recentReviews.value.data.forEach(review => {
            notifications.push({
              id: id++,
              type: "review",
              message: `New ${review.rating}-star review for ${review.services?.name || 'service'}`,
              time: new Date(review.created_at).toLocaleDateString(),
              unread: new Date(review.created_at) > new Date(Date.now() - 24*60*60*1000)
            });
          });
        }

        setNotifications(notifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "active":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "homestay":
        return "🏠";
      case "restaurant":
        return "🍽️";
      case "transport":
        return "🚗";
      case "experience":
        return "🎭";
      default:
        return "🏖️";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Loading Dashboard
              </h3>
              <p className="text-gray-600">
                Fetching your business insights...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Vendor Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your business and track performance
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Time Range Selector */}
                <Select
                  value={selectedTimeRange}
                  onValueChange={setSelectedTimeRange}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 3 months</SelectItem>
                    <SelectItem value="1year">Last year</SelectItem>
                  </SelectContent>
                </Select>

                {/* Notifications */}
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications.some((n) => n.unread) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </Button>

                {/* Add Service */}
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metrics.totalBookings}
                    </p>
                    <div className="flex items-center text-sm text-green-600 mt-2">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+12% from last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(metrics.totalRevenue)}
                    </p>
                    <div className="flex items-center text-sm text-green-600 mt-2">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+18% from last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Average Rating
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metrics.averageRating}
                    </p>
                    <div className="flex items-center text-sm text-yellow-600 mt-2">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      <span>{metrics.totalReviews} reviews</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Profile Views
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metrics.viewsThisMonth}
                    </p>
                    <div className="flex items-center text-sm text-purple-600 mt-2">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>This month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-orange-500" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-semibold">
                      {metrics.responseRate}%
                    </span>
                  </div>
                  <Progress value={metrics.responseRate} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold">
                      {metrics.completionRate}%
                    </span>
                  </div>
                  <Progress value={metrics.completionRate} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-semibold">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Repeat Customers
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {metrics.repeatCustomers}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
                  Booking Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Simple chart representation */}
                <div className="space-y-4">
                  {metrics.bookingTrends.map((trend, index) => (
                    <div
                      key={trend.month}
                      className="flex items-center space-x-4"
                    >
                      <span className="w-8 text-sm font-medium text-gray-600">
                        {trend.month}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            {trend.bookings} bookings
                          </span>
                          <span className="text-sm font-semibold">
                            {formatPrice(trend.revenue)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(trend.bookings / 40) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="services">My Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-orange-500" />
                        Recent Bookings
                      </span>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics.recentBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {booking.customer}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {booking.service}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(booking.amount)}
                            </p>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CalIcon className="h-5 w-5 mr-2 text-orange-500" />
                        Upcoming Bookings
                      </span>
                      <Button variant="outline" size="sm">
                        View Calendar
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metrics.upcomingBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {booking.customer}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {booking.service}
                            </p>
                            <p className="text-xs text-blue-600 font-medium">
                              {booking.date} at {booking.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(booking.amount)}
                            </p>
                            <div className="flex space-x-1 mt-2">
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Accept
                              </Button>
                              <Button size="sm" variant="outline">
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-orange-500" />
                      My Services
                    </span>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Service
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {metrics.services.map((service) => (
                      <div
                        key={service.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          <span className="text-4xl">
                            {getServiceIcon(service.type)}
                          </span>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {service.name}
                            </h4>
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 capitalize mb-3">
                            {service.type}
                          </p>

                          <div className="flex items-center justify-between text-sm mb-3">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-semibold">
                              {formatPrice(service.price)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm mb-4">
                            <span className="flex items-center text-gray-600">
                              <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                              {service.rating}
                            </span>
                            <span className="text-gray-600">
                              {service.bookings} bookings
                            </span>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-orange-500" />
                      Customer Reviews
                    </span>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span>
                        {metrics.averageRating} average • {metrics.totalReviews}{" "}
                        reviews
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              {review.customer}
                            </span>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-current text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <div className="flex items-center space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                          <Button size="sm" variant="outline">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Helpful
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Button variant="outline">View All Reviews</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-orange-500" />
                      Revenue by Service Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          type: "Homestays",
                          percentage: 45,
                          amount: 40230,
                          color: "bg-blue-500",
                        },
                        {
                          type: "Food Tours",
                          percentage: 30,
                          amount: 26820,
                          color: "bg-green-500",
                        },
                        {
                          type: "Transport",
                          percentage: 25,
                          amount: 22350,
                          color: "bg-purple-500",
                        },
                      ].map((item) => (
                        <div
                          key={item.type}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded ${item.color}`}
                            ></div>
                            <span className="text-gray-700">{item.type}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatPrice(item.amount)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.percentage}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-orange-500" />
                      Customer Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">New Customers</span>
                          <span className="font-semibold">67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            Returning Customers
                          </span>
                          <span className="font-semibold">33%</span>
                        </div>
                        <Progress value={33} className="h-2" />
                      </div>

                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Average Booking Value
                          </span>
                          <span className="font-semibold">
                            {formatPrice(1840)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Customer Lifetime Value
                          </span>
                          <span className="font-semibold">
                            {formatPrice(4320)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-orange-500" />
                      Business Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="h-4 w-4 mr-3" />
                      Edit Business Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Camera className="h-4 w-4 mr-3" />
                      Manage Photos
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-3" />
                      Verification Status
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Crown className="h-4 w-4 mr-3" />
                      Upgrade to Premium
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-orange-500" />
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New booking notifications</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Review notifications</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payment notifications</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Marketing emails</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
