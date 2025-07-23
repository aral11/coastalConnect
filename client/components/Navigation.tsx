import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { designSystem, layouts } from '@/lib/design-system';
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
  UserPlus
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
      href: '/hotels',
      icon: <Building className="h-4 w-4" />,
      description: 'Authentic local stays'
    },
    {
      label: 'Drivers',
      href: '/drivers',
      icon: <Car className="h-4 w-4" />,
      description: 'Trusted transportation'
    },
    {
      label: 'Eateries',
      href: '/eateries',
      icon: <UtensilsCrossed className="h-4 w-4" />,
      description: 'Local cuisine experiences'
    },
    {
      label: 'Creators',
      href: '/creators',
      icon: <Users className="h-4 w-4" />,
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
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
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
                src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Fd353be6a54374bebb7d9c1f516095097?format=webp&width=800"
                alt="coastalConnect"
                className="h-8 lg:h-10 transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute -top-1 -right-1">
                <Badge className="bg-orange-500 text-white text-xs px-1 py-0 h-4 text-[10px] font-bold">
                  LIVE
                </Badge>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-gray-900 text-lg">coastalConnect</div>
              <div className="text-xs text-gray-500 -mt-1">Udupi • Manipal</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8" role="menubar">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`group relative px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActiveRoute(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                role="menuitem"
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {item.description}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </Link>
            ))}
            
            <Separator orientation="vertical" className="h-6" />
            
            {secondaryNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActiveRoute(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                role="menuitem"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 p-0 flex items-center justify-center">
                    2
                  </Badge>
                </Button>
                
                <Link to="/favorites">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Button>
                </Link>

                <Link to="/dashboard">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name || 'Dashboard'}
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/vendor-register">
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    <Briefcase className="h-4 w-4 mr-2" />
                    For Vendors
                  </Button>
                </Link>

                <Link to="/organizer-register">
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                    <Calendar className="h-4 w-4 mr-2" />
                    Event Organizer
                  </Button>
                </Link>

                <Link to="/login">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                    Sign In
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <MobileNavContent
                navItems={navItems}
                secondaryNavItems={secondaryNavItems}
                isAuthenticated={isAuthenticated}
                user={user}
                logout={logout}
                onClose={handleMobileMenuClose}
                isActiveRoute={isActiveRoute}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar (appears on scroll on mobile) */}
      {scrolled && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants, hotels..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      )}
    </nav>
  );
}

// Mobile Navigation Content
function MobileNavContent({
  navItems,
  secondaryNavItems,
  isAuthenticated,
  user,
  logout,
  onClose,
  isActiveRoute
}: {
  navItems: any[];
  secondaryNavItems: any[];
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
  onClose: () => void;
  isActiveRoute: (href: string) => boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fa92c07345b2448db8df3322125c3b3e6%2Fd353be6a54374bebb7d9c1f516095097?format=webp&width=800"
            alt="coastalConnect"
            className="h-8"
          />
          <div>
            <div className="font-bold text-gray-900">coastalConnect</div>
            <div className="text-xs text-gray-500">Udupi • Manipal</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* User Section */}
      {isAuthenticated && (
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{user?.name || 'User'}</div>
              <div className="text-sm text-gray-600">{user?.email}</div>
            </div>
          </div>
          <div className="flex space-x-2 mt-3">
            <Link to="/dashboard" className="flex-1" onClick={onClose}>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/favorites" className="flex-1" onClick={onClose}>
              <Button variant="outline" size="sm" className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                  isActiveRoute(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
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
                onClick={onClose}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                  isActiveRoute(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/search" onClick={onClose}>
                <Button variant="outline" size="sm" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </Link>
              <Link to="/locations" onClick={onClose}>
                <Button variant="outline" size="sm" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Locations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        {!isAuthenticated ? (
          <div className="space-y-3">
            <Link to="/vendor-register" onClick={onClose}>
              <Button variant="outline" className="w-full border-green-600 text-green-600">
                <Briefcase className="h-4 w-4 mr-2" />
                For Vendors
              </Button>
            </Link>
            <Link to="/organizer-register" onClick={onClose}>
              <Button variant="outline" className="w-full border-orange-600 text-orange-600">
                <Calendar className="h-4 w-4 mr-2" />
                Event Organizer
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link to="/login" className="flex-1" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" className="flex-1" onClick={onClose}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              logout();
              onClose();
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        )}

        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500">
            Live in Udupi & Manipal
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Mangalore Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}
