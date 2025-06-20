import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Bed, Bath, Ruler } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this property: ${title}`,
          url: window.location.href
        });
      } else {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Property link has been copied to clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing property:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to save properties.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, property_id: id }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already saved",
            description: "This property is already in your saved properties.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Property saved!",
          description: "This property has been added to your saved properties.",
        });
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "Failed to save property. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full min-w-[280px] max-w-[360px] sm:max-w-none mx-auto">
      <div className="relative">
        <Link to={`/property/${id}`}>
          <div className="aspect-[4/3] w-full bg-gray-200">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-property.jpg';
                target.onerror = null;
              }}
            />
          </div>
        </Link>

        <Badge
          className={`absolute top-2 left-2 ${forSale ? 'bg-nest-secondary' : 'bg-nest-accent'}`}
        >
          {forSale ? 'For Sale' : 'For Rent'}
        </Badge>

        <div className="absolute top-2 right-2 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="bg-white/90 hover:bg-white h-8 w-8 sm:h-9 sm:w-9"
          >
            <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="bg-white/90 hover:bg-white h-8 w-8 sm:h-9 sm:w-9"
          >
            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/property/${id}`} className="hover:text-nest-primary flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base line-clamp-1 truncate">{title}</h3>
          </Link>
          <p className="text-sm sm:text-base font-bold text-nest-primary whitespace-nowrap">
            {formatPrice(price)}
            {!forSale && <span className="text-xs sm:text-sm text-muted-foreground">/mo</span>}
          </p>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-nest-secondary" />
          <p className="truncate">{address}</p>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <div className="bg-nest-accent/10 rounded-full p-2 mb-1 mx-auto w-fit">
              <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-nest-accent" />
            </div>
            <p className="text-xs sm:text-sm font-medium">{bedrooms}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Beds</p>
          </div>
          <div>
            <div className="bg-nest-primary/10 rounded-full p-2 mb-1 mx-auto w-fit">
              <Bath className="w-4 h-4 sm:w-5 sm:h-5 text-nest-primary" />
            </div>
            <p className="text-xs sm:text-sm font-medium">{bathrooms}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Baths</p>
          </div>
          <div>
            <div className="bg-nest-secondary/10 rounded-full p-2 mb-1 mx-auto w-fit">
              <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-nest-secondary" />
            </div>
            <p className="text-xs sm:text-sm font-medium">{area}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Sq Ft</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Badge variant="outline" className="text-xs">{type}</Badge>
        <Link to={`/property/${id}`}>
          <Button variant="link" className="p-0 h-auto text-nest-primary hover:text-nest-primary/80 text-xs sm:text-sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;