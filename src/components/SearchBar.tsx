import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [listingType, setListingType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search with:", {
      location,
      propertyType,
      priceRange,
      bedrooms,
      bathrooms,
      listingType
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-[#1a1626] rounded-2xl shadow-xl p-6 md:p-8 max-w-6xl mx-auto mt-6 border border-white/5"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Location */}
        <Input
          type="text"
          placeholder="Location"
          className="w-full bg-[#241f33] text-white placeholder:text-gray-400 border border-white/10 focus:ring-purple-500 focus:border-purple-500"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Property Type */}
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className="bg-[#241f33] text-white border border-white/10 focus:ring-purple-500 focus:border-purple-500">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#2c243f] text-white">
            <SelectGroup>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Price Range */}
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="bg-[#241f33] text-white border border-white/10 focus:ring-purple-500 focus:border-purple-500">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent className="bg-[#2c243f] text-white">
            <SelectGroup>
              <SelectItem value="any">All Prices</SelectItem>
              <SelectItem value="0-100000">KES 0 - 100K</SelectItem>
              <SelectItem value="100000-300000">KES 100K - 300K</SelectItem>
              <SelectItem value="300000-600000">KES 300K - 600K</SelectItem>
              <SelectItem value="600000-1000000">KES 600K - 1M</SelectItem>
              <SelectItem value="1000000+">KES 1M+</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Bedrooms */}
        <Select value={bedrooms} onValueChange={setBedrooms}>
          <SelectTrigger className="bg-[#241f33] text-white border border-white/10 focus:ring-purple-500 focus:border-purple-500">
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent className="bg-[#2c243f] text-white">
            <SelectGroup>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Bathrooms */}
        <Select value={bathrooms} onValueChange={setBathrooms}>
          <SelectTrigger className="bg-[#241f33] text-white border border-white/10 focus:ring-purple-500 focus:border-purple-500">
            <SelectValue placeholder="Bathrooms" />
          </SelectTrigger>
          <SelectContent className="bg-[#2c243f] text-white">
            <SelectGroup>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Listing Type */}
        <Select value={listingType} onValueChange={setListingType}>
          <SelectTrigger className="bg-[#241f33] text-white border border-white/10 focus:ring-purple-500 focus:border-purple-500">
            <SelectValue placeholder="Listing Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#2c243f] text-white">
            <SelectGroup>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Search Button (full width on small screens) */}
        <div className="md:col-span-6">
          <Button
            type="submit"
            className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Properties
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
