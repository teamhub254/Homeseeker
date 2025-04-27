
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PropertyDetailsDialog from "./PropertyDetailsDialog";

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  address: string;
  type: 'House' | 'Apartment' | 'Room';
  beds: number;
  baths: number;
  area: number;
  image: string;
  tags: string[];
  forRent?: boolean;
  forSale?: boolean;
  featured?: boolean;
}

const PropertyCard = (props: PropertyCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { 
    id, title, price, address, type, beds, baths, area, 
    image, tags, forRent, forSale, featured 
  } = props;

  return (
    <div className="property-card group relative">
      {/* Image container */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay with favorite button and badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-between">
          <div className="flex justify-between">
            {featured && (
              <span className="bg-habix-purple text-white px-3 py-1 rounded-md text-sm">
                Featured
              </span>
            )}
            <button className="ml-auto bg-black/30 hover:bg-black/50 p-2 rounded-full transition-colors">
              <Heart className="h-5 w-5 text-white" />
            </button>
          </div>
          
          <div className="flex justify-end">
            {forRent && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                For Rent
              </span>
            )}
            {forSale && (
              <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">
                For Sale
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Property details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-white line-clamp-1">{title}</h3>
          <p className="text-habix-purple font-bold">{price}</p>
        </div>
        
        <p className="text-gray-400 text-sm mb-3">{address}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-md text-sm">{type}</span>
          <div className="flex items-center space-x-4 text-gray-300 text-sm">
            <span>{beds} Beds</span>
            <span>{baths} Baths</span>
            <span>{area} ft²</span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* ID and View Details */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-800">
          <span className="text-gray-500 text-sm">ID: {id}</span>
          <Button 
            variant="link" 
            className="text-habix-purple hover:text-habix-light-purple p-0"
            onClick={() => setShowDetails(true)}
          >
            View Details →
          </Button>
        </div>
      </div>

      <PropertyDetailsDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        property={props}
      />
    </div>
  );
};

export default PropertyCard;
