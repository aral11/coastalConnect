import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Car, 
  Home, 
  Star, 
  Users, 
  Shield, 
  Clock, 
  Phone,
  Mail,
  ChevronRight,
  Waves,
  Anchor
} from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-coastal-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-coastal-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Fabdf57ca676049e3bb2813b741a90763?format=webp&width=800"
                alt="coastalConnect"
                className="logo-brand h-10"
              />
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/hotels" className="text-gray-600 hover:text-coastal-600 transition-colors">Hotels</Link>
              <Link to="/drivers" className="text-gray-600 hover:text-coastal-600 transition-colors">Drivers</Link>
              <Link to="/about" className="text-gray-600 hover:text-coastal-600 transition-colors">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-coastal-600 transition-colors">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-coastal-600 hover:text-coastal-700">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-coastal">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section py-20 lg:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Waves className="h-8 w-8 mr-3 animate-wave text-coral-300" />
              <Badge variant="secondary" className="bg-coral-500/20 text-white border-coral-400/30">
                Your Coastal Adventure Starts Here
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Discover
              <span className="block bg-gradient-to-r from-ocean-300 to-white bg-clip-text text-transparent">
                Udupi Karnataka
              </span>
            </h1>

            <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Experience authentic coastal Karnataka culture in Udupi. Find traditional homestays,
              authentic local eateries, and trusted drivers for your spiritual and cultural journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/hotels">
                <Button size="lg" className="btn-coral text-lg px-8 py-4 min-w-[200px]">
                  <Home className="mr-2 h-5 w-5" />
                  Find Hotels
                </Button>
              </Link>
              <Link to="/drivers">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4 min-w-[200px]">
                  <Car className="mr-2 h-5 w-5" />
                  Book Drivers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Udupi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Authentic Udupi experiences - from traditional homestays to local eateries and temple visits
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Hotels & Homestays */}
            <div className="card-coastal p-8 group cursor-pointer">
              <div className="flex items-center mb-6">
                <div className="bg-coastal-100 rounded-lg p-3 mr-4 group-hover:bg-coastal-200 transition-colors">
                  <Home className="h-8 w-8 text-coastal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Hotels & Homestays</h3>
                  <p className="text-coastal-600">Comfortable accommodations by the coast</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span>Verified properties with authentic reviews</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 text-coastal-500 mr-2" />
                  <span>Prime coastal locations</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span>Secure booking with instant confirmation</span>
                </div>
              </div>

              <Link to="/hotels">
                <Button className="w-full btn-coastal group-hover:shadow-lg">
                  Explore Hotels
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Driver Services */}
            <div className="card-coastal p-8 group cursor-pointer">
              <div className="flex items-center mb-6">
                <div className="bg-ocean-100 rounded-lg p-3 mr-4 group-hover:bg-ocean-200 transition-colors">
                  <Car className="h-8 w-8 text-ocean-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Driver Services</h3>
                  <p className="text-ocean-600">Professional drivers for your journey</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <span>Licensed and experienced drivers</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 text-orange-500 mr-2" />
                  <span>24/7 availability</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span>Safe and insured rides</span>
                </div>
              </div>

              <Link to="/drivers">
                <Button className="w-full btn-ocean group-hover:shadow-lg">
                  Book a Driver
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-coastal-500 to-ocean-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-float">
              <div className="text-4xl lg:text-5xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Properties</div>
            </div>
            <div className="animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="text-4xl lg:text-5xl font-bold mb-2">200+</div>
              <div className="text-lg opacity-90">Drivers</div>
            </div>
            <div className="animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-4xl lg:text-5xl font-bold mb-2">10K+</div>
              <div className="text-lg opacity-90">Happy Guests</div>
            </div>
            <div className="animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="text-4xl lg:text-5xl font-bold mb-2">4.9</div>
              <div className="text-lg opacity-90">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready for Your Coastal Adventure?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust Coastal Connect for their perfect coastal experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="btn-coastal text-lg px-8 py-4">
                Get Started Today
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-coastal-300 text-coastal-600 hover:bg-coastal-50 text-lg px-8 py-4">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Fabdf57ca676049e3bb2813b741a90763?format=webp&width=800"
                  alt="coastalConnect"
                  className="logo-brand h-8 brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for coastal accommodations and transportation services.
              </p>
              <div className="flex space-x-4">
                <Mail className="h-5 w-5 text-gray-400" />
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/hotels" className="hover:text-white transition-colors">Hotels & Homestays</Link></li>
                <li><Link to="/drivers" className="hover:text-white transition-colors">Driver Services</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: hello@coastalconnect.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Coastal Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
