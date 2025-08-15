/**
 * Comprehensive Admin Dashboard for CoastalConnect
 * Manages users, vendors, services, bookings, and analytics
 */

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import {
  Shield,
  Users,
  BarChart3,
  Settings,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  UserCheck,
  Building,
  Calendar,
  TrendingUp,
  MapPin,
  Star,
  DollarSign,
  Activity,
  MessageSquare,
  FileText,
  Download,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalServices: number;
  totalBookings: number;
  pendingApprovals: number;
  totalRevenue: number;
  activeEvents: number;
  avgRating: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  business_name?: string;
  vendor_status?: string;
}

interface Service {
  id: string;
  name: string;
  service_type: string;
  status: string;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  vendor_id: string;
  users?: { name: string; business_name?: string };
}

export default function AdminDashboardFull() {
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalServices: 0,
    totalBookings: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    activeEvents: 0,
    avgRating: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  if (!hasRole("admin")) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have administrator privileges to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load dashboard statistics
      const [
        usersResponse,
        vendorsResponse,
        servicesResponse,
        bookingsResponse,
        eventsResponse,
        revenueResponse
      ] = await Promise.allSettled([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "vendor"),
        supabase.from("services").select("*"),
        supabase.from("bookings").select("*"),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("bookings").select("total_amount").eq("payment_status", "paid")
      ]);

      // Calculate statistics
      const totalUsers = usersResponse.status === 'fulfilled' ? usersResponse.value.count || 0 : 0;
      const totalVendors = vendorsResponse.status === 'fulfilled' ? vendorsResponse.value.count || 0 : 0;
      const servicesData = servicesResponse.status === 'fulfilled' ? servicesResponse.value.data || [] : [];
      const bookingsData = bookingsResponse.status === 'fulfilled' ? bookingsResponse.value.data || [] : [];
      const activeEvents = eventsResponse.status === 'fulfilled' ? eventsResponse.value.count || 0 : 0;
      const revenueData = revenueResponse.status === 'fulfilled' ? revenueResponse.value.data || [] : [];

      const pendingApprovals = servicesData.filter(s => s.status === 'pending').length;
      const totalRevenue = revenueData.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
      const avgRating = servicesData.length > 0 
        ? servicesData.reduce((sum, s) => sum + (s.average_rating || 0), 0) / servicesData.length 
        : 0;

      setStats({
        totalUsers,
        totalVendors,
        totalServices: servicesData.length,
        totalBookings: bookingsData.length,
        pendingApprovals,
        totalRevenue,
        activeEvents,
        avgRating: Number(avgRating.toFixed(1))
      });

      // Load detailed data for management
      await loadUsersAndServices();

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsersAndServices = async () => {
    try {
      const [usersResponse, servicesResponse] = await Promise.all([
        supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("services")
          .select(`
            *,
            users(name, business_name)
          `)
          .order("created_at", { ascending: false })
          .limit(20)
      ]);

      if (usersResponse.data) setUsers(usersResponse.data);
      if (servicesResponse.data) setServices(servicesResponse.data);
    } catch (error) {
      console.error("Error loading users and services:", error);
    }
  };

  const approveService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({ 
          status: "approved", 
          approved_at: new Date().toISOString(),
          approved_by: user?.id 
        })
        .eq("id", serviceId);

      if (!error) {
        await loadUsersAndServices();
        await loadDashboardData();
      }
    } catch (error) {
      console.error("Error approving service:", error);
    }
  };

  const rejectService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({ status: "rejected" })
        .eq("id", serviceId);

      if (!error) {
        await loadUsersAndServices();
        await loadDashboardData();
      }
    } catch (error) {
      console.error("Error rejecting service:", error);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ is_active: !currentStatus })
        .eq("id", userId);

      if (!error) {
        await loadUsersAndServices();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button onClick={loadDashboardData} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Link to="/">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Site
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalVendors} vendors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalServices}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingApprovals} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalBookings} total bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgRating}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeEvents} active events
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="services">Service Approvals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {users.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <Badge variant={user.role === 'vendor' ? 'secondary' : 'default'}>
                            {user.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Approvals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {services.filter(s => s.status === 'pending').slice(0, 5).map((service) => (
                        <div key={service.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-gray-500">{service.users?.business_name}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => approveService(service.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => rejectService(service.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users, vendors, and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-medium">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.business_name && (
                              <p className="text-sm text-blue-600">{user.business_name}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'vendor' ? 'secondary' : 'default'}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.is_active ? 'default' : 'secondary'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                          >
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Approvals</CardTitle>
                  <CardDescription>Review and approve vendor services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-medium">{service.name}</h3>
                            <p className="text-sm text-gray-500">{service.users?.business_name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{service.service_type}</Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs">{service.average_rating} ({service.total_reviews} reviews)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={
                              service.status === 'approved' ? 'default' : 
                              service.status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {service.status}
                          </Badge>
                          {service.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => approveService(service.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => rejectService(service.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Users</span>
                        <span className="font-medium">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Vendors</span>
                        <span className="font-medium">{stats.totalVendors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Listed Services</span>
                        <span className="font-medium">{stats.totalServices}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed Bookings</span>
                        <span className="font-medium">{stats.totalBookings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Revenue</span>
                        <span className="font-medium">₹{stats.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Rating</span>
                        <span className="font-medium">{stats.avgRating}/5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Events</span>
                        <span className="font-medium">{stats.activeEvents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Approvals</span>
                        <span className="font-medium">{stats.pendingApprovals}</span>
                      </div>
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
