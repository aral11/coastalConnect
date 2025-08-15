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

// Import core pages
import SwiggyStyleIndex from "@/pages/SwiggyStyleIndex";
import SwiggyStyleServices from "@/pages/SwiggyStyleServices";
import SwiggyStyleVendorDashboard from "@/pages/SwiggyStyleVendorDashboard";
import SwiggyStyleAbout from "@/pages/SwiggyStyleAbout";
import VendorRegister from "@/pages/VendorRegister";
import ModernServiceDetail from "@/pages/ModernServiceDetail";
import ModernLoginFixed from "@/pages/ModernLoginFixed";
import ModernSignupFixed from "@/pages/ModernSignupFixed";
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
import NotFound from "@/pages/NotFound";

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
              {/* Core Routes */}
              <Route path="/" element={<SwiggyStyleIndex />} />
              <Route path="/services" element={<SwiggyStyleServices />} />
              <Route path="/service/:id" element={<ModernServiceDetail />} />
              <Route path="/login" element={<ModernLoginFixed />} />
              <Route path="/signup" element={<ModernSignupFixed />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Info Pages */}
              <Route path="/about" element={<SwiggyStyleAbout />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/visit-udupi-guide" element={<VisitUdupiGuide />} />
              <Route path="/partner-with-us" element={<PartnerWithUs />} />

              {/* Service Category Routes - Direct to filtered services */}
              <Route path="/hotels" element={<SwiggyStyleServices />} />
              <Route path="/homestays" element={<SwiggyStyleServices />} />
              <Route path="/restaurants" element={<SwiggyStyleServices />} />
              <Route path="/transport" element={<SwiggyStyleServices />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/events" element={<Events />} />
              <Route path="/wellness" element={<SwiggyStyleServices />} />
              <Route path="/creators" element={<SwiggyStyleServices />} />

              {/* Event Organizer Routes */}
              <Route path="/organizer-register" element={<EventOrganizerRegister />} />
              <Route path="/organizer-login" element={<EventOrganizerLogin />} />
              <Route path="/organizer-dashboard" element={<EventOrganizerDashboard />} />
              <Route path="/create-event" element={<CreateEvent />} />

              {/* Vendor Routes */}
              <Route path="/vendor-register" element={<VendorRegister />} />
              <Route path="/vendor-dashboard" element={<SwiggyStyleVendorDashboard />} />

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
