import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Lock,
  AlertCircle,
  Calendar,
  Users,
  Building,
  CheckCircle
} from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export default function EventOrganizerLogin() {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/organizers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('organizer_token', data.data.token);
        localStorage.setItem('organizer_data', JSON.stringify(data.data.organizer));
        
        // Redirect to dashboard
        window.location.href = '/organizer-dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Login Form */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Event Organizer Login
            </CardTitle>
            <p className="text-gray-600">
              Sign in to manage your events on coastalConnect
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Your password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <a href="/organizer-register" className="text-blue-600 hover:underline font-medium">
                    Register here
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  <a href="/forgot-password" className="text-gray-500 hover:underline">
                    Forgot your password?
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right Side - Features & Benefits */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Organize Events with coastalConnect
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Reach thousands of people in Udupi & Manipal. Manage registrations, promote your events, and build your community.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-lg p-3 mr-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Event Management</h3>
                  <p className="text-gray-600">
                    Create, edit, and manage your events with our intuitive dashboard. 
                    Track registrations and attendee engagement in real-time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start">
                <div className="bg-green-100 rounded-lg p-3 mr-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reach Your Audience</h3>
                  <p className="text-gray-600">
                    Connect with locals and tourists in Udupi & Manipal. 
                    Your events get featured on our platform with thousands of active users.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-lg p-3 mr-4">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Tools</h3>
                  <p className="text-gray-600">
                    Get access to analytics, participant management, and promotional tools 
                    to make your events successful.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Trusted by Local Organizers</h3>
            </div>
            <p className="mb-4">
              Join cultural societies, educational institutions, and community groups 
              who trust coastalConnect for their event management needs.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                Cultural Events
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Religious Functions
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Sports Competitions
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Educational Workshops
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
