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
                {/* TikTok */}
                <a href="https://www.tiktok.com/@vastiqa_ke?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="TikTok">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.75 2h2.25a.75.75 0 01.75.75v2.25a4.5 4.5 0 004.5 4.5h.75a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-1.5a6.75 6.75 0 01-6.75-6.75V2.75A.75.75 0 0112.75 2zm-2.25 6.75A6.75 6.75 0 1017.25 15.5v-2.25a.75.75 0 00-.75-.75h-2.25a.75.75 0 00-.75.75v2.25a3.75 3.75 0 11-3.75-3.75.75.75 0 00.75-.75V8.75a.75.75 0 00-.75-.75z" /></svg>
                </a>
                {/* X (Twitter) */}
                <a href="https://x.com/vastiqaofficial" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="X">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2.47a.75.75 0 011.06 1.06l-5.47 5.47 5.47 5.47a.75.75 0 01-1.06 1.06l-5.47-5.47-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47-5.47-5.47A.75.75 0 016.47 2.47l5.47 5.47 5.47-5.47z" /></svg>
                </a>
                {/* Facebook */}
                <a href="https://www.facebook.com/profile.php?id=61576206304347" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="Facebook">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" /></svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/vastiqa_ke?igsh=MXYwdnVlN2NlMTF6aA==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label="Instagram">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.783 2.295 7.15 2.233 8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.635.401 3.678 1.358c-.957.957-1.23 2.093-1.288 3.374C2.012 5.668 2 6.077 2 12c0 5.923.012 6.332.07 7.612.058 1.281.331 2.417 1.288 3.374.957.957 2.093 1.23 3.374 1.288C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.281-.058 2.417-.331 3.374-1.288.957-.957 1.23-2.093 1.288-3.374.058-1.28.07-1.689.07-7.612 0-5.923-.012-6.332-.07-7.612-.058-1.281-.331-2.417-1.288-3.374C19.365.401 18.229.128 16.948.07 15.668.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
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
