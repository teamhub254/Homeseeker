import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, MapPin, X } from "lucide-react";
import { SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  property_type: string;
  status: string;
  image_url: string;
  created_at: string;
  images?: string[];
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    propertyType: [],
    priceRange: [0, 2000000],
    bedrooms: "",
    bathrooms: "",
    listingType: "all",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProperties(data || []);
      setFilteredProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const applyFilters = () => {
    let results = properties;

    // Filter by property type
    if (filters.propertyType.length > 0) {
      results = results.filter(property =>
        filters.propertyType.includes(property.property_type.toLowerCase())
      );
    }

    // Filter by price range
    results = results.filter(
      property => property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    );

    // Filter by bedrooms
    if (filters.bedrooms) {
      if (filters.bedrooms === "4+") {
        results = results.filter(property => property.bedrooms >= 4);
      } else {
        results = results.filter(
          property => property.bedrooms.toString() === filters.bedrooms
        );
      }
    }

    // Filter by bathrooms
    if (filters.bathrooms) {
      if (filters.bathrooms === "3+") {
        results = results.filter(property => property.bathrooms >= 3);
      } else {
        results = results.filter(
          property => property.bathrooms.toString() === filters.bathrooms
        );
      }
    }

    // Filter by listing type (sale or rent)
    if (filters.listingType !== "all") {
      const isForSale = filters.listingType === "sale";
      results = results.filter(property => property.status === (isForSale ? 'available' : 'rented'));
    }

    setFilteredProperties(results);
  };

  const handlePropertyTypeChange = (type: string) => {
    setFilters(prev => {
      const updatedTypes = prev.propertyType.includes(type)
        ? prev.propertyType.filter(t => t !== type)
        : [...prev.propertyType, type];

      return { ...prev, propertyType: updatedTypes };
    });
  };

  const handlePriceChange = (values: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: values }));
  };

  const resetFilters = () => {
    setFilters({
      propertyType: [],
      priceRange: [0, 2000000],
      bedrooms: "",
      bathrooms: "",
      listingType: "all",
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-nest-primary py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_1px_4px_rgba(199,107,255,0.5)]">
            Browse Properties
          </h1>
          <div className="flex items-center text-white">
            <MapPin className="h-4 w-4 mr-1" />
            <span>Find your perfect property from our listings</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg text-nest-text-primary">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-nest-primary hover:text-nest-primary/80"
                >
                  Reset
                </Button>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {/* Property Type Filter */}
                <AccordionItem value="property-type">
                  <AccordionTrigger className="text-nest-text-primary">Property Type</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {['house', 'apartment', 'condo', 'townhouse'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={filters.propertyType.includes(type)}
                            onCheckedChange={() => handlePropertyTypeChange(type)}
                          />
                          <label
                            htmlFor={type}
                            className="text-sm font-medium leading-none text-nest-text-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Price Range Filter */}
                <AccordionItem value="price-range">
                  <AccordionTrigger className="text-nest-text-primary">Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[0, 2000000]}
                        max={2000000}
                        step={10000}
                        value={filters.priceRange}
                        onValueChange={handlePriceChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-nest-text-primary">
                        <span>{formatPrice(filters.priceRange[0])}</span>
                        <span>{formatPrice(filters.priceRange[1])}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Bedrooms Filter */}
                <AccordionItem value="bedrooms">
                  <AccordionTrigger className="text-nest-text-primary">Bedrooms</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      {['1', '2', '3', '4+'].map((num) => (
                        <Button
                          key={num}
                          variant={filters.bedrooms === num ? "default" : "outline"}
                          className={`w-full ${filters.bedrooms === num ? 'text-white' : 'text-nest-text-primary'}`}
                          onClick={() => setFilters(prev => ({ ...prev, bedrooms: num }))}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Bathrooms Filter */}
                <AccordionItem value="bathrooms">
                  <AccordionTrigger className="text-nest-text-primary">Bathrooms</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      {['1', '2', '3+'].map((num) => (
                        <Button
                          key={num}
                          variant={filters.bathrooms === num ? "default" : "outline"}
                          className={`w-full ${filters.bathrooms === num ? 'text-white' : 'text-nest-text-primary'}`}
                          onClick={() => setFilters(prev => ({ ...prev, bathrooms: num }))}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Listing Type Filter */}
                <AccordionItem value="listing-type">
                  <AccordionTrigger className="text-nest-text-primary">Listing Type</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {['all', 'sale', 'rent'].map((type) => (
                        <Button
                          key={type}
                          variant={filters.listingType === type ? "default" : "outline"}
                          className={`w-full justify-start ${filters.listingType === type ? 'text-white' : 'text-nest-text-primary'}`}
                          onClick={() => setFilters(prev => ({ ...prev, listingType: type }))}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Properties Listing */}
          <div className="flex-1">
            {/* Results Count & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-nest-text-secondary mb-3 sm:mb-0">
                Showing <span className="font-medium text-nest-text-primary">{filteredProperties.length}</span> properties
              </p>

              <div className="w-full sm:w-auto">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-full sm:w-[180px] text-purple-500">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nest-primary"></div>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    address={`${property.address}, ${property.city}, ${property.state}`}
                    price={property.price}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={property.area}
                    type={property.property_type}
                    imageUrl={property.images && property.images.length > 0 ? property.images[0] : '/placeholder-property.jpg'}
                    forSale={property.status === 'available'}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                className="bg-white rounded-lg shadow-sm p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <SearchX className="w-10 h-10 text-nest-primary" />
                </motion.div>

                <motion.h3
                  className="text-xl font-bold mb-2 text-nest-text-primary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  No properties found
                </motion.h3>

                <motion.p
                  className="text-sm mb-4 text-nest-text-secondary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Try adjusting your filters to see more results
                </motion.p>

                <Button onClick={resetFilters} className="bg-nest-primary hover:bg-nest-primary/90">
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-nest-dark py-8 px-4 text-white mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Vastiqa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Properties;
