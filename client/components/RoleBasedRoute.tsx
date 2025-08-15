/**
 * Role-Based Route Protection Component
 * Redirects users based on their role and access permissions
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { UserRole } from "@/contexts/SupabaseAuthContext";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function RoleBasedRoute({
  children,
  allowedRoles = [],
  requireAuth = true,
  redirectTo,
}: RoleBasedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have required role
  if (isAuthenticated && user && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect based on user's actual role
      const roleRedirect = getRoleBasedRedirect(user.role);
      return <Navigate to={redirectTo || roleRedirect} replace />;
    }
  }

  // Admin approval check for vendors
  if (user?.role === "vendor" && user.vendor_status === "pending") {
    const currentPath = location.pathname;
    const allowedPendingPaths = ["/vendor", "/dashboard", "/profile", "/"];
    
    if (!allowedPendingPaths.some(path => currentPath.startsWith(path))) {
      return <Navigate to="/vendor?status=pending" replace />;
    }
  }

  return <>{children}</>;
}

// Helper function to get role-based redirect paths
function getRoleBasedRedirect(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "vendor":
      return "/vendor";
    case "event_organizer":
      return "/organizer-dashboard";
    case "customer":
    default:
      return "/dashboard";
  }
}

// Protected Route Component for Admin-only access
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
      {children}
    </RoleBasedRoute>
  );
}

// Protected Route Component for Vendor-only access
export function VendorRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedRoute allowedRoles={["vendor"]} redirectTo="/dashboard">
      {children}
    </RoleBasedRoute>
  );
}

// Protected Route Component for Event Organizer-only access
export function EventOrganizerRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedRoute allowedRoles={["event_organizer"]} redirectTo="/dashboard">
      {children}
    </RoleBasedRoute>
  );
}

// Protected Route Component for Customer-only access
export function CustomerRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedRoute allowedRoles={["customer"]} redirectTo="/dashboard">
      {children}
    </RoleBasedRoute>
  );
}

// Multi-role access (e.g., vendors and admins)
export function VendorAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RoleBasedRoute allowedRoles={["vendor", "admin"]} redirectTo="/dashboard">
      {children}
    </RoleBasedRoute>
  );
}

// Public route that redirects authenticated users to their dashboard
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to their role-based dashboard
  if (isAuthenticated && user) {
    const roleRedirect = getRoleBasedRedirect(user.role);
    return <Navigate to={roleRedirect} replace />;
  }

  return <>{children}</>;
}
