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

interface SearchBarProps {
  location: string;
  propertyType: string;
  priceRange: string;
  onLocationChange: (value: string) => void;
  onPropertyTypeChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const SearchBar = ({
  location,
  propertyType,
  priceRange,
  onLocationChange,
  onPropertyTypeChange,
  onPriceRangeChange,
  onSearch,
}: SearchBarProps) => {
  return (
    <form
      onSubmit={onSearch}
      className="bg-white rounded-lg shadow-md p-4 md:p-6 max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Input
            type="text"
            placeholder="Location"
            className="w-full"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
          />
        </div>

        <div className="md:col-span-1">
          <Select value={propertyType} onValueChange={onPropertyTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-1">
          <Select value={priceRange} onValueChange={onPriceRangeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="any">All Prices</SelectItem>
                <SelectItem value="0-100000">$0 - $100,000</SelectItem>
                <SelectItem value="100000-300000">$100,000 - $300,000</SelectItem>
                <SelectItem value="300000-600000">$300,000 - $600,000</SelectItem>
                <SelectItem value="600000-1000000">$600,000 - $1,000,000</SelectItem>
                <SelectItem value="1000000+">$1,000,000+</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-1">
          <Button
            type="submit"
            className="w-full bg-nest-primary hover:bg-nest-primary/90"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
