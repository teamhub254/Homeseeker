
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import ListProperty from "./pages/ListProperty";
import NotFound from "./pages/NotFound";
import ListerRegister from "./pages/ListerRegister"
import React from "react";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/list-property" element={<ListProperty />} />

            <Route path="/ListerRegister" element={<ListerRegister />} />
            <Route path="/" element={<ListProperty />} />
            <Route path="/" element={<ListProperty />} />
            <Route path="/" element={<ListProperty />} />
            <Route path="/" element={<ListProperty />} />
            <Route path="/" element={<ListProperty />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
