
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Search, MapPin, Building, Bed, Bath, AreaChart, Wifi, Car, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";

const Explore = () => {
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [areaRange, setAreaRange] = useState([500, 3000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const properties = [
    {
      id: "prop-1",
      title: "Modern Downtown Apartment",
      price: "$1,850/mo",
      address: "123 Downtown Ave, San Francisco, CA",
      type: "Apartment" as const,
      beds: 2,
      baths: 2,
      area: 1200,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80",
      tags: ["WiFi", "Parking", "Security"],
      forRent: true,
      featured: true
    },
    {
      id: "prop-2",
      title: "Cozy Studio in Tech District",
      price: "$950/mo",
      address: "456 Tech Blvd, San Jose, CA",
      type: "Room" as const,
      beds: 1,
      baths: 1,
      area: 650,
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80",
      tags: ["WiFi", "Furnished", "Utilities Included"],
      forRent: true,
      featured: false
    },
    {
      id: "prop-3",
      title: "Luxury Waterfront Villa",
      price: "$1,250,000",
      address: "789 Ocean View, Malibu, CA",
      type: "House" as const,
      beds: 4,
      baths: 3,
      area: 3200,
      image: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?auto=format&fit=crop&q=80",
      tags: ["Parking", "Security", "Swimming Pool"],
      forSale: true,
      featured: true
    },
    {
      id: "prop-4",
      title: "Minimalist Loft with View",
      price: "$2,200/mo",
      address: "101 Arts District, New York, NY",
      type: "Apartment" as const,
      beds: 1,
      baths: 1,
      area: 950,
      image: "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&q=80",
      tags: ["High Ceilings", "Industrial Design", "City Views"],
      forRent: true,
      featured: false
    },
    {
      id: "prop-5",
      title: "Suburban Family Home",
      price: "$3,200/mo",
      address: "234 Maple Road, Seattle, WA",
      type: "House" as const,
      beds: 3,
      baths: 2,
      area: 1800,
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=80",
      tags: ["Garage", "Garden", "Family Friendly"],
      forRent: true,
      featured: false
    },
    {
      id: "prop-6",
      title: "High-Rise Luxury Condo",
      price: "$750,000",
      address: "567 Skyview Ave, Chicago, IL",
      type: "Apartment" as const,
      beds: 2,
      baths: 2,
      area: 1400,
      image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80",
      tags: ["Doorman", "Gym", "Concierge"],
      forSale: true,
      featured: false
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Search Header */}
        <div className="bg-[#1E1E30] border-b border-gray-800 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  type="search" 
                  placeholder="Enter location, property type, or keywords..." 
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white w-full"
                />
              </div>
              <Button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                variant="outline" 
                className="border-habix-purple text-habix-purple hover:bg-habix-purple hover:text-white"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-habix-purple hover:bg-habix-light-purple text-white">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            
            {/* Filters Panel */}
            {isFilterOpen && (
              <div className="mt-6 p-4 bg-[#222232] border border-gray-800 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label>Price Range</Label>
                    <div className="pt-4 px-2">
                      <Slider 
                        defaultValue={priceRange} 
                        min={0} 
                        max={10000} 
                        step={100}
                        onValueChange={(value) => setPriceRange(value as number[])}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  
                  {/* Property Type */}
                  <div className="space-y-3">
                    <Label>Property Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["House", "Apartment", "Room", "Commercial"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox id={`type-${type}`} />
                          <label htmlFor={`type-${type}`} className="text-sm text-gray-300">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Listing Type */}
                  <div className="space-y-3">
                    <Label>Listing Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["For Rent", "For Sale"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox id={`listing-${type}`} />
                          <label htmlFor={`listing-${type}`} className="text-sm text-gray-300">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bedrooms & Bathrooms */}
                  <div className="space-y-3">
                    <Label>Bedrooms & Bathrooms</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-400">Beds</Label>
                        <div className="flex gap-2 mt-1">
                          {["Any", "1+", "2+", "3+", "4+"].map((option) => (
                            <Button 
                              key={option} 
                              variant="outline" 
                              size="sm"
                              className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-habix-purple hover:text-white hover:border-transparent"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-400">Baths</Label>
                        <div className="flex gap-2 mt-1">
                          {["Any", "1+", "2+", "3+"].map((option) => (
                            <Button 
                              key={option} 
                              variant="outline" 
                              size="sm"
                              className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-habix-purple hover:text-white hover:border-transparent"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Area Range */}
                  <div className="space-y-3">
                    <Label>Area Range (sq ft)</Label>
                    <div className="pt-4 px-2">
                      <Slider 
                        defaultValue={areaRange} 
                        min={0} 
                        max={5000} 
                        step={100}
                        onValueChange={(value) => setAreaRange(value as number[])}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{areaRange[0]} sq ft</span>
                      <span>{areaRange[1]} sq ft</span>
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div className="space-y-3">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["WiFi", "Parking", "Security", "Furnished", "Pool", "Gym", "Balcony", "Pets Allowed"].map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox id={`amenity-${amenity}`} />
                          <label htmlFor={`amenity-${amenity}`} className="text-sm text-gray-300">
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Filter Actions */}
                <div className="mt-6 flex justify-end gap-4">
                  <Button variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-700">
                    Reset
                  </Button>
                  <Button className="bg-habix-purple hover:bg-habix-light-purple text-white">
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Results Section */}
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">
              <span className="text-habix-purple">{properties.length}</span> Properties found
            </h1>
            <div className="flex items-center gap-3">
              <Label className="text-sm text-gray-400">Sort by:</Label>
              <select className="bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1 text-gray-300 text-sm">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
          
          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className="bg-transparent border border-gray-700 hover:bg-habix-purple hover:border-transparent rounded-md"
                disabled
              >
                &lt;
              </Button>
              <Button 
                variant="outline" 
                className="bg-habix-purple text-white border-habix-purple hover:bg-habix-light-purple hover:border-habix-light-purple"
              >
                1
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent border border-gray-700 hover:bg-habix-purple hover:border-transparent text-gray-300"
              >
                2
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent border border-gray-700 hover:bg-habix-purple hover:border-transparent text-gray-300"
              >
                3
              </Button>
              <span className="text-gray-500 px-2">...</span>
              <Button 
                variant="outline" 
                className="bg-transparent border border-gray-700 hover:bg-habix-purple hover:border-transparent text-gray-300"
              >
                12
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="bg-transparent border border-gray-700 hover:bg-habix-purple hover:border-transparent rounded-md"
              >
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Explore;
