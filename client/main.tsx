import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";

// Import global styles
import "./global.css";

// Import pages
import ModernIndex from "@/pages/ModernIndex";
import SwiggyStyleIndex from "@/pages/SwiggyStyleIndex";
import ModernServices from "@/pages/ModernServices";
import ModernServiceDetail from "@/pages/ModernServiceDetail";
import ModernLoginFixed from "@/pages/ModernLoginFixed";
import ModernSignupFixed from "@/pages/ModernSignupFixed";
import SetupRequired from "@/pages/SetupRequired";
import SimpleHome from "@/pages/SimpleHome";

// Import legacy pages for compatibility
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PlaceholderPage from "@/pages/PlaceholderPage";
import NotFound from "@/pages/NotFound";

// Import icons for placeholder pages
import {
  Info,
  Phone,
  HelpCircle,
  FileText,
  Shield,
  Key,
  MapPin,
  HeadphonesIcon,
  MessageCircle,
  AlertTriangle,
  Users,
  BookOpen,
} from "lucide-react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Modern Routes - Full Supabase Integration */}
              <Route path="/" element={<SwiggyStyleIndex />} />
              <Route path="/modern" element={<ModernIndex />} />
              <Route path="/services" element={<ModernServices />} />
              <Route path="/services/:id" element={<ModernServiceDetail />} />
              <Route path="/login" element={<ModernLoginFixed />} />
              <Route path="/signup" element={<ModernSignupFixed />} />

              {/* Info Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Setup & Demo Routes */}
              <Route path="/setup" element={<SetupRequired />} />
              <Route path="/simple" element={<SimpleHome />} />

              {/* Service Category Routes */}
              <Route
                path="/hotels"
                element={
                  <PlaceholderPage
                    title="Hotels & Homestays"
                    description="Discover comfortable accommodations along coastal Karnataka."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/hotels/:id"
                element={
                  <PlaceholderPage
                    title="Hotel Details"
                    description="View detailed information about this accommodation."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/homestays"
                element={
                  <PlaceholderPage
                    title="Homestays"
                    description="Experience authentic local hospitality in coastal Karnataka."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/homestays/:id"
                element={
                  <PlaceholderPage
                    title="Homestay Details"
                    description="Learn more about this homestay experience."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/drivers"
                element={
                  <PlaceholderPage
                    title="Transport Services"
                    description="Reliable drivers for your coastal Karnataka travels."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/drivers/:id"
                element={
                  <PlaceholderPage
                    title="Driver Profile"
                    description="View driver details and book transport services."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/eateries"
                element={
                  <PlaceholderPage
                    title="Restaurants & Eateries"
                    description="Discover authentic coastal Karnataka cuisine."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/eateries/:id"
                element={
                  <PlaceholderPage
                    title="Restaurant Details"
                    description="Explore menu and book tables at this restaurant."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/events"
                element={
                  <PlaceholderPage
                    title="Events & Experiences"
                    description="Join exciting events and cultural experiences."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/events/:id"
                element={
                  <PlaceholderPage
                    title="Event Details"
                    description="Learn more about this event and book tickets."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />

              {/* Admin & Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <PlaceholderPage
                    title="User Dashboard"
                    description="Manage your bookings and account settings."
                    icon={<Users className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/admin"
                element={
                  <PlaceholderPage
                    title="Admin Dashboard"
                    description="Administrative controls and analytics."
                    icon={<Shield className="h-16 w-16 text-orange-500" />}
                  />
                }
              />

              {/* Placeholder Pages */}
              <Route
                path="/partner-with-us"
                element={
                  <PlaceholderPage
                    title="Partner with Us"
                    description="Join our network of local service providers and grow your business."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/advertise"
                element={
                  <PlaceholderPage
                    title="Advertise with Coastal Connect"
                    description="Promote your business to thousands of coastal travelers."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/bulk-bookings"
                element={
                  <PlaceholderPage
                    title="Bulk Bookings"
                    description="Special rates for group bookings and corporate events."
                    icon={<Info className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/locations"
                element={
                  <PlaceholderPage
                    title="Explore Locations"
                    description="Discover amazing destinations across coastal Karnataka and plan your perfect trip."
                    icon={<MapPin className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/terms"
                element={
                  <PlaceholderPage
                    title="Terms of Service"
                    description="Read our terms and conditions for using Coastal Connect."
                    icon={<FileText className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/privacy"
                element={
                  <PlaceholderPage
                    title="Privacy Policy"
                    description="Learn how we protect and handle your personal information."
                    icon={<Shield className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PlaceholderPage
                    title="Reset Password"
                    description="Reset your password to regain access to your account."
                    icon={<Key className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/help"
                element={
                  <PlaceholderPage
                    title="Help Center"
                    description="Find answers to common questions and get support."
                    icon={<HelpCircle className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/support"
                element={
                  <PlaceholderPage
                    title="Support"
                    description="Get help with your bookings and account."
                    icon={
                      <HeadphonesIcon className="h-16 w-16 text-orange-500" />
                    }
                  />
                }
              />
              <Route
                path="/feedback"
                element={
                  <PlaceholderPage
                    title="Feedback"
                    description="Share your thoughts and help us improve."
                    icon={
                      <MessageCircle className="h-16 w-16 text-orange-500" />
                    }
                  />
                }
              />
              <Route
                path="/report-issue"
                element={
                  <PlaceholderPage
                    title="Report an Issue"
                    description="Report problems or safety concerns with our services."
                    icon={
                      <AlertTriangle className="h-16 w-16 text-orange-500" />
                    }
                  />
                }
              />
              <Route
                path="/careers"
                element={
                  <PlaceholderPage
                    title="Careers"
                    description="Join our team and help shape the future of coastal tourism."
                    icon={<Users className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/press"
                element={
                  <PlaceholderPage
                    title="Press & Media"
                    description="Latest news, press releases, and media resources."
                    icon={<FileText className="h-16 w-16 text-orange-500" />}
                  />
                }
              />
              <Route
                path="/blog"
                element={
                  <PlaceholderPage
                    title="Blog"
                    description="Travel tips, destination guides, and coastal stories."
                    icon={<BookOpen className="h-16 w-16 text-orange-500" />}
                  />
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Root container not found!");
}
