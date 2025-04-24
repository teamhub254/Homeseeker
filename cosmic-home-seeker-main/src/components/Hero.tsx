
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-center bg-cover" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-habix-black to-transparent opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your <span className="text-habix-purple">Perfect Space</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          Discover beautiful properties for rent or sale that match your needs and preferences.
        </p>

        {/* Search box */}
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Enter location, property type, or keywords..."
                className="w-full h-12 pl-4 pr-10 bg-gray-800/70 border border-gray-700 text-white rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="h-12 bg-habix-purple hover:bg-habix-light-purple text-white">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700">
            Houses
          </Button>
          <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700">
            Apartments
          </Button>
          <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700">
            Rooms
          </Button>
          <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700">
            For Rent
          </Button>
          <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700">
            For Sale
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
