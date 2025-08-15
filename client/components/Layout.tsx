import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import MobileBottomNav from './MobileBottomNav';
import FloatingSearch from './FloatingSearch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { designSystem, layouts } from '@/lib/design-system';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Heart,
  Star,
  Users,
  Shield,
  Clock,
  Award,
  Zap,
  ArrowUp
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showBackToTop?: boolean;
  fullWidth?: boolean;
}

export default function Layout({ 
  children, 
  className = '', 
  showBackToTop = true,
  fullWidth = false 
}: LayoutProps) {
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className={`flex-1 ${className} pb-16 lg:pb-0`}>
        {fullWidth ? children : (
          <div className={layouts.container}>
            {children}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Floating Search (Mobile) */}
      <FloatingSearch />

      {/* Back to Top Button - Adjusted for mobile nav */}
      {showBackToTop && showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-20 lg:bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="sm"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

// Footer Component
function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Services',
      links: [
        { label: 'Hotels & Homestays', href: '/homestays' },
        { label: 'Restaurants & Cafes', href: '/eateries' },
        { label: 'Local Transport', href: '/drivers' },
        { label: 'Content Creators', href: '/creators' },
        { label: 'Events & Experiences', href: '/events' },
        { label: 'Beauty & Wellness', href: '/beauty-wellness' },
        { label: 'All Services', href: '/services' }
      ]
    },
    {
      title: 'Business',
      links: [
        { label: 'List Your Business', href: '/vendor-register' },
        { label: 'Event Organizer Portal', href: '/organizer-register' },
        { label: 'Business Dashboard', href: '/business-dashboard' },
        { label: 'Partner with Us', href: '/partner-with-us' },
        { label: 'Advertise with Us', href: '/advertise' },
        { label: 'Bulk Bookings', href: '/bulk-bookings' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Customer Support', href: '/support' },
        { label: 'Safety Guidelines', href: '/safety' },
        { label: 'Report an Issue', href: '/report-issue' },
        { label: 'Send Feedback', href: '/feedback' },
        { label: 'Contact Us', href: '/contact' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About coastalConnect', href: '/about' },
        { label: 'Join Our Team', href: '/careers' },
        { label: 'Press & Media', href: '/press' },
        { label: 'Travel Blog', href: '/blog' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className={layouts.container}>
        <div className="py-12 lg:py-16">
          {/* Top Section */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Ff02d77f44d21496f8520d656967049db?format=webp&width=800"
                  alt="coastalConnect"
                  className="h-10"
                />
                <div>
                  <div className="text-white font-bold text-xl">coastalConnect</div>
                  <div className="text-sm text-gray-400">Your Coastal Karnataka Experience</div>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Discover authentic coastal Karnataka with our comprehensive platform connecting
                travelers to hotels, resorts, homestays, restaurants, local transport, and talented creators.
                Experience the real charm of Udupi and Manipal.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>Verified Services</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span>Local Community</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span>Top Rated</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/coastalvibes.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/coastalconnect.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label="Like us on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/coastalconnect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com/c/coastalvibes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Links Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8 bg-gray-800" />

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-white font-medium mb-2">
                <MapPin className="h-4 w-4" />
                <span>Locations</span>
              </div>
              <div className="text-sm text-gray-400">
                <div>🟢 Live: Udupi & Manipal</div>
                <div>🏖️ Focus: Coastal Karnataka</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-white font-medium mb-2">
                <Phone className="h-4 w-4" />
                <span>Support</span>
              </div>
              <div className="text-sm text-gray-400">
                <div>
                  <a href="tel:+918105003858" className="hover:text-white transition-colors">
                    📞 +91 8105 003 858
                  </a>
                </div>
                <div>⏰ 24/7 Available</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-white font-medium mb-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <div className="text-sm text-gray-400">
                <div>
                  <a href="mailto:admin@coastalconnect.in" className="hover:text-white transition-colors">
                    📧 admin@coastalconnect.in
                  </a>
                </div>
                <div>
                  <a href="https://www.coastalconnect.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    🌐 www.coastalconnect.in
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-white font-medium mb-2">
                <Users className="h-4 w-4" />
                <span>Community</span>
              </div>
              <div className="text-sm text-gray-400">
                <div>
                  <a href="https://instagram.com/coastalvibes.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    📸 @coastalvibes.in
                  </a>
                </div>
                <div>
                  <a href="https://youtube.com/c/coastalvibes" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    🎬 Coastal Vibes Channel
                  </a>
                </div>
              </div>
            </div>
          </div>


          {/* Platform Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-gray-400">Verified Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">10k+</div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-gray-400">Local Creators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">4.8★</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className={layouts.container}>
          <div className="py-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400 text-center md:text-left">
              <div>© {currentYear} coastalConnect. All rights reserved.</div>
              <div className="mt-1">
                Founded by <span className="text-white font-medium">Aral Aldrin John D'Souza</span> • 
                Powered by <span className="text-blue-400">Coastal Vibes</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Quick action components for mobile optimization
export function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="grid grid-cols-5 h-16">
        <Link to="/" className="flex flex-col items-center justify-center text-xs space-y-1 hover:bg-gray-50">
          <MapPin className="h-5 w-5 text-gray-600" />
          <span className="text-gray-600">Home</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center justify-center text-xs space-y-1 hover:bg-gray-50">
          <Users className="h-5 w-5 text-gray-600" />
          <span className="text-gray-600">Search</span>
        </Link>
        <Link to="/bookings" className="flex flex-col items-center justify-center text-xs space-y-1 hover:bg-gray-50">
          <Heart className="h-5 w-5 text-gray-600" />
          <span className="text-gray-600">Bookings</span>
        </Link>
        <Link to="/favorites" className="flex flex-col items-center justify-center text-xs space-y-1 hover:bg-gray-50">
          <Star className="h-5 w-5 text-gray-600" />
          <span className="text-gray-600">Favorites</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center text-xs space-y-1 hover:bg-gray-50">
          <Users className="h-5 w-5 text-gray-600" />
          <span className="text-gray-600">Profile</span>
        </Link>
      </div>
    </div>
  );
}
