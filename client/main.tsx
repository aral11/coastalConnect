import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import TestHome from '@/pages/TestHome';
import SimpleHome from '@/pages/SimpleHome';
import SetupRequired from '@/pages/SetupRequired';
import ModernIndexDemo from '@/pages/ModernIndexDemo';

// Import styles
import './global.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TestHome />} />
            <Route path="/simple" element={<SimpleHome />} />
            <Route path="/demo" element={<ModernIndexDemo />} />
            <Route path="/setup" element={<SetupRequired />} />
            <Route path="*" element={<TestHome />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
