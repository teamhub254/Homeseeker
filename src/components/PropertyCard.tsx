import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Home, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  imageUrl: string;
  forSale: boolean;
}

const PropertyCard = ({
  id,
  title,
  address,
  price,
  bedrooms,
  bathrooms,
  area,
  type,
  imageUrl,
  forSale
}: PropertyCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder-property.jpg';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {/* Property Image */}
        <Link to={`/properties/${id}`}>
          <img
            src={imageUrl || '/placeholder-property.jpg'}
            alt={title}
            className="h-52 w-full object-cover"
            onError={handleImageError}
          />
        </Link>

        {/* Sale/Rent Badge */}
        <Badge
          className={`absolute top-2 left-2 ${forSale ? 'bg-nest-secondary' : 'bg-nest-accent'}`}
        >
          {forSale ? 'For Sale' : 'For Rent'}
        </Badge>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-nest-accent hover:text-nest-accent rounded-full h-8 w-8"
          aria-label="Add to favorites"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <Link to={`/properties/${id}`} className="hover:text-nest-primary">
            <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
          </Link>
          <p className="text-lg font-bold text-nest-primary">
            ${price.toLocaleString()}
            {!forSale && <span className="text-sm text-muted-foreground">/mo</span>}
          </p>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1 text-nest-secondary" />
          <p className="truncate">{address}</p>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium">{bedrooms}</p>
            <p className="text-xs text-muted-foreground">Beds</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium">{bathrooms}</p>
            <p className="text-xs text-muted-foreground">Baths</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium">{area}</p>
            <p className="text-xs text-muted-foreground">Sq Ft</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge variant="outline" className="text-xs">
          {type}
        </Badge>
        <Link to={`/properties/${id}`}>
          <Button variant="link" className="p-0 h-auto text-nest-primary hover:text-nest-primary/80">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
