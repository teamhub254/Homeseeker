import { Button } from "@/components/ui/button";
import SearchBar from './SearchBar';
import { Home } from "lucide-react";
import { motion } from "framer-motion";

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
          <motion.h1
  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  Find Your Dream Home
</motion.h1>

<motion.p
  className="text-lg md:text-xl opacity-90 mb-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
>
  Discover thousands of properties for sale and rent across the country.
  Your perfect home is just a search away.
</motion.p>
          <div className="flex flex-wrap justify-center gap-4">
           <Button
  className="bg-white text-nest-primary font-semibold hover:bg-white/90"
  size="lg"
>
  For Rent
</Button>

<Button
  className="bg-nest-secondary text-white font-semibold hover:bg-nest-secondary/90"
  size="lg"
>
  For Sale
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
