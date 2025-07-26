import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { designSystem, layouts, swiggyTheme } from '@/lib/design-system';
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
  Camera
} from 'lucide-react';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
  }, [location.pathname]);

  const navItems = [
    {
      label: 'Homestays',
      href: '/homestays',
      icon: <Building className="h-4 w-4" />,
      description: 'Authentic local stays'
    },
    {
      label: 'Eateries',
      href: '/eateries',
      icon: <UtensilsCrossed className="h-4 w-4" />,
      description: 'Local cuisine experiences'
    },
    {
      label: 'Drivers',
      href: '/drivers',
      icon: <Car className="h-4 w-4" />,
      description: 'Trusted transportation'
    },
    {
      label: 'Creators',
      href: '/creators',
      icon: <Camera className="h-4 w-4" />,
      description: 'Local content creators'
    }
  ];

  const secondaryNavItems = [
    {
      label: 'About',
      href: '/about',
      icon: <Mail className="h-4 w-4" />
    },
    {
      label: 'Contact',
      href: '/contact',
      icon: <Phone className="h-4 w-4" />
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
                <Badge className="bg-green-500 text-white text-xs px-1 py-0 h-4 text-[10px] font-bold rounded-full">
                  LIVE
                </Badge>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-gray-900 text-xl">coastalConnect</div>
              <div className="text-xs text-gray-500 -mt-1">Udupi • Manipal</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1" role="menubar">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`group relative px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActiveRoute(item.href)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
                role="menuitem"
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                
                {/* Hover tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {item.description}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Secondary nav items (desktop only) */}
            <div className="hidden lg:flex items-center space-x-2">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="px-3 py-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Vendor registration */}
            <Link to="/vendor-register" className="hidden lg:block">
              <Button 
                variant="outline" 
                size="sm"
                className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-medium px-4 py-2 rounded-xl transition-all duration-200"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                For Vendors
              </Button>
            </Link>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hidden lg:flex relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>

                {/* User menu */}
                <div className="relative group">
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden lg:block font-medium">{user?.name || 'User'}</span>
                    <ChevronDown className="h-4 w-4 hidden lg:block" />
                  </Button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-4 border-b border-gray-100">
                      <div className="font-semibold text-gray-900">{user?.name}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                    <div className="py-2">
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <User className="h-4 w-4 mr-3" />
                        My Profile
                      </Link>
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <Calendar className="h-4 w-4 mr-3" />
                        My Bookings
                      </Link>
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
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
                    className="font-medium text-gray-700 hover:text-orange-600 px-4 py-2 rounded-xl"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
                  className="lg:hidden p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl"
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
                        <div className="text-xs text-gray-500">Udupi • Manipal</div>
                      </div>
                    </Link>
                  </div>

                  {/* Navigation Items */}
                  <div className="flex-1 py-6">
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={handleMobileMenuClose}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActiveRoute(item.href)
                              ? 'text-orange-600 bg-orange-50'
                              : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                          }`}
                        >
                          {item.icon}
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-2">
                      {secondaryNavItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={handleMobileMenuClose}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 pt-6">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
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
                            className="w-full border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl"
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={handleMobileMenuClose}>
                          <Button 
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl"
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
