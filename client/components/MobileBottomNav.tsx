import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Search,
  Calendar,
  Heart,
  User,
  Bed,
  ChefHat,
  Car,
  Camera,
  Compass
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

export default function MobileBottomNav() {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: <Home className="h-5 w-5" />,
      activeIcon: <Home className="h-5 w-5 fill-current" />
    },
    {
      id: 'discover',
      label: 'Discover', 
      href: '/search',
      icon: <Compass className="h-5 w-5" />,
      activeIcon: <Compass className="h-5 w-5 fill-current" />
    },
    {
      id: 'stays',
      label: 'Stays',
      href: '/homestays',
      icon: <Bed className="h-5 w-5" />,
      activeIcon: <Bed className="h-5 w-5 fill-current" />
    },
    {
      id: 'food',
      label: 'Food',
      href: '/eateries', 
      icon: <ChefHat className="h-5 w-5" />,
      activeIcon: <ChefHat className="h-5 w-5 fill-current" />
    },
    {
      id: 'profile',
      label: 'Profile',
      href: '/dashboard',
      icon: <User className="h-5 w-5" />,
      activeIcon: <User className="h-5 w-5 fill-current" />
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          
          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 text-xs transition-all duration-200 relative',
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full"></div>
              )}
              
              {/* Icon with scaling animation */}
              <div className={cn(
                'transition-transform duration-200',
                isActive && 'scale-110'
              )}>
                {isActive ? item.activeIcon : item.icon}
              </div>
              
              {/* Label */}
              <span className={cn(
                'font-medium transition-all duration-200',
                isActive && 'font-semibold'
              )}>
                {item.label}
              </span>
              
              {/* Background highlight */}
              {isActive && (
                <div className="absolute inset-0 bg-blue-50 rounded-lg opacity-50 -z-10"></div>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for iPhone X and newer */}
      <div className="h-safe-area-inset-bottom bg-white"></div>
    </div>
  );
}

// Hook for using mobile bottom nav aware layouts
export function useMobileBottomNavHeight() {
  return {
    paddingBottom: '5rem', // Account for bottom nav height + safe area
    marginBottom: 'calc(4rem + env(safe-area-inset-bottom))'
  };
}
