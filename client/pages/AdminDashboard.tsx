import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MessageSquare
} from 'lucide-react';

interface PendingItem {
  type: string;
  id: number;
  title: string;
  location: string;
  created_at: string;
  admin_approval_status: string;
}

interface AdminStats {
  pendingApprovals: number;
  approvedToday: number;
  rejectedToday: number;
  totalUsers: number;
  totalBookings: number;
  revenueToday: number;
}

interface DataSummary {
  homestays: number;
  eateries: number;
  drivers: number;
  creators: number;
  events: number;
  bookings: number;
  users: number;
  reviews: number;
}

export default function AdminDashboard() {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null);
  const [clearConfirmText, setClearConfirmText] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  // Admin authentication
  const handleLogin = () => {
    if (adminKey === 'admin123') {
      setAuthenticated(true);
      fetchData();
    } else {
      setMessage({type: 'error', text: 'Invalid admin key'});
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending approvals
      const pendingResponse = await fetch('/api/admin/pending-approvals?adminKey=admin123');
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingItems(pendingData.data || []);
      }

      // Fetch admin stats
      const statsResponse = await fetch('/api/admin/dashboard-stats?adminKey=admin123');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setAdminStats(statsData.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setMessage({type: 'error', text: 'Failed to load admin data'});
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (type: string, id: number, action: 'approve' | 'reject', reason?: string) => {
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/admin/approve/${type}/${id}?adminKey=admin123`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, reason }),
      });

      if (response.ok) {
        setMessage({type: 'success', text: `${type} ${action}d successfully`});
        fetchData(); // Refresh data
      } else {
        throw new Error('Approval action failed');
      }
    } catch (error) {
      setMessage({type: 'error', text: `Failed to ${action} ${type}`});
    } finally {
      setActionLoading(false);
    }
  };

  const handleBatchAction = async (action: 'approve' | 'reject') => {
    if (selectedItems.size === 0) {
      setMessage({type: 'error', text: 'Please select items to process'});
      return;
    }

    try {
      setActionLoading(true);
      
      const items = Array.from(selectedItems).map(item => {
        const [type, id] = item.split('-');
        return { type, id: parseInt(id) };
      });

      const response = await fetch('/api/admin/batch-action?adminKey=admin123', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, action }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({type: 'success', text: result.message});
        setSelectedItems(new Set());
        fetchData();
      } else {
        throw new Error('Batch action failed');
      }
    } catch (error) {
      setMessage({type: 'error', text: `Failed to ${action} selected items`});
    } finally {
      setActionLoading(false);
    }
  };

  const toggleItemSelection = (type: string, id: number) => {
    const itemKey = `${type}-${id}`;
    const newSelection = new Set(selectedItems);
    
    if (newSelection.has(itemKey)) {
      newSelection.delete(itemKey);
    } else {
      newSelection.add(itemKey);
    }
    
    setSelectedItems(newSelection);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'homestay': return '🏠';
      case 'eatery': return '🍽️';
      case 'driver': return '🚗';
      case 'creator': return '📸';
      case 'event': return '📅';
      default: return '📄';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'homestay': return 'bg-blue-100 text-blue-800';
      case 'eatery': return 'bg-green-100 text-green-800';
      case 'driver': return 'bg-purple-100 text-purple-800';
      case 'creator': return 'bg-pink-100 text-pink-800';
      case 'event': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Login screen
  if (!authenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
              <CardDescription>
                Enter admin key to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Admin Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">
                Access Dashboard
              </Button>
              {message && (
                <Alert className={message.type === 'error' ? 'border-red-200' : 'border-green-200'}>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
              <div className="text-xs text-gray-500 text-center">
                Demo key: admin123
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage content approvals and platform oversight</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={fetchData}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAuthenticated(false)}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200' : 'border-green-200'}`}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          {adminStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                      <p className="text-3xl font-bold text-orange-600">{adminStats.pendingApprovals}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Approved Today</p>
                      <p className="text-3xl font-bold text-green-600">{adminStats.approvedToday}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-blue-600">{adminStats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                      <p className="text-3xl font-bold text-purple-600">₹{adminStats.revenueToday.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">Pending Approvals ({pendingItems.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-6">
              {/* Batch Actions */}
              {selectedItems.size > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {selectedItems.size} item(s) selected
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleBatchAction('approve')}
                          disabled={actionLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Selected
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBatchAction('reject')}
                          disabled={actionLoading}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Selected
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pending Items List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Loading pending approvals...</p>
                  </div>
                ) : pendingItems.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                      <p className="text-gray-600">No items pending approval at the moment.</p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingItems.map((item) => (
                    <Card key={`${item.type}-${item.id}`} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(`${item.type}-${item.id}`)}
                              onChange={() => toggleItemSelection(item.type, item.id)}
                              className="mt-1"
                            />
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="text-2xl">{getTypeIcon(item.type)}</span>
                                <Badge className={getTypeBadgeColor(item.type)}>
                                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                </Badge>
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                  Pending
                                </Badge>
                              </div>
                              
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {item.title}
                              </h3>
                              
                              <p className="text-gray-600 mb-2">📍 {item.location}</p>
                              
                              <p className="text-sm text-gray-500">
                                Submitted {new Date(item.created_at).toLocaleDateString()} at{' '}
                                {new Date(item.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            
                            <Button
                              size="sm"
                              onClick={() => handleApproval(item.type, item.id, 'approve')}
                              disabled={actionLoading}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApproval(item.type, item.id, 'reject')}
                              disabled={actionLoading}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>
                    Comprehensive insights into platform performance and user engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-600">Advanced analytics and reporting features coming soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                  <CardDescription>
                    Configure platform settings and approval workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings Panel</h3>
                    <p className="text-gray-600">Advanced configuration options coming soon.</p>
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
