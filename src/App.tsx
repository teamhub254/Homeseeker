import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import SavedProperties from "./pages/SavedProperties";
import MyInquiries from "./pages/MyInquiries";
import MyListings from "./pages/MyListings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import NotFound from "./pages/NotFound";
import PropertyInquiries from "./pages/PropertyInquiries";
import { AuthGuard } from "@/components/AuthGuard";

import './App.css';

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
            <Route path="/login" element={<Auth />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/add-property" element={<AuthGuard><AddProperty /></AuthGuard>} />
            <Route path="/edit-property/:id" element={<AuthGuard><EditProperty /></AuthGuard>} />
            <Route path="/my-listings" element={<AuthGuard><MyListings /></AuthGuard>} />
            <Route path="/saved-properties" element={<AuthGuard><SavedProperties /></AuthGuard>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-inquiries" element={<AuthGuard><MyInquiries /></AuthGuard>} />
            <Route path="/property-inquiries" element={<AuthGuard><PropertyInquiries /></AuthGuard>} />
            <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
