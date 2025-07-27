import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { swiggyTheme } from '@/lib/swiggy-design-system';
import { layouts } from '@/lib/design-system';
import {
  Menu,
  X,
  Home,
  Building,
  Car,
  UtensilsCrossed,
  Users,
  Phone,
  Mail,
  User,
  LogOut,
  Settings,
  Heart,
  Bell,
  Search,
  MapPin,
  Star,
  Calendar,
  Briefcase,
  UserPlus,
  ChevronDown,
  ShoppingBag,
  Camera,
  Globe,
  Compass,
  Bed,
  ChefHat,
  Sparkles,
  Store,
  MoreHorizontal
} from 'lucide-react';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setBusinessDropdownOpen(false);
  }, [location.pathname]);

  // Consumer-focused main navigation
  const mainNavItems = [
    {
      label: 'Hotels & Homestays',
      href: '/homestays',
      icon: <Bed className="h-4 w-4" />,
      description: 'Hotels, resorts & homestays',
      color: 'text-blue-600'
    },
    {
      label: 'Restaurants',
      href: '/eateries',
      icon: <ChefHat className="h-4 w-4" />,
      description: 'Local restaurants & dining',
      color: 'text-orange-600'
    },
    {
      label: 'Rides',
      href: '/drivers',
      icon: <Car className="h-4 w-4" />,
      description: 'Trusted local transport',
      color: 'text-green-600'
    },
    {
      label: 'Experiences',
      href: '/events',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Events & cultural activities',
      color: 'text-purple-600'
    },
    {
      label: 'Creators',
      href: '/creators',
      icon: <Camera className="h-4 w-4" />,
      description: 'Photography & content',
      color: 'text-pink-600'
    }
  ];

  // Business/vendor related items (hidden in dropdown)
  const businessNavItems = [
    {
      label: 'List Your Business',
      href: '/vendor-register',
      icon: <Store className="h-4 w-4" />,
      description: 'Register your homestay, restaurant, or service'
    },
    {
      label: 'Event Organizer',
      href: '/organizer-register',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Organize and promote local events'
    },
    {
      label: 'Business Dashboard',
      href: '/business-dashboard',
      icon: <Briefcase className="h-4 w-4" />,
      description: 'Manage your business listings'
    },
    {
      label: 'Partner Portal',
      href: '/partner-with-us',
      icon: <Users className="h-4 w-4" />,
      description: 'Join our partner network'
    }
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
          : 'bg-white/90 backdrop-blur-sm border-b border-gray-100'
      } ${className}`}
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className={layouts.container}>
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            aria-label="coastalConnect home"
          >
            <div className="relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Ff02d77f44d21496f8520d656967049db?format=webp&width=800"
                alt="coastalConnect"
                className="h-12 w-12 object-contain"
              />
              <div className="absolute -top-1 -right-1">
                <Badge className="bg-orange-500 text-white text-xs px-1 py-0 h-4 text-[10px] font-bold rounded-full">
                  LIVE
                </Badge>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-gray-900 text-xl">coastalConnect</div>
              <div className="text-xs text-gray-500 -mt-1">Coastal Karnataka • Live</div>
            </div>
          </Link>

          {/* Desktop Navigation - Consumer Focused */}
          <div className="hidden lg:flex items-center space-x-1" role="menubar">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`group relative px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActiveRoute(item.href)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                <div className="flex items-center space-x-2">
                  <span className={isActiveRoute(item.href) ? 'text-orange-600' : 'text-gray-500 group-hover:text-gray-700'}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                
                {/* Hover tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {item.description}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </Link>
            ))}

            {/* Explore More Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <MoreHorizontal className="h-4 w-4" />
                <span className="font-medium">More</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* More Services Dropdown */}
              <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="p-2">
                  <Link to="/services" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg">
                      <Sparkles className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">All Services</div>
                      <div className="text-xs text-gray-500">Beauty, wellness, shopping & more</div>
                    </div>
                  </Link>
                  <Link to="/search" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <Search className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Advanced Search</div>
                      <div className="text-xs text-gray-500">Find exactly what you're looking for</div>
                    </div>
                  </Link>
                  <Link to="/about" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                      <Globe className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">About Us</div>
                      <div className="text-xs text-gray-500">Our story & mission</div>
                    </div>
                  </Link>
                  <Link to="/contact" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                      <Phone className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Contact</div>
                      <div className="text-xs text-gray-500">Get in touch with us</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Business Portal (Hidden Dropdown) */}
            <div className="hidden lg:block relative group">
              <button 
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
                onMouseEnter={() => setBusinessDropdownOpen(true)}
                onMouseLeave={() => setBusinessDropdownOpen(false)}
              >
                <Briefcase className="h-4 w-4" />
                <span className="font-medium">Business</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {/* Business Dropdown */}
              <div 
                className={`absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-200 z-10 ${
                  businessDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setBusinessDropdownOpen(true)}
                onMouseLeave={() => setBusinessDropdownOpen(false)}
              >
                <div className="p-4">
                  <div className="text-sm font-semibold text-gray-900 mb-3">Partner with coastalConnect</div>
                  <div className="space-y-1">
                    {businessNavItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hidden lg:flex relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>

                {/* User menu */}
                <div className="relative group">
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden lg:block font-medium">{user?.name || 'User'}</span>
                    <ChevronDown className="h-4 w-4 hidden lg:block" />
                  </Button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="p-4 border-b border-gray-100">
                      <div className="font-semibold text-gray-900">{user?.name}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                    <div className="py-2">
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <User className="h-4 w-4 mr-3" />
                        My Profile
                      </Link>
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <Calendar className="h-4 w-4 mr-3" />
                        My Bookings
                      </Link>
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <Heart className="h-4 w-4 mr-3" />
                        Favorites
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button 
                          onClick={logout}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <Link 
                      to="/" 
                      onClick={handleMobileMenuClose}
                      className="flex items-center space-x-3"
                    >
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Ff02d77f44d21496f8520d656967049db?format=webp&width=800"
                        alt="coastalConnect"
                        className="h-10 w-10 object-contain"
                      />
                      <div>
                        <div className="font-bold text-gray-900">coastalConnect</div>
                        <div className="text-xs text-gray-500">Coastal Karnataka</div>
                      </div>
                    </Link>
                  </div>

                  {/* Navigation Items */}
                  <div className="flex-1 py-6">
                    <div className="space-y-2">
                      {mainNavItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={handleMobileMenuClose}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActiveRoute(item.href)
                              ? 'text-orange-600 bg-orange-50'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <span className={isActiveRoute(item.href) ? 'text-orange-600' : 'text-gray-500'}>
                            {item.icon}
                          </span>
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    {/* More Services */}
                    <div className="space-y-2">
                      <div className="px-4 py-2 text-sm font-semibold text-gray-900">More Services</div>
                      <Link to="/services" onClick={handleMobileMenuClose} className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                        <Sparkles className="h-4 w-4" />
                        <span>All Services</span>
                      </Link>
                      <Link to="/search" onClick={handleMobileMenuClose} className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                        <Search className="h-4 w-4" />
                        <span>Search</span>
                      </Link>
                      <Link to="/about" onClick={handleMobileMenuClose} className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                        <Globe className="h-4 w-4" />
                        <span>About</span>
                      </Link>
                      <Link to="/contact" onClick={handleMobileMenuClose} className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                        <Phone className="h-4 w-4" />
                        <span>Contact</span>
                      </Link>
                    </div>

                    <Separator className="my-6" />

                    {/* Business Portal (Mobile) */}
                    <div className="space-y-2">
                      <div className="px-4 py-2 text-sm font-semibold text-gray-900">For Business</div>
                      {businessNavItems.slice(0, 2).map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={handleMobileMenuClose}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          {item.icon}
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 pt-6">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user?.name}</div>
                            <div className="text-sm text-gray-500">{user?.email}</div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => { logout(); handleMobileMenuClose(); }}
                          variant="outline"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link to="/login" onClick={handleMobileMenuClose}>
                          <Button 
                            variant="outline" 
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={handleMobileMenuClose}>
                          <Button
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                          >
                            Get Started
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
