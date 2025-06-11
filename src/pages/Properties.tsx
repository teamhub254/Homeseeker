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
import { Filter, MapPin, X, ChevronDown, Search } from "lucide-react";
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

const propertyTypes = [
  "Apartments",
  "Maisonettes",
  "Bungalows",
  "Bedsitters & Single Rooms",
  "Villas",
  "Townhouses"
];

const kenyaCounties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta", "Garissa", "Wajir", "Mandera",
  "Marsabit", "Isiolo", "Meru", "Tharaka Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia",
  "Uasin Gishu", "Elgeyo Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay",
  "Migori", "Kisii", "Nyamira", "Nairobi"
];

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
    minPrice: 0,
    maxPrice: 2000000,
    location: "",
  });
  const [searchQuery, setSearchQuery] = useState('');

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
    if (properties.length > 0) {
      let results = [...properties];

      // Search by query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(
          property =>
            property.title.toLowerCase().includes(query) ||
            property.address.toLowerCase().includes(query) ||
            property.property_type.toLowerCase().includes(query) ||
            property.city.toLowerCase().includes(query)
        );
      }

      // Filter by property type
      if (filters.propertyType.length > 0) {
        results = results.filter(property =>
          filters.propertyType.includes(property.property_type)
        );
      }

      // Filter by price range
      results = results.filter(
        property => property.price >= filters.minPrice && property.price <= filters.maxPrice
      );

      // Filter by bedrooms
      if (filters.bedrooms) {
        results = results.filter(property => property.bedrooms >= Number(filters.bedrooms));
      }

      // Filter by bathrooms
      if (filters.bathrooms) {
        results = results.filter(property => property.bathrooms >= Number(filters.bathrooms));
      }

      // Filter by listing type
      if (filters.listingType !== 'all') {
        const isForSale = filters.listingType === 'sale';
        results = results.filter(property => property.status === (isForSale ? 'available' : 'rented'));
      }

      // Filter by location
      if (filters.location) {
        results = results.filter(property => property.city === filters.location);
      }

      setFilteredProperties(results);
    }
  }, [properties, filters, searchQuery]);

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
      minPrice: 0,
      maxPrice: 2000000,
      location: "",
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  // Add a function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Add a function to clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties by title, location, or type..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-nest-primary focus:border-nest-primary bg-white text-gray-900 placeholder-gray-500"
              />
              <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters */}
            <div className="w-full lg:w-64 space-y-4">
              <Accordion type="single" collapsible className="w-full bg-white rounded-lg shadow-sm">
                {/* Property Type Filter */}
                <AccordionItem value="property-type">
                  <AccordionTrigger className="text-nest-text-primary">Property Type</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Property Type</h3>
                      <div className="space-y-2">
                        {propertyTypes.map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.propertyType.includes(type)}
                              onChange={(e) => {
                                const newTypes = e.target.checked
                                  ? [...filters.propertyType, type]
                                  : filters.propertyType.filter((t) => t !== type);
                                setFilters({ ...filters, propertyType: newTypes });
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-nest-primary focus:ring-nest-primary"
                            />
                            <span className="ml-2 text-sm text-gray-600">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Location Filter */}
                <AccordionItem value="location">
                  <AccordionTrigger className="text-nest-text-primary">Location</AccordionTrigger>
                  <AccordionContent className="bg-white">
                    <div className="space-y-4 p-2">
                      <div className="relative">
                        <select
                          value={filters.location}
                          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-nest-primary focus:border-nest-primary appearance-none bg-white text-gray-900"
                          aria-label="Select county"
                        >
                          <option value="" className="text-gray-900">All Counties</option>
                          {kenyaCounties.map((county) => (
                            <option key={county} value={county} className="text-gray-900">
                              {county}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Price Range Filter */}
                <AccordionItem value="price">
                  <AccordionTrigger className="text-nest-text-primary">Price Range (Kshs)</AccordionTrigger>
                  <AccordionContent className="bg-white">
                    <div className="space-y-4 p-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-900 mb-1">Min Price</label>
                          <input
                            type="number"
                            id="minPrice"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-nest-primary focus:border-nest-primary bg-white text-gray-900"
                            placeholder="Min"
                          />
                        </div>
                        <div>
                          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-900 mb-1">Max Price</label>
                          <input
                            type="number"
                            id="maxPrice"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-nest-primary focus:border-nest-primary bg-white text-gray-900"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        Current range: {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
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
      </main>

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
