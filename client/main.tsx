import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/FallbackAuthContext';

// Import global styles
import './global.css';

// Import pages
import ModernIndexDemo from '@/pages/ModernIndexDemo';
import SimpleHome from '@/pages/SimpleHome';
import SetupRequired from '@/pages/SetupRequired';
import ModernServices from '@/pages/ModernServices';
import ModernLogin from '@/pages/ModernLogin';
import ModernSignup from '@/pages/ModernSignup';

// Import legacy pages for compatibility
import Services from '@/pages/Services';
import Hotels from '@/pages/Hotels';
import Drivers from '@/pages/Drivers';
import Eateries from '@/pages/Eateries';
import Events from '@/pages/Events';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import PlaceholderPage from '@/pages/PlaceholderPage';
import NotFound from '@/pages/NotFound';

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
  BookOpen
} from 'lucide-react';

const queryClient = new QueryClient();

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return supabaseUrl && 
         supabaseKey && 
         supabaseUrl !== 'https://your-project.supabase.co' &&
         supabaseKey !== 'your-supabase-anon-key';
};

function App() {
  // For demo purposes, we'll use the modern demo version as the default
  // This provides a fully functional UI without requiring Supabase
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            {/* Modern Routes - Using demo version for now */}
            <Route path="/" element={<ModernIndexDemo />} />
            <Route path="/services" element={<SimpleHome />} />
            <Route path="/login" element={<ModernLogin />} />
            <Route path="/signup" element={<ModernSignup />} />
            
            {/* Legacy Routes for compatibility */}
            <Route path="/legacy" element={<SimpleHome />} />
            <Route path="/legacy-services" element={<Services />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<Hotels />} />
            <Route path="/homestays" element={<Hotels />} />
            <Route path="/homestays/:id" element={<Hotels />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/drivers/:id" element={<Drivers />} />
            <Route path="/eateries" element={<Eateries />} />
            <Route path="/eateries/:id" element={<Eateries />} />
            <Route path="/EateriesOld" element={<Eateries />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<Events />} />
            
            {/* Admin & Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Info Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Setup & Demo Routes */}
            <Route path="/setup" element={<SetupRequired />} />
            <Route path="/demo" element={<ModernIndexDemo />} />
            
            {/* Placeholder Pages */}
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
            <Route path="/locations" element={
              <PlaceholderPage
                title="Explore Locations"
                description="Discover amazing destinations across coastal Karnataka and plan your perfect trip."
                icon={<MapPin className="h-16 w-16 text-orange-500" />}
              />
            } />
            <Route path="/terms" element={
              <PlaceholderPage
                title="Terms of Service"
                description="Read our terms and conditions for using Coastal Connect."
                icon={<FileText className="h-16 w-16 text-orange-500" />}
              />
            } />
            <Route path="/privacy" element={
              <PlaceholderPage
                title="Privacy Policy"
                description="Learn how we protect and handle your personal information."
                icon={<Shield className="h-16 w-16 text-orange-500" />}
              />
            } />
            <Route path="/forgot-password" element={
              <PlaceholderPage
                title="Reset Password"
                description="Reset your password to regain access to your account."
                icon={<Key className="h-16 w-16 text-orange-500" />}
              />
            } />
            <Route path="/help" element={
              <PlaceholderPage
                title="Help Center"
                description="Find answers to common questions and get support."
                icon={<HelpCircle className="h-16 w-16 text-orange-500" />}
              />
            } />
            <Route path="/support" element={
              <PlaceholderPage
                title="Support"
                description="Get help with your bookings and account."
                icon={<HeadphonesIcon className="h-16 w-16 text-orange-500" />}
              />
            } />
            <Route path="/feedback" element={
              <PlaceholderPage
                title="Feedback"
                description="Share your thoughts and help us improve."
                icon={<MessageCircle className="h-16 w-16 text-orange-500" />}
              />
            } />
            <Route path="/report-issue" element={
              <PlaceholderPage
                title="Report an Issue"
                description="Report problems or safety concerns with our services."
                icon={<AlertTriangle className="h-16 w-16 text-orange-500" />}
              />
            } />
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
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root container not found!');
}
