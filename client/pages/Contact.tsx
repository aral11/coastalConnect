import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HeadphonesIcon,
  HelpCircle
} from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="Contact Us"
          subtitle="Get in touch with our team for support, partnerships, or general inquiries"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Contact', href: '/contact' }
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-orange-500" />
                    <span>Phone Support</span>
                  </CardTitle>
                  <CardDescription>Speak with our support team</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-gray-900">+91 9876543210</p>
                  <p className="text-sm text-gray-600 mt-1">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-gray-600">Sat: 10:00 AM - 4:00 PM</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <span>Email Support</span>
                  </CardTitle>
                  <CardDescription>Send us an email anytime</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-gray-900">hello@coastalconnect.in</p>
                  <p className="text-sm text-gray-600 mt-1">We'll respond within 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    <span>Office Location</span>
                  </CardTitle>
                  <CardDescription>Visit our headquarters</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-gray-900">Mangalore, Karnataka</p>
                  <p className="text-sm text-gray-600 mt-1">Near Light House Hill Road</p>
                  <p className="text-sm text-gray-600">Mangalore - 575001</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <span>Business Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
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
                    <span>Help Center</span>
                  </Link>
                  <Link to="/support" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                    <HeadphonesIcon className="h-4 w-4" />
                    <span>Support Portal</span>
                  </Link>
                  <Link to="/feedback" className="flex items-center space-x-2 text-orange-600 hover:text-orange-700">
                    <MessageCircle className="h-4 w-4" />
                    <span>Feedback</span>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
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
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="booking">Booking Issue</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="complaint">Complaint</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us more about your inquiry..."
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
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
