import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Anchor,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.token, data.data.user);

        // Check if there's a pending booking to continue
        const pendingBooking = localStorage.getItem('pendingBooking');
        if (pendingBooking) {
          localStorage.removeItem('pendingBooking');
          const booking = JSON.parse(pendingBooking);
          navigate(`/${booking.type}s`); // Navigate to hotels or drivers page
        } else {
          navigate(redirectTo);
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Mock Google OAuth flow
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: 'mock_google_token' }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.token, data.data.user);
        navigate(redirectTo);
      } else {
        setError(data.message || 'Google login failed');
      }
    } catch (error) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Mock Apple OAuth flow
      const response = await fetch('/api/auth/apple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: 'mock_apple_token' }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.token, data.data.user);
        navigate(redirectTo);
      } else {
        setError(data.message || 'Apple login failed');
      }
    } catch (error) {
      setError('Apple login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coastal-50 via-white to-ocean-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center text-coastal-600 hover:text-coastal-700 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <Card className="card-coastal shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Fabdf57ca676049e3bb2813b741a90763?format=webp&width=800"
                alt="coastalConnect"
                className="logo-brand h-12"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your Coastal Connect account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-coastal-600 hover:text-coastal-700">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full btn-coastal h-11" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={handleAppleLogin}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C8.396 0 8.000.018 8.000.018 7.986.136 7.987.262 8.005.398c.037.28.151.559.287.821.136.262.29.511.454.736.162.225.342.427.535.612.193.185.394.351.608.493.214.142.443.263.683.356.241.094.493.161.753.201.26.040.529.053.803.041.275-.013.557-.049.841-.108.284-.059.571-.141.859-.246.288-.105.579-.233.872-.381.292-.148.587-.317.883-.505.295-.188.593-.396.893-.623.300-.227.603-.473.908-.738.305-.265.614-.549.925-.852.311-.303.625-.625.941-.966.316-.341.635-.701.957-1.08.322-.378.647-.775.975-1.191l.034-.045c.127-.172.252-.35.375-.533.123-.184.243-.372.361-.565.118-.193.233-.391.345-.594.113-.203.222-.410.328-.622.106-.213.208-.430.306-.651.098-.222.192-.447.283-.677s.177-.464.261-.702c.084-.238.163-.480.238-.726.075-.247.145-.498.211-.753.066-.255.127-.514.184-.777.057-.263.110-.530.158-.800.048-.271.091-.545.130-.822.039-.278.073-.558.103-.841L24 0H12.017z"/>
                </svg>
                Apple
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/signup" className="text-coastal-600 hover:text-coastal-700 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>By signing in, you agree to our</p>
          <div className="flex justify-center space-x-4 mt-1">
            <Link to="/terms" className="text-coastal-600 hover:text-coastal-700">Terms of Service</Link>
            <span>•</span>
            <Link to="/privacy" className="text-coastal-600 hover:text-coastal-700">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
