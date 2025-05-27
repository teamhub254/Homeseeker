
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { properties } from '../data/properties';
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

const Properties = () => {
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: [],
    priceRange: [0, 2000000],
    bedrooms: "",
    bathrooms: "",
    listingType: "all",
  });

  const applyFilters = () => {
    let results = properties;

    // Filter by property type
    if (filters.propertyType.length > 0) {
      results = results.filter(property =>
        filters.propertyType.includes(property.type.toLowerCase())
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
      results = results.filter(property => property.forSale === isForSale);
    }

    setFilteredProperties(results);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

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
          <div className="flex items-center text-white/80">
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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs text-nest-primary hover:text-nest-primary/80 h-auto p-0"
                >
                  Reset All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Listing Type Filter */}
                <div>
                  <h4 className="font-medium mb-3">Listing Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={filters.listingType === "all" ? "default" : "outline"}
                      onClick={() => setFilters(prev => ({ ...prev, listingType: "all" }))}
                      size="sm"
                      className={filters.listingType === "all" ? "bg-nest-primary" : ""}
                    >
                      All
                    </Button>
                    <Button
                      variant={filters.listingType === "sale" ? "default" : "outline"}
                      onClick={() => setFilters(prev => ({ ...prev, listingType: "sale" }))}
                      size="sm"
                      className={filters.listingType === "sale" ? "bg-nest-primary" : ""}
                    >
                      For Sale
                    </Button>
                    <Button
                      variant={filters.listingType === "rent" ? "default" : "outline"}
                      onClick={() => setFilters(prev => ({ ...prev, listingType: "rent" }))}
                      size="sm"
                      className={filters.listingType === "rent" ? "bg-nest-primary" : ""}
                    >
                      For Rent
                    </Button>
                  </div>
                </div>

               {/* Price Range */}
<div>
  <h4 className="font-medium mb-3 text-purple-400">Price Range</h4>
  <div className="mb-6">
    <Slider
      defaultValue={[0, 2000000]}
      value={filters.priceRange}
      min={0}
      max={2000000}
      step={50000}
      onValueChange={handlePriceChange}
      className="my-6"
    />
    <div className="flex justify-between text-sm text-purple-300">
      <span>{formatPrice(filters.priceRange[0])}</span>
      <span>{formatPrice(filters.priceRange[1])}</span>
    </div>
  </div>
</div>
                {/* Property Type Filter */}
<div>
  <h4 className="font-medium mb-3 text-purple-400">Property Type</h4>
  <div className="space-y-2">
    {["apartment", "house", "condo", "townhouse", "studio"].map((type) => (
      <div key={type} className="flex items-center">
        <Checkbox
          id={`type-${type}`}
          checked={filters.propertyType.includes(type)}
          onCheckedChange={() => handlePropertyTypeChange(type)}
        />
        <label
          htmlFor={`type-${type}`}
          className="ml-2 text-sm cursor-pointer capitalize text-purple-300"
        >
          {type}
        </label>
      </div>
    ))}
  </div>
</div>
               {/* Bedrooms Filter */}
<div>
  <h4 className="font-medium mb-3 text-purple-400">Bedrooms</h4>
  <Select
    value={filters.bedrooms}
    onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}
  >
    <SelectTrigger className="text-purple-300">
      <SelectValue placeholder="Any bedrooms" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="any">Any</SelectItem>
        <SelectItem value="1">1</SelectItem>
        <SelectItem value="2">2</SelectItem>
        <SelectItem value="3">3</SelectItem>
        <SelectItem value="4+">4+</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>

                {/* Bathrooms Filter */}
<div>
  <h4 className="font-medium mb-3 text-purple-400">Bathrooms</h4>
  <Select
    value={filters.bathrooms}
    onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: value }))}
  >
    <SelectTrigger className="text-purple-300">
      <SelectValue placeholder="Any bathrooms" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="any">Any</SelectItem>
        <SelectItem value="1">1</SelectItem>
        <SelectItem value="2">2</SelectItem>
        <SelectItem value="3+">3+</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>
