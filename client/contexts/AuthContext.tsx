import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'vendor' | 'customer' | 'event_organizer';

interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  is_verified: boolean;
  permissions?: string[];
  vendor_status?: 'pending' | 'approved' | 'rejected';
  business_name?: string;
  business_type?: 'homestay' | 'restaurant' | 'driver' | 'event_services';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  canAccess: (section: string) => boolean;
}

// Role-based permissions matrix
const ROLE_PERMISSIONS = {
  admin: [
    'admin:dashboard',
    'admin:users',
    'admin:vendors',
    'admin:bookings',
    'admin:payments',
    'admin:analytics',
    'admin:settings',
    'vendor:approve',
    'vendor:reject',
    'event:approve',
    'event:reject',
    'system:manage'
  ],
  vendor: [
    'vendor:dashboard',
    'vendor:profile',
    'vendor:bookings',
    'vendor:earnings',
    'vendor:availability',
    'vendor:reviews',
    'booking:manage'
  ],
  customer: [
    'customer:dashboard',
    'customer:profile',
    'customer:bookings',
    'customer:reviews',
    'booking:create',
    'booking:cancel'
  ],
  event_organizer: [
    'event:dashboard',
    'event:create',
    'event:manage',
    'event:bookings',
    'event:analytics',
    'customer:profile',
    'customer:bookings'
  ]
};

// Section access control
const SECTION_ACCESS = {
  '/admin': ['admin'],
  '/vendor': ['vendor', 'admin'],
  '/dashboard': ['customer', 'vendor', 'event_organizer', 'admin'],
  '/business': ['vendor', 'admin'],
  '/events': ['event_organizer', 'admin'],
  '/analytics': ['admin', 'vendor', 'event_organizer']
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.user) {
          // Enhance user with permissions
          const enhancedUser = {
            ...data.data.user,
            permissions: ROLE_PERMISSIONS[data.data.user.role as UserRole] || []
          };
          setUser(enhancedUser);
        } else {
          localStorage.removeItem('authToken');
        }
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem('authToken', token);
    // Enhance user with permissions
    const enhancedUser = {
      ...userData,
      permissions: ROLE_PERMISSIONS[userData.role] || []
    };
    setUser(enhancedUser);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Call server logout endpoint
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Server logout failed:', error);
      // Continue with client logout even if server call fails
    } finally {
      // Always clear client-side data
      localStorage.removeItem('authToken');
      localStorage.removeItem('pendingBooking');
      setUser(null);

      // Redirect to home page
      window.location.href = '/';
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const canAccess = (section: string): boolean => {
    if (!user) return false;
    
    // Check section access
    const allowedRoles = SECTION_ACCESS[section];
    if (allowedRoles) {
      return allowedRoles.includes(user.role);
    }
    
    // Default: allow access if no specific restriction
    return true;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    hasPermission,
    hasRole,
    canAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Utility hooks for common role checks
export const useAdmin = () => {
  const { hasRole } = useAuth();
  return hasRole('admin');
};

export const useVendor = () => {
  const { hasRole } = useAuth();
  return hasRole('vendor');
};

export const useCustomer = () => {
  const { hasRole } = useAuth();
  return hasRole('customer');
};

export const useEventOrganizer = () => {
  const { hasRole } = useAuth();
  return hasRole('event_organizer');
};
