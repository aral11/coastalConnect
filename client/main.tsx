import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

// Import global styles
import "./global.css";

// Import core pages
import SwiggyStyleIndex from "@/pages/SwiggyStyleIndex";
import SwiggyStyleServices from "@/pages/SwiggyStyleServices";
import SwiggyStyleVendorDashboard from "@/pages/SwiggyStyleVendorDashboard";
import SwiggyStyleAbout from "@/pages/SwiggyStyleAbout";
import VendorRegister from "@/pages/VendorRegister";
import ModernServiceDetail from "@/pages/ModernServiceDetail";
import ModernLogin from "@/pages/ModernLogin";
import ModernSignup from "@/pages/ModernSignup";
import AuthCallback from "@/pages/AuthCallback";
import ResetPassword from "@/pages/ResetPassword";
import Events from "@/pages/Events";
import EventOrganizerRegister from "@/pages/EventOrganizerRegister";
import EventOrganizerLogin from "@/pages/EventOrganizerLogin";
import EventOrganizerDashboard from "@/pages/EventOrganizerDashboard";
import CreateEvent from "@/pages/CreateEvent";
import VisitUdupiGuide from "@/pages/VisitUdupiGuide";
import Contact from "@/pages/Contact";
import PartnerWithUs from "@/pages/PartnerWithUs";
import Drivers from "@/pages/Drivers";
import Eateries from "@/pages/Eateries";
import NotFound from "@/pages/NotFound";

// Import new pages
import AdminDashboard from "@/pages/AdminDashboardFull";
import Dashboard from "@/pages/Dashboard";
import Help from "@/pages/Help";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import ApiTest from "@/pages/ApiTest";
import MediaGallery from "@/pages/MediaGallery";
import Guide from "@/pages/Guide";
import Feedback from "@/pages/Feedback";
import Phase1Homepage from "@/pages/Phase1Homepage";
import ScrollToTop from "@/components/ScrollToTop";
import RoleBasedRoute, {
  AdminRoute,
  VendorRoute,
  EventOrganizerRoute,
  PublicRoute
} from "@/components/RoleBasedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <NotificationProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Core Routes */}
              <Route path="/" element={<Phase1Homepage />} />
              {/* Phase 2 Features - Hidden for Phase 1 */}
              {/* <Route path="/services" element={<SwiggyStyleServices />} />
              <Route path="/service/:id" element={<ModernServiceDetail />} />
              <Route path="/login" element={<ModernLogin />} />
              <Route path="/signup" element={<ModernSignup />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              Dashboard Routes
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/dashboard" element={<RoleBasedRoute><Dashboard /></RoleBasedRoute>} />
              <Route path="/bookings" element={<RoleBasedRoute><Dashboard /></RoleBasedRoute>} />
              <Route path="/vendor" element={<VendorRoute><SwiggyStyleVendorDashboard /></VendorRoute>} />
              <Route path="/api-test" element={<ApiTest />} /> */}

              {/* Info Pages */}
              {/* Phase 1 Core Pages */}
              <Route path="/guide" element={<Guide />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/contact" element={<Contact />} />

              {/* Phase 2 Features - Hidden for Phase 1 */}
              {/* <Route path="/about" element={<SwiggyStyleAbout />} />
              <Route path="/help" element={<Help />} />
              <Route path="/support" element={<Help />} />
              <Route path="/safety" element={<Help />} />
              <Route path="/visit-udupi-guide" element={<VisitUdupiGuide />} />
              <Route path="/partner-with-us" element={<PartnerWithUs />} />
              <Route path="/gallery" element={<MediaGallery />} />
              <Route path="/media" element={<MediaGallery />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              Service Category Routes - Direct to filtered services
              <Route path="/hotels" element={<SwiggyStyleServices />} />
              <Route path="/homestays" element={<SwiggyStyleServices />} />
              <Route path="/restaurants" element={<SwiggyStyleServices />} />
              <Route path="/eateries" element={<Eateries />} />
              <Route path="/transport" element={<SwiggyStyleServices />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/events" element={<Events />} />
              <Route path="/wellness" element={<SwiggyStyleServices />} />
              <Route path="/creators" element={<SwiggyStyleServices />} />

              Event Organizer Routes
              <Route
                path="/organizer-register"
                element={<EventOrganizerRegister />}
              />
              <Route
                path="/organizer-login"
                element={<EventOrganizerLogin />}
              />
              <Route
                path="/organizer-dashboard"
                element={<EventOrganizerRoute><EventOrganizerDashboard /></EventOrganizerRoute>}
              />
              <Route path="/create-event" element={<EventOrganizerRoute><CreateEvent /></EventOrganizerRoute>} />

              Vendor Routes
              <Route path="/vendor-register" element={<VendorRegister />} />
              <Route
                path="/vendor-dashboard"
                element={<VendorRoute><SwiggyStyleVendorDashboard /></VendorRoute>}
              /> */}

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
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
