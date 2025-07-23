import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  Users,
  Eye,
  Plus,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Send,
  TrendingUp,
  DollarSign,
  Star
} from 'lucide-react';

interface EventStats {
  total_events: number;
  draft_events: number;
  submitted_events: number;
  pending_approval: number;
  approved_events: number;
  published_events: number;
  completed_events: number;
  upcoming_events: number;
}

interface RegistrationStats {
  total_revenue: number;
  total_registrations: number;
  average_rating: number;
}

interface RecentEvent {
  id: number;
  title: string;
  event_date: string;
  status: string;
  admin_approval_status: string;
  current_registrations: number;
  view_count: number;
}

interface OrganizerData {
  id: number;
  organization_name: string;
  contact_person: string;
  email: string;
  verification_status: string;
}

export default function EventOrganizerDashboard() {
  const [organizerData, setOrganizerData] = useState<OrganizerData | null>(null);
  const [eventStats, setEventStats] = useState<EventStats | null>(null);
  const [registrationStats, setRegistrationStats] = useState<RegistrationStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('organizer_token');
      const storedOrganizer = localStorage.getItem('organizer_data');

      if (!token) {
        window.location.href = '/organizer-login';
        return;
      }

      if (storedOrganizer) {
        setOrganizerData(JSON.parse(storedOrganizer));
      }

      const response = await fetch('/api/organizers/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setEventStats(data.data.event_stats);
        setRegistrationStats(data.data.registration_stats);
        setRecentEvents(data.data.recent_events);
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('organizer_token');
    localStorage.removeItem('organizer_data');
    window.location.href = '/organizer-login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Event Organizer Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = '/organizer/events/create'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Verification Status Alert */}
        {organizerData?.verification_status !== 'verified' && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Account Verification Pending:</strong> Your organizer account is still being verified. 
              You can create draft events, but they won't be published until your account is approved.
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {organizerData?.contact_person}!
          </h2>
          <p className="text-gray-600">
            {organizerData?.organization_name} • {organizerData?.email}
          </p>
          <Badge className={`mt-2 ${organizerData?.verification_status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {organizerData?.verification_status === 'verified' ? 'Verified Organizer' : 'Pending Verification'}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900">{eventStats?.total_events || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-3xl font-bold text-gray-900">{registrationStats?.total_registrations || 0}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{registrationStats?.total_revenue?.toLocaleString() || 0}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {registrationStats?.average_rating ? registrationStats.average_rating.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Status Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Event Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{eventStats?.draft_events || 0}</div>
                  <div className="text-sm text-gray-500">Draft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{eventStats?.pending_approval || 0}</div>
                  <div className="text-sm text-gray-500">Pending Approval</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{eventStats?.approved_events || 0}</div>
                  <div className="text-sm text-gray-500">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{eventStats?.published_events || 0}</div>
                  <div className="text-sm text-gray-500">Published</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/organizer/events/create'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/organizer/events'}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Manage Events
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/organizer/profile'}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/organizer/analytics'}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Events</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/organizer/events'}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <div className="space-y-4">
                {recentEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.event_date)}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        <Badge className={getApprovalStatusColor(event.admin_approval_status)}>
                          {event.admin_approval_status}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {event.current_registrations} registered
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {event.view_count} views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.location.href = `/organizer/events/${event.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {event.status === 'draft' && (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => window.location.href = `/organizer/events/${event.id}/submit`}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first event to start building your community
                </p>
                <Button 
                  onClick={() => window.location.href = '/organizer/events/create'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
