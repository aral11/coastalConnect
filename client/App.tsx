import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Hotels from "./pages/Hotels";
import Drivers from "./pages/Drivers";
import Eateries from "./pages/Eateries";
import Creators from "./pages/Creators";
import DriverApp from "./pages/DriverApp";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import ServiceSector from "./pages/ServiceSector";
import VendorRegister from "./pages/VendorRegister";
import EventOrganizerRegister from "./pages/EventOrganizerRegister";
import EventOrganizerLogin from "./pages/EventOrganizerLogin";
import EventOrganizerDashboard from "./pages/EventOrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import BusinessDashboard from "./pages/BusinessDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Support from "./pages/Support";
import SafetyGuidelines from "./pages/SafetyGuidelines";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/AdminDashboard";
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
  BookOpen
} from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/homestays" element={<Hotels />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/eateries" element={<Eateries />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/driver-app" element={<DriverApp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/vendor-register" element={<VendorRegister />} />

          {/* Event Organizer Routes */}
          <Route path="/organizer-register" element={<EventOrganizerRegister />} />
          <Route path="/organizer-login" element={<EventOrganizerLogin />} />
          <Route path="/organizer-dashboard" element={<EventOrganizerDashboard />} />
          <Route path="/organizer/events/create" element={<CreateEvent />} />

          {/* Business Routes */}
          <Route path="/business-dashboard" element={<BusinessDashboard />} />
          <Route path="/partner-with-us" element={
            <PlaceholderPage
              title="Partner with Us"
              description="Join our network of local service providers and grow your business."
              icon={<Info className="h-16 w-16 text-orange-500" />}
            />
          } />
          <Route path="/advertise" element={
            <PlaceholderPage
              title="Advertise with Coastal Connect"
              description="Promote your business to thousands of coastal travelers."
              icon={<Info className="h-16 w-16 text-orange-500" />}
            />
          } />
          <Route path="/bulk-bookings" element={
            <PlaceholderPage
              title="Bulk Bookings"
              description="Special rates for group bookings and corporate events."
              icon={<Info className="h-16 w-16 text-orange-500" />}
            />
          } />

          {/* Service Sector Pages */}
          <Route path="/arts-history" element={<ServiceSector />} />
          <Route path="/beauty-wellness" element={<ServiceSector />} />
          <Route path="/nightlife" element={<ServiceSector />} />
          <Route path="/shopping" element={<ServiceSector />} />
          <Route path="/entertainment" element={<ServiceSector />} />
          <Route path="/event-management" element={<ServiceSector />} />
          <Route path="/other-services" element={<ServiceSector />} />

          {/* Placeholder pages */}
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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
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

          {/* Support & Help Routes */}
          <Route path="/support" element={<Support />} />
          <Route path="/safety" element={<SafetyGuidelines />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/report-issue" element={
            <PlaceholderPage
              title="Report an Issue"
              description="Report problems or safety concerns with our services."
              icon={<AlertTriangle className="h-16 w-16 text-orange-500" />}
            />
          } />

          {/* Company Pages */}
          <Route path="/careers" element={
            <PlaceholderPage
              title="Careers"
              description="Join our team and help shape the future of coastal tourism."
              icon={<Users className="h-16 w-16 text-orange-500" />}
            />
          } />
          <Route path="/press" element={
            <PlaceholderPage
              title="Press & Media"
              description="Latest news, press releases, and media resources."
              icon={<FileText className="h-16 w-16 text-orange-500" />}
            />
          } />
          <Route path="/blog" element={
            <PlaceholderPage
              title="Blog"
              description="Travel tips, destination guides, and coastal stories."
              icon={<BookOpen className="h-16 w-16 text-orange-500" />}
            />
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
