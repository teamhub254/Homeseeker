
import { Home, Search, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-habix-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
            <Home className="h-6 w-6 text-habix-purple" />
            <span className="text-habix-purple">Habix</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search for properties..." 
              className="pl-10 bg-gray-800/50 border-gray-700 text-white w-full focus:border-habix-purple" 
            />
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link to="/explore" className="text-gray-300 hover:text-white">
            Explore
          </Link>
          <Link to="/saved" className="text-gray-300 hover:text-white">
            Saved
          </Link>
          <Link to="/list-property">
            <Button variant="outline" className="border-habix-purple text-habix-purple hover:bg-habix-purple hover:text-white">
              List Property
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-habix-purple hover:bg-habix-light-purple text-white">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
