import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  User, 
  Settings, 
  BarChart3, 
  Users, 
  Building2, 
  Calendar, 
  CreditCard,
  Shield,
  Briefcase,
  Star,
  Bell,
  FileText,
  MapPin
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: <Home className="h-5 w-5" />,
    roles: ['admin', 'vendor', 'customer', 'event_organizer']
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ['admin', 'vendor', 'customer', 'event_organizer']
  },
  // Admin only sections
  {
    path: '/admin',
    label: 'Admin Panel',
    icon: <Shield className="h-5 w-5" />,
    roles: ['admin'],
    children: [
      {
        path: '/admin/users',
        label: 'User Management',
        icon: <Users className="h-4 w-4" />,
        roles: ['admin']
      },
      {
        path: '/admin/vendors',
        label: 'Vendor Approvals',
        icon: <Building2 className="h-4 w-4" />,
        roles: ['admin']
      },
      {
        path: '/admin/payments',
        label: 'Payment Management',
        icon: <CreditCard className="h-4 w-4" />,
        roles: ['admin']
      },
      {
        path: '/admin/analytics',
        label: 'Platform Analytics',
        icon: <BarChart3 className="h-4 w-4" />,
        roles: ['admin']
      }
    ]
  },
  // Vendor sections
  {
    path: '/vendor',
    label: 'Vendor Dashboard',
    icon: <Briefcase className="h-5 w-5" />,
    roles: ['vendor', 'admin'],
    children: [
      {
        path: '/vendor/profile',
        label: 'Business Profile',
        icon: <Building2 className="h-4 w-4" />,
        roles: ['vendor', 'admin']
      },
      {
        path: '/vendor/bookings',
        label: 'Manage Bookings',
        icon: <Calendar className="h-4 w-4" />,
        roles: ['vendor', 'admin']
      },
      {
        path: '/vendor/earnings',
        label: 'Earnings & Payouts',
        icon: <CreditCard className="h-4 w-4" />,
        roles: ['vendor', 'admin']
      },
      {
        path: '/vendor/reviews',
        label: 'Reviews & Ratings',
        icon: <Star className="h-4 w-4" />,
        roles: ['vendor', 'admin']
      }
    ]
  },
  // Event Organizer sections
  {
    path: '/events',
    label: 'Event Management',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['event_organizer', 'admin'],
    children: [
      {
        path: '/events/create',
        label: 'Create Event',
        icon: <Calendar className="h-4 w-4" />,
        roles: ['event_organizer', 'admin']
      },
      {
        path: '/events/manage',
        label: 'Manage Events',
        icon: <FileText className="h-4 w-4" />,
        roles: ['event_organizer', 'admin']
      },
      {
        path: '/events/bookings',
        label: 'Event Bookings',
        icon: <Users className="h-4 w-4" />,
        roles: ['event_organizer', 'admin']
      }
    ]
  },
  // Customer sections
  {
    path: '/bookings',
    label: 'My Bookings',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['customer', 'vendor', 'event_organizer', 'admin']
  },
  {
    path: '/hotels',
    label: 'Hotels & Stays',
    icon: <Building2 className="h-5 w-5" />,
    roles: ['customer', 'admin']
  },
  {
    path: '/restaurants',
    label: 'Restaurants',
    icon: <MapPin className="h-5 w-5" />,
    roles: ['customer', 'admin']
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: <User className="h-5 w-5" />,
    roles: ['admin', 'vendor', 'customer', 'event_organizer']
  }
];

interface RoleBasedNavigationProps {
  className?: string;
  mobile?: boolean;
}

export default function RoleBasedNavigation({ className = '', mobile = false }: RoleBasedNavigationProps) {
  const { user, hasRole, canAccess } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filterNavItems = (items: NavItem[]): NavItem[] => {
    return items.filter(item => {
      // Check if user has required role for this item
      const hasRequiredRole = item.roles.some(role => hasRole(role as any));
      if (!hasRequiredRole) return false;

      // Check section access
      if (!canAccess(item.path)) return false;

      // Filter children if they exist
      if (item.children) {
        item.children = filterNavItems(item.children);
      }

      return true;
    });
  };

  const filteredNavItems = filterNavItems(navigationItems);

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    const isActive = isActivePath(item.path);
    const baseClasses = `
      flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
      ${isChild ? 'text-sm ml-4' : 'text-base'}
      ${isActive 
        ? 'bg-orange-500 text-white' 
        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
      }
    `;

    return (
      <div key={item.path}>
        <Link to={item.path} className={baseClasses}>
          {item.icon}
          <span>{item.label}</span>
          {/* Role indicator for admin */}
          {user.role === 'admin' && item.roles.length === 1 && item.roles[0] !== 'admin' && (
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full ml-auto">
              {item.roles[0]}
            </span>
          )}
        </Link>
        
        {/* Render children if they exist and parent is active */}
        {item.children && isActivePath(item.path) && (
          <div className="mt-1 space-y-1">
            {item.children.map(child => renderNavItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  if (mobile) {
    return (
      <div className={`space-y-2 ${className}`}>
        {filteredNavItems.map(item => renderNavItem(item))}
      </div>
    );
  }

  return (
    <nav className={`space-y-2 ${className}`}>
      {/* Role indicator */}
      <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
        <div className="flex items-center space-x-2">
          <div className={`
            w-3 h-3 rounded-full
            ${user.role === 'admin' ? 'bg-red-500' : 
              user.role === 'vendor' ? 'bg-blue-500' : 
              user.role === 'event_organizer' ? 'bg-purple-500' : 'bg-green-500'}
          `} />
          <span className="text-sm font-medium text-gray-700">
            {user.role === 'admin' ? 'Administrator' :
             user.role === 'vendor' ? 'Business Vendor' :
             user.role === 'event_organizer' ? 'Event Organizer' : 'Customer'}
          </span>
        </div>
        {user.vendor_status && user.role === 'vendor' && (
          <div className="mt-1">
            <span className={`
              text-xs px-2 py-1 rounded-full
              ${user.vendor_status === 'approved' ? 'bg-green-100 text-green-800' :
                user.vendor_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'}
            `}>
              {user.vendor_status === 'approved' ? 'Verified Vendor' :
               user.vendor_status === 'pending' ? 'Pending Approval' :
               'Application Rejected'}
            </span>
          </div>
        )}
      </div>

      {/* Navigation items */}
      {filteredNavItems.map(item => renderNavItem(item))}
    </nav>
  );
}
