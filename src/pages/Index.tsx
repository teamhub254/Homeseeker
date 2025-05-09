
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedProperties from '../components/FeaturedProperties';
import { Button } from "@/components/ui/button";
import { MapPin, Search, Home, Building, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Hero />

      {/* Space to account for the search bar */}
      <div className="pt-24" />

      <FeaturedProperties />

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2c2c2c]">How It Works</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Find your perfect space in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#f0e6ff] rounded-full p-4 mb-4">
                <Search className="h-8 w-8 text-[#8b00ff]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Search Properties</h3>
              <p className="text-muted-foreground">
                Browse our extensive list of properties and use filters to narrow down your search
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-[#f0e6ff] rounded-full p-4 mb-4">
                <Home className="h-8 w-8 text-[#8b00ff]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tour Homes</h3>
              <p className="text-muted-foreground">
                Schedule viewings of properties that catch your eye to see them in person
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-[#f0e6ff] rounded-full p-4 mb-4">
                <DollarSign className="h-8 w-8 text-[#8b00ff]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Close the Deal</h3>
              <p className="text-muted-foreground">
                Make an offer, finalize the details, and move into your new home
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#8b00ff] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Space?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start your search today and discover the perfect property that meets all your needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="bg-white text-[#8b00ff] hover:bg-white/90"
              size="lg"
            >
              Browse Properties
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#8b00ff]"
              size="lg"
            >
              List Your Property
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2c2c2c] py-12 px-4 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/lovable-uploads/6df1c057-cde1-4b21-871b-e48b489b67c3.png"
                  alt="Vastiqa Logo"
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold">Vastiqa<span className="text-[#b980ff] block text-sm">Find Your Perfect Space</span></span>
              </div>
              <p className="text-gray-400 mb-4">
                Find your dream property with ease. We connect buyers, sellers and renters across the country.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12c0 5.513 4.486 10 10 10s10-4.487 10-10c0-5.514-4.486-10-10-10zm4.714 8.657c-.004.103-.004.206-.004.309 0 3.159 2.403 6.8 6.8 6.8.395 0 .78-.046 1.153-.133-.432.432-1.064.752-1.768.881-.516.096-1.047.145-1.586.145-4.685 0-8.445-3.758-8.445-8.397 0-.157.004-.314.012-.47.18-.006.363-.009.546-.009 2.56 0 4.897 1.017 6.615 2.674-1.15-.18-2.3-.018-3.323.47z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm5.064 7.729l-7.5 5.829c-.102.08-.25.01-.25-.114V8.557c0-.124.148-.193.25-.114l7.5 5.829a.146.146 0 010 .228z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.231.585 1.786 1.14a4.908 4.908 0 011.14 1.786c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.883 4.883 0 01-1.14 1.786 4.915 4.915 0 01-1.786 1.14c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.89 4.89 0 01-1.786-1.14 4.904 4.904 0 01-1.14-1.786c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.88 4.88 0 011.14-1.786A4.897 4.897 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path></svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Properties</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Agents</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Property Types</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Houses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Apartments</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Condos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Townhouses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Land</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-[#b980ff] mr-2 mt-0.5" />
                  <span className="text-gray-400">
                    123 Real Estate Ave, Property City, 12345
                  </span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-[#b980ff] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:teamhub254@gmail.com" className="text-gray-400 hover:text-white">
                    teamhub254@gmail.com
                  </a>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-[#b980ff] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+254741677399" className="text-gray-400 hover:text-white">
                    +254 741 677 399
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Vastiqa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
