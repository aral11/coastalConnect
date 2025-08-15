import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import RoleBasedNavigation from "./RoleBasedNavigation";
import { swiggyTheme } from "@/lib/swiggy-design-system";
import { layouts } from "@/lib/design-system";
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
  MoreHorizontal,
  Shield,
  BarChart3,
  CreditCard,
} from "lucide-react";

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = "" }: NavigationProps) {
  const { user, isAuthenticated, logout, hasRole, canAccess } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setBusinessDropdownOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Customer-focused main navigation (public)
  const publicNavItems = [
    {
      label: "Hotels & Homestays",
      href: "/homestays",
      icon: <Bed className="h-4 w-4" />,
      description: "Hotels, resorts & homestays",
      color: "text-blue-600",
    },
    {
      label: "Restaurants",
      href: "/eateries",
      icon: <ChefHat className="h-4 w-4" />,
      description: "Local restaurants & dining",
      color: "text-orange-600",
    },
    {
      label: "Rides",
      href: "/drivers",
      icon: <Car className="h-4 w-4" />,
      description: "Trusted local transport",
      color: "text-green-600",
    },
    {
      label: "Experiences",
      href: "/events",
      icon: <Calendar className="h-4 w-4" />,
      description: "Events & cultural activities",
      color: "text-purple-600",
    },
  ];

  // Role-specific navigation items for authenticated users
  const getRoleSpecificNavItems = () => {
    if (!isAuthenticated || !user) return [];

    const items = [];

    // Admin items
    if (hasRole("admin")) {
      items.push({
        label: "Admin Panel",
        href: "/admin",
        icon: <Shield className="h-4 w-4" />,
        color: "text-red-600",
        badge: "Admin",
      });
    }

    // Vendor items
    if (hasRole("vendor")) {
      items.push({
        label: "Vendor Dashboard",
        href: "/vendor",
        icon: <Briefcase className="h-4 w-4" />,
        color: "text-blue-600",
        badge:
          user.vendor_status === "pending"
            ? "Pending"
            : user.vendor_status === "approved"
              ? "Verified"
              : "",
      });
    }

    // Event Organizer items
    if (hasRole("event_organizer")) {
      items.push({
        label: "Event Management",
        href: "/events",
        icon: <Calendar className="h-4 w-4" />,
        color: "text-purple-600",
      });
    }

    // Common authenticated user items
    items.push({
      label: "My Bookings",
      href: "/bookings",
      icon: <Calendar className="h-4 w-4" />,
      color: "text-green-600",
    });

    return items;
  };

  const roleNavItems = getRoleSpecificNavItems();

  // Business registration items (for non-vendors)
  const businessItems = [
    {
      label: "List Your Hotel/Homestay",
      href: "/vendor-register?type=homestay",
      icon: <Bed className="h-4 w-4" />,
      description: "Partner with us as accommodation provider",
    },
    {
      label: "List Your Restaurant",
      href: "/vendor-register?type=restaurant",
      icon: <ChefHat className="h-4 w-4" />,
      description: "Register your dining establishment",
    },
    {
      label: "Register as Driver",
      href: "/vendor-register?type=driver",
      icon: <Car className="h-4 w-4" />,
      description: "Offer transportation services",
    },
    {
      label: "Event Organizer Portal",
      href: "/organizer-register",
      icon: <Calendar className="h-4 w-4" />,
      description: "Organize events and experiences",
    },
  ];

  const getRoleBasedWelcome = () => {
    if (!user) return "Welcome to CoastalConnect";

    switch (user.role) {
      case "admin":
        return `Admin Panel - ${user.name}`;
      case "vendor":
        const status =
          user.vendor_status === "approved"
            ? "Verified Vendor"
            : user.vendor_status === "pending"
              ? "Pending Approval"
              : "Vendor";
        return `${status} - ${user.name}`;
      case "event_organizer":
        return `Event Organizer - ${user.name}`;
      default:
        return `Welcome, ${user.name}`;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
          : "bg-white border-b border-gray-100"
      } ${className}`}
    >
      <div className={layouts.container}>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                coastal<span className="text-orange-500">Connect</span>
              </span>
            </Link>

            {/* Desktop Navigation - Role Aware */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Public navigation items */}
              {!isAuthenticated &&
                publicNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 ${
                      location.pathname === item.href
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

              {/* Role-specific navigation items */}
              {isAuthenticated &&
                roleNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 flex items-center space-x-2 ${
                      location.pathname.startsWith(item.href)
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={
                          item.badge === "Pending" ? "secondary" : "default"
                        }
                        className="text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}

              {/* Business dropdown for non-vendors */}
              {(!isAuthenticated || !hasRole("vendor")) && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setBusinessDropdownOpen(!businessDropdownOpen)
                    }
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-1"
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>For Business</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {businessDropdownOpen && (
                    <div className="absolute top-full mt-1 left-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
                      {businessItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setBusinessDropdownOpen(false)}
                        >
                          <div
                            className={`mt-1 ${item.icon ? "text-orange-500" : ""}`}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Right side - Authentication */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Role-based quick actions */}
                {hasRole("admin") && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-orange-600"
                  >
                    <Shield className="h-5 w-5" />
                  </Link>
                )}

                {hasRole(["vendor", "event_organizer"]) && (
                  <Link
                    to={hasRole("vendor") ? "/vendor" : "/events"}
                    className="text-gray-600 hover:text-orange-600"
                  >
                    <BarChart3 className="h-5 w-5" />
                  </Link>
                )}

                {/* Notifications */}
                <button className="text-gray-600 hover:text-orange-600 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <div className="font-medium text-gray-900">
                          {getRoleBasedWelcome()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        {user.vendor_status && (
                          <Badge
                            variant={
                              user.vendor_status === "approved"
                                ? "default"
                                : "secondary"
                            }
                            className="mt-1"
                          >
                            {user.vendor_status}
                          </Badge>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>

                        {hasRole(["vendor", "event_organizer", "admin"]) && (
                          <Link
                            to={
                              hasRole("admin")
                                ? "/admin"
                                : hasRole("vendor")
                                  ? "/vendor"
                                  : "/events"
                            }
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <BarChart3 className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        )}

                        <Link
                          to="/settings"
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>

                        <Separator className="my-1" />

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 w-full"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            CC
                          </span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                          coastal
                          <span className="text-orange-500">Connect</span>
                        </span>
                      </Link>
                    </div>

                    {isAuthenticated && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-900">
                          {getRoleBasedWelcome()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6">
                    {isAuthenticated ? (
                      <RoleBasedNavigation mobile={true} />
                    ) : (
                      <div className="space-y-2">
                        {publicNavItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        ))}

                        <Separator className="my-4" />

                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900 mb-2">
                            For Business
                          </div>
                          {businessItems.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 text-sm"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile auth buttons */}
                  {!isAuthenticated && (
                    <div className="p-6 border-t border-gray-200">
                      <div className="space-y-3">
                        <Link to="/login" className="block">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Sign In
                          </Button>
                        </Link>
                        <Link to="/signup" className="block">
                          <Button
                            className="w-full bg-orange-500 hover:bg-orange-600"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {isAuthenticated && (
                    <div className="p-6 border-t border-gray-200">
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
