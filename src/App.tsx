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
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-properties" element={<SavedProperties />} />
            <Route path="/my-inquiries" element={<MyInquiries />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/edit-property/:id" element={<EditProperty />} />
            <Route path="/property-inquiries" element={<PropertyInquiries />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
