import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Star,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';

interface PlatformStats {
  totalUsers: number;
  activeVendors: number;
  totalBookings: number;
  monthlyRevenue: number;
  pendingApprovals: number;
  userGrowth: number;
  revenueGrowth: number;
  bookingGrowth: number;
}

interface ApprovalRequest {
  id: number;
  type: 'vendor' | 'event' | 'service';
  entityName: string;
  submitterName: string;
  submittedAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected';
  category: string;
  details: any;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | ''>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // In real implementation, these would be actual API calls
      // For now, using mock data with realistic values
      
      const mockStats: PlatformStats = {
        totalUsers: 1247,
        activeVendors: 89,
        totalBookings: 3456,
        monthlyRevenue: 234567,
        pendingApprovals: 12,
        userGrowth: 15.4,
        revenueGrowth: 23.7,
        bookingGrowth: 18.9
      };

      const mockApprovals: ApprovalRequest[] = [
        {
          id: 1,
          type: 'vendor',
          entityName: 'Coastal Heritage Homestay',
          submitterName: 'Rajesh Kumar',
          submittedAt: '2024-12-20T10:30:00Z',
          priority: 'high',
          status: 'pending',
          category: 'Homestay',
          details: {
            businessName: 'Coastal Heritage Homestay',
            ownerName: 'Rajesh Kumar',
            phone: '+91 98765 43210',
            email: 'rajesh@coastalheritage.com',
            location: 'Malpe Beach Road, Udupi',
            businessType: 'homestay',
            documents: ['business_license.pdf', 'identity_proof.pdf', 'property_photos.zip'],
            description: 'Traditional heritage homestay with authentic coastal Karnataka experience. 4 AC rooms with sea view.',
            amenities: ['AC Rooms', 'Free WiFi', 'Traditional Breakfast', 'Beach Access', 'Parking'],
            pricePerNight: 2500
          }
        },
        {
          id: 2,
          type: 'event',
          entityName: 'Udupi Cultural Festival',
          submitterName: 'Priya Nayak',
          submittedAt: '2024-12-20T14:15:00Z',
          priority: 'medium',
          status: 'pending',
          category: 'Cultural Event',
          details: {
            eventName: 'Udupi Cultural Festival',
            organizer: 'Cultural Association of Udupi',
            eventDate: '2024-12-25',
            venue: 'Krishna Temple Complex',
            description: 'Annual cultural festival showcasing traditional dance, music and local crafts',
            expectedAttendees: 500,
            ticketPrice: 100,
            contact: 'priya@culturalassociation.org'
          }
        },
        {
          id: 3,
          type: 'vendor',
          entityName: 'Mitra Samaj Restaurant',
          submitterName: 'Suresh Bhat',
          submittedAt: '2024-12-20T16:45:00Z',
          priority: 'medium',
          status: 'pending',
          category: 'Restaurant',
          details: {
            businessName: 'Mitra Samaj Restaurant',
            ownerName: 'Suresh Bhat',
            phone: '+91 98765 54321',
            email: 'suresh@mitrasamaj.com',
            location: 'Car Street, Udupi',
            businessType: 'restaurant',
            cuisineType: 'Traditional Udupi',
            seatingCapacity: 80,
            openingHours: '11:00 AM - 3:00 PM, 7:00 PM - 9:30 PM',
            averageCost: 300
          }
        }
      ];

