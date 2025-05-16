import { Button } from "@/components/ui/button";
import SearchBar from './SearchBar';
import { Home } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="relative bg-gradient-to-r from-nest-primary to-nest-secondary py-24 px-4 text-white overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(74, 144, 226, 0.4), rgba(42, 183, 202, 0.4)), url(/assets/hero-bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto">
        {/* Hero Content */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full p-3">
              <Home className="h-8 w-8 text-nest-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Find Your Dream Home
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Discover thousands of properties for sale and rent across the country.
            Your perfect home is just a search away.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="bg-white text-nest-primary hover:bg-white/90"
              size="lg"
            >
              For Sale
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-nest-primary"
              size="lg"
            >
              For Rent
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 -mb-24">
          <SearchBar />
        </div>
      </div>
    </section>
  );
};

export default Hero;
