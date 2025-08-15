import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Building2, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  FileText,
  Mail,
  Phone,
  MapPin,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/SupabaseAuthContext';

interface ApprovalStats {
  vendors: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  events: {
    pending: number;
    published: number;
    rejected: number;
    total: number;
  };
  services: {
    pending: number;
    approved: number;
    total: number;
  };
}

interface VendorApplication {
  id: number;
  applicant: {
    id: number;
    name: string;
    email: string;
    phone: string;
    memberSince: string;
  };
  business: {
    name: string;
    type: string;
    description: string;
    address: string;
    city: string;
    state: string;
  };
  documents: {
    businessLicense: string;
    gstNumber: string;
    panNumber: string;
    aadharNumber: string;
  };
  contact: {
    person: string;
    phone: string;
    email: string;
  };
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  rejectionReason?: string;
}

interface PendingEvent {
  id: number;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  startTime: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
  capacity: {
    max: number;
    current: number;
  };
  pricing: {
    ticketPrice: number;
    currency: string;
  };
  organizer: {
    id: number;
    name: string;
    email: string;
    organization: string;
  };
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<ApprovalStats | null>(null);
  const [vendorApplications, setVendorApplications] = useState<VendorApplication[]>([]);
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<PendingEvent | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (hasRole('admin')) {
      fetchDashboardData();
    }
  }, [hasRole]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Fetch all data in parallel
      const [statsRes, vendorRes, eventsRes] = await Promise.all([
        fetch('/api/admin/approval-stats', { headers }),
        fetch('/api/admin/vendor-applications?status=pending', { headers }),
        fetch('/api/admin/pending-events', { headers })
      ]);

      const [statsData, vendorData, eventsData] = await Promise.all([
        statsRes.json(),
        vendorRes.json(),
        eventsRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (vendorData.success) setVendorApplications(vendorData.data);
      if (eventsData.success) setPendingEvents(eventsData.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      
      // Fallback data for development
      setStats({
        vendors: { pending: 3, approved: 15, rejected: 2, total: 20 },
        events: { pending: 2, published: 12, rejected: 1, total: 15 },
        services: { pending: 5, approved: 45, total: 50 }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async () => {
    if (!selectedApplication && !selectedEvent) return;
    
    try {
      setActionLoading(true);
      
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      let endpoint = '';
      let body: any = {};

      if (selectedApplication) {
        endpoint = `/api/admin/vendor-applications/${selectedApplication.id}/${approvalAction}`;
        body = approvalAction === 'approve' 
          ? { adminNotes: actionNotes }
          : { rejectionReason: actionNotes };
      } else if (selectedEvent) {
        endpoint = `/api/admin/events/${selectedEvent.id}/${approvalAction}`;
        body = approvalAction === 'approve'
          ? { adminNotes: actionNotes, isFeatured: false }
          : { rejectionReason: actionNotes };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        // Refresh data
        await fetchDashboardData();
        
        // Close modal
        setSelectedApplication(null);
        setSelectedEvent(null);
        setApprovalAction(null);
        setActionNotes('');
      } else {
        throw new Error(data.message || 'Failed to process action');
      }
    } catch (error) {
      console.error('Error processing approval action:', error);
      setError(error instanceof Error ? error.message : 'Failed to process action');
    } finally {
      setActionLoading(false);
    }
  };

  if (!hasRole('admin')) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage vendor applications, events, and platform approvals</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Vendors</p>
                    <p className="text-2xl font-bold">{stats.vendors.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Approved Vendors</p>
                    <p className="text-2xl font-bold">{stats.vendors.approved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Events</p>
                    <p className="text-2xl font-bold">{stats.events.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Published Events</p>
                    <p className="text-2xl font-bold">{stats.events.published}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Services</p>
                    <p className="text-2xl font-bold">{stats.services.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Services</p>
                    <p className="text-2xl font-bold">{stats.services.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="vendors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vendors">
              Vendor Applications ({vendorApplications.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              Pending Events ({pendingEvents.length})
            </TabsTrigger>
          </TabsList>

          {/* Vendor Applications Tab */}
          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {vendorApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pending vendor applications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vendorApplications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div>
                                <h3 className="font-semibold text-lg">{application.business.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <Building2 className="h-4 w-4 mr-1" />
                                    {application.business.type}
                                  </span>
                                  <span className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {application.business.city}
                                  </span>
                                  <span className="flex items-center">
                                    <User className="h-4 w-4 mr-1" />
                                    {application.applicant.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {application.business.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {new Date(application.submittedAt).toLocaleDateString()}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedApplication(application)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Pending Events</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pending events</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingEvents.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(event.eventDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {event.venue.city}
                              </span>
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {event.organizer.name}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              ₹{event.pricing.ticketPrice}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedEvent(event)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Vendor Application Review Modal */}
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Vendor Application</DialogTitle>
            </DialogHeader>
            
            {selectedApplication && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Business Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedApplication.business.name}</p>
                      <p><strong>Type:</strong> {selectedApplication.business.type}</p>
                      <p><strong>City:</strong> {selectedApplication.business.city}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Contact Person:</strong> {selectedApplication.contact.person}</p>
                      <p><strong>Phone:</strong> {selectedApplication.contact.phone}</p>
                      <p><strong>Email:</strong> {selectedApplication.contact.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Business Description</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedApplication.business.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Documents</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Business License:</strong> {selectedApplication.documents.businessLicense}</p>
                    <p><strong>GST Number:</strong> {selectedApplication.documents.gstNumber}</p>
                    <p><strong>PAN Number:</strong> {selectedApplication.documents.panNumber}</p>
                    {selectedApplication.documents.aadharNumber && (
                      <p><strong>Aadhar Number:</strong> {selectedApplication.documents.aadharNumber}</p>
                    )}
                  </div>
                </div>

                {!approvalAction ? (
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => setApprovalAction('approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setApprovalAction('reject')}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notes">
                        {approvalAction === 'approve' ? 'Admin Notes (Optional)' : 'Rejection Reason (Required)'}
                      </Label>
                      <Textarea
                        id="notes"
                        value={actionNotes}
                        onChange={(e) => setActionNotes(e.target.value)}
                        placeholder={
                          approvalAction === 'approve' 
                            ? 'Add any notes for the vendor...'
                            : 'Please provide a reason for rejection...'
                        }
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button 
                        onClick={handleApprovalAction}
                        disabled={actionLoading || (approvalAction === 'reject' && !actionNotes.trim())}
                        className={approvalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                      >
                        {actionLoading ? 'Processing...' : `Confirm ${approvalAction}`}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setApprovalAction(null);
                          setActionNotes('');
                        }}
                        disabled={actionLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Event Review Modal - Similar structure */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Event</DialogTitle>
            </DialogHeader>
            
            {selectedEvent && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Event Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Date:</strong> {new Date(selectedEvent.eventDate).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {selectedEvent.startTime}</p>
                      <p><strong>Category:</strong> {selectedEvent.category}</p>
                      <p><strong>Ticket Price:</strong> ₹{selectedEvent.pricing.ticketPrice}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Venue & Organizer</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Venue:</strong> {selectedEvent.venue.name}</p>
                      <p><strong>Location:</strong> {selectedEvent.venue.city}</p>
                      <p><strong>Organizer:</strong> {selectedEvent.organizer.name}</p>
                      <p><strong>Max Capacity:</strong> {selectedEvent.capacity.max}</p>
                    </div>
                  </div>
                </div>

                {!approvalAction ? (
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => setApprovalAction('approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve & Publish
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setApprovalAction('reject')}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="event-notes">
                        {approvalAction === 'approve' ? 'Admin Notes (Optional)' : 'Rejection Reason (Required)'}
                      </Label>
                      <Textarea
                        id="event-notes"
                        value={actionNotes}
                        onChange={(e) => setActionNotes(e.target.value)}
                        placeholder={
                          approvalAction === 'approve' 
                            ? 'Add any notes for the organizer...'
                            : 'Please provide a reason for rejection...'
                        }
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button 
                        onClick={handleApprovalAction}
                        disabled={actionLoading || (approvalAction === 'reject' && !actionNotes.trim())}
                        className={approvalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                      >
                        {actionLoading ? 'Processing...' : `Confirm ${approvalAction}`}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setApprovalAction(null);
                          setActionNotes('');
                        }}
                        disabled={actionLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