</div>
</div>
</div>
          {/* Filter Toggle (Mobile) */}
          <div className="lg:hidden mb-4">
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              variant="outline"
              className="flex items-center gap-2 w-full"
            >
              <Filter className="h-4 w-4" />
              <span>Filter Properties</span>
            </Button>

            {/* Mobile Filter Drawer */}
            {isFilterOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                <div className="bg-white w-80 max-w-full h-full overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button onClick={() => setIsFilterOpen(false)}>
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Listing Type Filter */}
                    <div>
                      <h4 className="font-medium mb-3">Listing Type</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={filters.listingType === "all" ? "default" : "outline"}
                          onClick={() => setFilters(prev => ({ ...prev, listingType: "all" }))}
                          size="sm"
                          className={filters.listingType === "all" ? "bg-nest-primary" : ""}
                        >
                          All
                        </Button>
                        <Button
                          variant={filters.listingType === "sale" ? "default" : "outline"}
                          onClick={() => setFilters(prev => ({ ...prev, listingType: "sale" }))}
                          size="sm"
                          className={filters.listingType === "sale" ? "bg-nest-primary" : ""}
                        >
                          For Sale
                        </Button>
                        <Button
                          variant={filters.listingType === "rent" ? "default" : "outline"}
                          onClick={() => setFilters(prev => ({ ...prev, listingType: "rent" }))}
                          size="sm"
                          className={filters.listingType === "rent" ? "bg-nest-primary" : ""}
                        >
                          For Rent
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Accordions for Filters */}
                    <Accordion type="single" collapsible>
                      <AccordionItem value="price">
                        <AccordionTrigger>Price Range</AccordionTrigger>
                        <AccordionContent>
                          <div className="mb-6">
                            <Slider
                              defaultValue={[0, 2000000]}
                              value={filters.priceRange}
                              min={0}
                              max={2000000}
                              step={50000}
                              onValueChange={handlePriceChange}
                              className="my-6"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{formatPrice(filters.priceRange[0])}</span>
                              <span>{formatPrice(filters.priceRange[1])}</span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="property-type">
                        <AccordionTrigger>Property Type</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {["apartment", "Bungalow", "Mansion", "townhouse", "Bedsitter/studio"].map((type) => (
                              <div key={type} className="flex items-center">
                                <Checkbox
                                  id={`mobile-type-${type}`}
                                  checked={filters.propertyType.includes(type)}
                                  onCheckedChange={() => handlePropertyTypeChange(type)}
                                />
                                <label
                                  htmlFor={`mobile-type-${type}`}
                                  className="ml-2 text-sm cursor-pointer capitalize"
                                >
                                  {type}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="bedrooms">
                        <AccordionTrigger>Bedrooms</AccordionTrigger>
                        <AccordionContent>
                          <Select
                            value={filters.bedrooms}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Any bedrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4+">4+</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="bathrooms">
                        <AccordionTrigger>Bathrooms</AccordionTrigger>
                        <AccordionContent>
                          <Select
                            value={filters.bathrooms}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, bathrooms: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Any bathrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3+">3+</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="pt-4 space-y-4">
                      <Button
                        className="w-full bg-nest-primary hover:bg-nest-primary/90"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Apply Filters
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          resetFilters();
                          setIsFilterOpen(false);
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Properties Listing */}
          <div className="flex-1">
            {/* Results Count & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <p className="text-muted-foreground mb-3 sm:mb-0">
                Showing <span className="font-medium text-nest-dark">{filteredProperties.length}</span> properties
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
            {filteredProperties.length > 0 ? (
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
                    type={property.type}
                    imageUrl={property.imageUrl}
                    forSale={property.forSale}
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
    className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.6 }}
  >
    No properties found
  </motion.h3>

  <motion.p
    className="text-sm mb-4 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent"
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

            {/* Pagination */}
            {filteredProperties.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-1">
                  <Button variant="outline" size="icon" disabled>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <Button variant="default" size="icon" className="bg-nest-primary">
                    1
                  </Button>
                  <Button variant="outline" size="icon">
                    2
                  </Button>
                  <Button variant="outline" size="icon">
                    3
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>
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
