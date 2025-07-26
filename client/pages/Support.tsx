import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft,
  HeadphonesIcon,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Search,
  FileText,
  User,
  Calendar,
  CreditCard,
  MapPin,
  Shield,
  Star,
  HelpCircle
} from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created: string;
  lastUpdate: string;
}

interface SupportForm {
  name: string;
  email: string;
  phone: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  bookingId?: string;
}

export default function Support() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [formData, setFormData] = useState<SupportForm>({
    name: '',
    email: '',
    phone: '',
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    bookingId: ''
  });

  useEffect(() => {
    fetchSupportTickets();
  }, []);

  const fetchSupportTickets = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTickets: SupportTicket[] = [
        {
          id: 'TK001',
          subject: 'Booking Cancellation Request',
          category: 'booking',
          status: 'in-progress',
          priority: 'medium',
          created: '2024-01-15',
          lastUpdate: '2024-01-16'
        },
        {
          id: 'TK002',
          subject: 'Payment Issue',
          category: 'payment',
          status: 'resolved',
          priority: 'high',
          created: '2024-01-14',
          lastUpdate: '2024-01-15'
        }
      ];
      setTickets(mockTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleInputChange = (field: keyof SupportForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Support Ticket Created",
          description: "We've received your request and will respond within 24 hours.",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: '',
          priority: 'medium',
          subject: '',
          description: '',
          bookingId: ''
        });
        
        fetchSupportTickets();
      } else {
        throw new Error('Failed to create support ticket');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit support request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const supportCategories = [
    { value: 'booking', label: 'Booking Issues', icon: Calendar },
    { value: 'payment', label: 'Payment & Billing', icon: CreditCard },
    { value: 'account', label: 'Account Issues', icon: User },
    { value: 'technical', label: 'Technical Support', icon: HelpCircle },
    { value: 'service', label: 'Service Quality', icon: Star },
    { value: 'safety', label: 'Safety Concerns', icon: Shield },
    { value: 'general', label: 'General Inquiry', icon: MessageCircle }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="Customer Support"
          subtitle="Get dedicated support for your bookings, account issues, and general inquiries"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Support', href: '/support' }
          ]}
        />

        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center border-2 border-orange-200 hover:border-orange-300 transition-colors">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-2xl font-bold text-orange-600 mb-2">+91 9876543210</p>
                <p className="text-sm text-gray-600">Available 24/7</p>
                <Button className="mt-4 bg-orange-500 hover:bg-orange-600" size="sm">
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-6">
                <MessageCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Get instant help from our support team</p>
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50" size="sm">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-green-200 hover:border-green-300 transition-colors">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-2">hello@coastalconnect.in</p>
                <p className="text-sm text-gray-600">Response within 2 hours</p>
                <Button variant="outline" className="mt-4 border-green-500 text-green-600 hover:bg-green-50" size="sm">
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Support Request Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HeadphonesIcon className="h-5 w-5 text-orange-500" />
                  <span>Create Support Ticket</span>
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Issue Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bookingId">Booking ID (if applicable)</Label>
                      <Input
                        id="bookingId"
                        value={formData.bookingId}
                        onChange={(e) => handleInputChange('bookingId', e.target.value)}
                        placeholder="BK001234"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Please provide detailed information about your issue..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Ticket...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="h-4 w-4 mr-2" />
                        Create Support Ticket
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Support Tickets & Info */}
            <div className="space-y-6">
              {/* Recent Tickets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span>Your Recent Tickets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tickets.length > 0 ? (
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                            <div className="flex gap-2">
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status.replace('-', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Ticket ID: {ticket.id}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            Created: {new Date(ticket.created).toLocaleDateString()}
                            <span className="mx-2">•</span>
                            Updated: {new Date(ticket.lastUpdate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No support tickets yet</p>
                      <p className="text-sm text-gray-500">Create your first ticket above</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-green-500" />
                    <span>Support Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Currently Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/help" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help Center & FAQ</span>
                  </Link>
                  <Link to="/safety" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                    <Shield className="h-4 w-4" />
                    <span>Safety Guidelines</span>
                  </Link>
                  <Link to="/contact" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                    <Mail className="h-4 w-4" />
                    <span>Contact Information</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