      setStats(mockStats);
      setApprovals(mockApprovals);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (approval: ApprovalRequest, action: 'approve' | 'reject') => {
    try {
      setLoading(true);
      
      // In real implementation, this would be an API call
      const response = await fetch('/api/admin/approvals/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          approvalId: approval.id,
          action,
          notes: adminNotes
        })
      });

      if (response.ok) {
        // Update approval status locally
        setApprovals(prev => prev.map(a => 
          a.id === approval.id 
            ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' }
            : a
        ));
        
        // Reset form
        setSelectedApproval(null);
        setApprovalAction('');
        setAdminNotes('');
        
        // Show success message
        alert(`${approval.entityName} has been ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      }

    } catch (error) {
      console.error('Error processing approval:', error);
      alert('Failed to process approval. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    const typeMatch = filterType === 'all' || approval.type === filterType;
    const priorityMatch = filterPriority === 'all' || approval.priority === filterPriority;
    const statusMatch = approval.status === 'pending';
    return typeMatch && priorityMatch && statusMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && !stats) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage platform operations and approvals</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{stats?.userGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeVendors}</div>
                <p className="text-xs text-muted-foreground">
                  Across all categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalBookings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{stats?.bookingGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats?.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{stats?.revenueGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="approvals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="approvals" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Approvals
                {stats?.pendingApprovals > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {stats.pendingApprovals}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="vendors">
                <Building className="h-4 w-4 mr-2" />
                Vendors
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <Calendar className="h-4 w-4 mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Approvals Tab */}
            <TabsContent value="approvals" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      Pending Approvals ({filteredApprovals.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="vendor">Vendors</SelectItem>
                          <SelectItem value="event">Events</SelectItem>
                          <SelectItem value="service">Services</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredApprovals.map((approval) => (
                      <div key={approval.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{approval.entityName}</h3>
                              <Badge className={getPriorityColor(approval.priority)}>
                                {approval.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">
                                {approval.type.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span>Submitted by: {approval.submitterName}</span>
                              <span>•</span>
                              <span>{new Date(approval.submittedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                              <span>•</span>
                              <span>{approval.category}</span>
                            </div>
                            
                            {/* Quick Details */}
                            <div className="text-sm text-gray-700 space-y-1">
                              {approval.type === 'vendor' && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{approval.details.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{approval.details.phone}</span>
                                  </div>
                                </>
                              )}
                              {approval.type === 'event' && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Date: {new Date(approval.details.eventDate).toLocaleDateString('en-IN')}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>Expected: {approval.details.expectedAttendees} attendees</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Review: {approval.entityName}</DialogTitle>
                                  <DialogDescription>
                                    Submitted by {approval.submitterName} on {new Date(approval.submittedAt).toLocaleDateString('en-IN')}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4">
                                  {/* Detailed Information */}
                                  <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(approval.details).map(([key, value]) => (
                                      <div key={key}>
                                        <Label className="text-sm font-medium text-gray-600">
                                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </Label>
                                        <p className="text-sm">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Admin Notes */}
                                  <div>
                                    <Label htmlFor="adminNotes">Admin Notes</Label>
                                    <Textarea
                                      id="adminNotes"
                                      placeholder="Add your review notes..."
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                </div>

                                <DialogFooter className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedApproval(null);
                                      setAdminNotes('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleApprovalAction(approval, 'reject')}
                                    disabled={loading}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                  <Button
                                    onClick={() => handleApprovalAction(approval, 'approve')}
                                    disabled={loading}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredApprovals.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No pending approvals found</p>
                        <p className="text-sm">All submissions have been reviewed</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vendors Tab */}
            <TabsContent value="vendors" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Active Vendors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Paradise Beach Resort', type: 'Homestay', location: 'Malpe Beach', status: 'Active', revenue: 45000 },
                        { name: 'Udupi Grand Restaurant', type: 'Restaurant', location: 'Car Street', status: 'Active', revenue: 28000 },
                        { name: 'Coastal Tours & Travels', type: 'Driver', location: 'Udupi', status: 'Active', revenue: 15000 },
                        { name: 'Heritage Photo Studio', type: 'Creator', location: 'Manipal', status: 'Active', revenue: 12000 }
                      ].map((vendor, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{vendor.name}</h4>
                            <p className="text-sm text-gray-600">{vendor.type} • {vendor.location}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-1">{vendor.status}</Badge>
                            <p className="text-sm font-medium">₹{vendor.revenue.toLocaleString()}/month</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vendor Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Top Rated Vendors</span>
                        <Badge variant="outline">4.8+ Rating</Badge>
                      </div>
                      {[
                        { name: 'Paradise Beach Resort', rating: 4.9, bookings: 156 },
                        { name: 'Udupi Grand Restaurant', rating: 4.8, bookings: 234 },
                        { name: 'Heritage Photo Studio', rating: 4.8, bookings: 89 }
                      ].map((vendor, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{vendor.name}</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{vendor.rating}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{vendor.bookings} bookings</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Vendor Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Vendor List
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Send Notifications
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Sync Vendor Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { id: 'CB001', customer: 'Arjun Patel', service: 'Paradise Beach Resort', amount: 2500, status: 'Confirmed' },
                        { id: 'CB002', customer: 'Priya Sharma', service: 'Udupi Grand Restaurant', amount: 850, status: 'Completed' },
                        { id: 'CB003', customer: 'Rajesh Kumar', service: 'Coastal Tours', amount: 1200, status: 'Pending' },
                        { id: 'CB004', customer: 'Meera Nair', service: 'Heritage Photo', amount: 3500, status: 'Confirmed' }
                      ].map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium text-sm">{booking.id}</p>
                            <p className="text-xs text-gray-600">{booking.customer}</p>
                            <p className="text-xs">{booking.service}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">₹{booking.amount}</p>
                            <Badge variant={booking.status === 'Completed' ? 'default' : booking.status === 'Confirmed' ? 'secondary' : 'destructive'} className="text-xs">
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Today's Bookings</span>
                        <span className="font-medium">47</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">This Week</span>
                        <span className="font-medium">312</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">This Month</span>
                        <span className="font-medium">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Cancellation Rate</span>
                        <span className="font-medium text-red-600">3.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Booking Value</span>
                        <span className="font-medium">₹1,850</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { service: 'Homestays', bookings: 145, revenue: 362500 },
                        { service: 'Restaurants', bookings: 234, revenue: 187200 },
                        { service: 'Drivers', bookings: 89, revenue: 106800 },
                        { service: 'Events', bookings: 67, revenue: 201000 },
                        { service: 'Creators', bookings: 43, revenue: 129000 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{item.service}</p>
                            <p className="text-xs text-gray-600">{item.bookings} bookings</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">₹{item.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Management Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Bookings
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Refresh Data
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Advanced Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Revenue Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">₹2.34L</p>
                          <p className="text-sm text-gray-600">This Month</p>
                          <p className="text-xs text-green-600">+23.7% vs last month</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">₹28.4L</p>
                          <p className="text-sm text-gray-600">This Year</p>
                          <p className="text-xs text-blue-600">+45.2% vs last year</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Revenue by Service</h4>
                        {[
                          { service: 'Homestays', amount: 85600, percentage: 36.5 },
                          { service: 'Restaurants', amount: 67400, percentage: 28.8 },
                          { service: 'Events', amount: 48200, percentage: 20.6 },
                          { service: 'Drivers', amount: 22100, percentage: 9.4 },
                          { service: 'Creators', amount: 11200, percentage: 4.7 }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{item.service}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-500 h-2 rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">₹{item.amount.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">1,247</p>
                          <p className="text-sm text-gray-600">Total Users</p>
                          <p className="text-xs text-purple-600">+15.4% this month</p>
                        </div>
                        <div className="text-center p-4 bg-indigo-50 rounded-lg">
                          <p className="text-2xl font-bold text-indigo-600">89</p>
                          <p className="text-sm text-gray-600">Active Vendors</p>
                          <p className="text-xs text-indigo-600">+8.5% this month</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">User Engagement</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Daily Active Users</span>
                            <span className="font-medium">342</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Weekly Active Users</span>
                            <span className="font-medium">856</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Monthly Active Users</span>
                            <span className="font-medium">1,247</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">User Retention Rate</span>
                            <span className="font-medium text-green-600">78.5%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Platform Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Average Page Load</span>
                        <span className="font-medium text-green-600">1.2s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">API Response Time</span>
                        <span className="font-medium text-green-600">0.8s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Uptime</span>
                        <span className="font-medium text-green-600">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Error Rate</span>
                        <span className="font-medium text-red-600">0.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Geographic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { location: 'Udupi', users: 456, percentage: 36.6 },
                        { location: 'Manipal', users: 234, percentage: 18.8 },
                        { location: 'Mangalore', users: 189, percentage: 15.2 },
                        { location: 'Kundapur', users: 145, percentage: 11.6 },
                        { location: 'Other', users: 223, percentage: 17.8 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{item.location}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{item.percentage}%</span>
                            <span className="text-sm font-medium">{item.users}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Referral Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { source: 'Direct', visits: 445, percentage: 35.7 },
                        { source: 'Google Search', visits: 298, percentage: 23.9 },
                        { source: 'Social Media', visits: 189, percentage: 15.2 },
                        { source: 'Word of Mouth', visits: 156, percentage: 12.5 },
                        { source: 'Other', visits: 159, percentage: 12.7 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{item.source}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{item.percentage}%</span>
                            <span className="text-sm font-medium">{item.visits}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Analytics Report
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Refresh Data
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Setup Alerts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
