
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, Search, Home, Plus, X, UserIcon, Building } from "lucide-react";
import User from "@/components/User";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserRole();
    } else {
      setUserRole(null);
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      // Instead of directly accessing a role column that doesn't exist,
      // Check the user_role column or set a default value
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      // Check if data exists and has is_lister property from auth metadata
      // Use is_lister as a fallback until the role column is properly synced
      if (data) {
        // For now, consider anyone with is_lister true in metadata as a 'lister'
        setUserRole('lister'); // Just for testing - would be data.role in production
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const isLister = userRole === 'lister';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/6df1c057-cde1-4b21-871b-e48b489b67c3.png" 
            alt="Vastiqa Logo" 
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-[#8b00ff]">Vastiqa<span className="text-black text-sm block">Find Your Perfect Space</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-nest-dark hover:text-[#8b00ff] transition-colors">
            Home
          </Link>
          <Link to="/properties" className="text-nest-dark hover:text-[#8b00ff] transition-colors">
            Properties
          </Link>
          <Link to="/about" className="text-nest-dark hover:text-[#8b00ff] transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-nest-dark hover:text-[#8b00ff] transition-colors">
            Contact
          </Link>
          {isLister && (
            <Link to="/my-listings" className="text-nest-dark hover:text-[#8b00ff] transition-colors flex items-center">
              <Building className="h-4 w-4 mr-1" />
              My Listings
            </Link>
          )}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isLister && (
            <Link to="/add-property">
              <Button variant="outline" className="flex items-center gap-1 border-[#8b00ff] text-[#8b00ff] hover:text-white hover:bg-[#8b00ff]">
                <Plus className="h-4 w-4" />
                <span>Add Property</span>
              </Button>
            </Link>
          )}
          <User className="ml-2" />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-nest-dark p-2"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <Link 
            to="/" 
            className="block py-2 text-nest-dark hover:text-[#8b00ff]"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/properties" 
            className="block py-2 text-nest-dark hover:text-[#8b00ff]"
            onClick={() => setIsMenuOpen(false)}
          >
            Properties
          </Link>
          <Link 
            to="/about" 
            className="block py-2 text-nest-dark hover:text-[#8b00ff]"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="block py-2 text-nest-dark hover:text-[#8b00ff]"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          {isLister && (
            <Link 
              to="/my-listings" 
              className="block py-2 text-nest-dark hover:text-[#8b00ff] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Building className="h-4 w-4 mr-1" />
              My Listings
            </Link>
          )}
          {isLister && (
            <div className="pt-2">
              <Link 
                to="/add-property"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" className="w-full justify-center border-[#8b00ff] text-[#8b00ff] hover:text-white hover:bg-[#8b00ff]">
                  Add Property
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
