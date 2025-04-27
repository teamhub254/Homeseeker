
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Phone, Mail, MessageCircle, Bed, Bath, Calendar, Building, Heart, Share2 } from "lucide-react";
import { useState } from "react";

interface PropertyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: {
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
  };
}

const PropertyDetailsDialog = ({
  open,
  onOpenChange,
  property,
}: PropertyDetailsDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { title, price, address, type, beds, baths, area, image } = property;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0">
        {/* Back Button and Actions */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white flex items-center gap-2">
            ← Back to listings
          </button>
          <div className="flex items-center gap-3">
            <Button onClick={() => {}} variant="outline" className="text-habix-purple border-habix-purple hover:bg-habix-purple hover:text-white">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={() => {}} variant="outline" className="text-habix-purple border-habix-purple hover:bg-habix-purple hover:text-white">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Title Section */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-gray-400 flex items-center gap-2">
            <Building className="h-4 w-4" />
            {address}
          </p>
        </div>

        {/* Property Images */}
        <div className="grid grid-cols-2 gap-4 p-6 border-y border-gray-800">
          <div className="aspect-video rounded-lg overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={image} alt="" className="rounded-lg w-full h-full object-cover" />
            <img src={image} alt="" className="rounded-lg w-full h-full object-cover" />
            <img src={image} alt="" className="rounded-lg w-full h-full object-cover" />
            <img src={image} alt="" className="rounded-lg w-full h-full object-cover" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8 p-6">
          <div className="col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-gray-800/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Key Details */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                    <Bed className="h-5 w-5 text-habix-purple mb-2" />
                    <span className="text-sm text-gray-400">Bedrooms</span>
                    <span className="font-semibold">{beds}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                    <Bath className="h-5 w-5 text-habix-purple mb-2" />
                    <span className="text-sm text-gray-400">Bathrooms</span>
                    <span className="font-semibold">{baths}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                    <Building className="h-5 w-5 text-habix-purple mb-2" />
                    <span className="text-sm text-gray-400">Area</span>
                    <span className="font-semibold">{area} ft²</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
                    <Calendar className="h-5 w-5 text-habix-purple mb-2" />
                    <span className="text-sm text-gray-400">Year Built</span>
                    <span className="font-semibold">2015</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-gray-400 leading-relaxed">
                    This beautifully renovated apartment features high ceilings, hardwood floors, and an open floor
                    plan. The kitchen includes stainless steel appliances, quartz countertops, and a breakfast bar. The
                    building offers a gym, rooftop deck, and 24-hour security. Located in the heart of downtown, it's
                    just steps away from restaurants, shopping, and public transportation.
                  </p>
                </div>

                {/* Key Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Key Features</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-habix-purple" />
                      Recently renovated
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-habix-purple" />
                      Modern appliances
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-habix-purple" />
                      Open floor plan
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-habix-purple" />
                      High ceilings
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-habix-purple" />
                      Natural lighting
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-habix-purple" />
                      Central location
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price and Availability */}
            <div className="p-6 bg-gray-800/50 rounded-lg space-y-4">
              <div className="text-2xl font-bold text-habix-purple">{price}</div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-4 w-4" />
                Available from 5/15/2023
              </div>
            </div>

            {/* Agent Info */}
            <div className="p-6 bg-gray-800/50 rounded-lg space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                  alt="Agent"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">Alex Johnson</h3>
                  <p className="text-sm text-gray-400">Property Agent</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">4.7</span>
                    <span className="text-sm text-gray-400">(6 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-habix-purple hover:bg-habix-light-purple">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Agent
                </Button>
                <Button variant="outline" className="w-full border-habix-purple text-habix-purple hover:bg-habix-purple hover:text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Agent
                </Button>
                <Button variant="outline" className="w-full border-habix-purple text-habix-purple hover:bg-habix-purple hover:text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Agent
                </Button>
              </div>
            </div>

            {/* Property ID */}
            <div className="text-center text-sm text-gray-500">
              Property ID: {property.id}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsDialog;
