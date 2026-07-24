import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import OrganizerRegister from "./pages/OrganizerRegister.tsx";
import SponsorRegister from "./pages/SponsorRegister.tsx";
import EventsPage from "./pages/EventsPage.tsx";
import SponsorsPage from "./pages/SponsorsPage.tsx";
import SponsorDetail from "./pages/SponsorDetail.tsx";
import EventDetail from "./pages/EventDetail.tsx";
import OrganizerDashboard from "./pages/OrganizerDashboard.tsx";
import SponsorDashboard from "./pages/SponsorDashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/organizer-register" element={<OrganizerRegister />} />
          <Route path="/sponsor-register" element={<SponsorRegister />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/sponsors/:id" element={<SponsorDetail />} />
          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedRoute role="organizer">
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sponsor/dashboard"
            element={
              <ProtectedRoute role="sponsor">
                <SponsorDashboard />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
