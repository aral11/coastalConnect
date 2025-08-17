import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

// Import global styles
import "./global.css";

// Phase 1 Components Only
import Phase1Homepage from "@/pages/Phase1Homepage";
import Phase1Guide from "@/pages/Phase1Guide";
import Phase1Feedback from "@/pages/Phase1Feedback";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Phase 1 Routes Only */}
          <Route path="/" element={<Phase1Homepage />} />
          <Route path="/guide" element={<Phase1Guide />} />
          <Route path="/feedback" element={<Phase1Feedback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Root container not found!");
}
