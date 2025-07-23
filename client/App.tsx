import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
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
import { 
  Info, 
  Phone, 
  HelpCircle, 
  FileText, 
  Shield,
  Key 
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
          <Route path="/hotels" element={<Hotels />} />
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
            path="/about" 
            element={
              <PlaceholderPage 
                title="About Coastal Connect" 
                description="Learn more about our mission to connect travelers with amazing coastal experiences."
                icon={<Info className="h-16 w-16 text-coastal-400" />}
              />
            } 
          />
          <Route 
            path="/contact" 
            element={
              <PlaceholderPage 
                title="Contact Us" 
                description="Get in touch with our team for support or inquiries."
                icon={<Phone className="h-16 w-16 text-coastal-400" />}
              />
            } 
          />
          <Route 
            path="/help" 
            element={
              <PlaceholderPage 
                title="Help Center" 
                description="Find answers to common questions and get support."
                icon={<HelpCircle className="h-16 w-16 text-coastal-400" />}
              />
            } 
          />
          <Route 
            path="/terms" 
            element={
              <PlaceholderPage 
                title="Terms of Service" 
                description="Read our terms and conditions for using Coastal Connect."
                icon={<FileText className="h-16 w-16 text-coastal-400" />}
              />
            } 
          />
          <Route 
            path="/privacy" 
            element={
              <PlaceholderPage 
                title="Privacy Policy" 
                description="Learn how we protect and handle your personal information."
                icon={<Shield className="h-16 w-16 text-coastal-400" />}
              />
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PlaceholderPage 
                title="Reset Password" 
                description="Reset your password to regain access to your account."
                icon={<Key className="h-16 w-16 text-coastal-400" />}
              />
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
