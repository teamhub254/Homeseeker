
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, MapPin, DollarSign, Home, Building, Bed, Bath, AreaChart } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ListProperty = () => {
  const [propertyType, setPropertyType] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Property submitted successfully! It will be reviewed by our team.");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">List Your Property</h1>
            <p className="text-gray-400">Complete the form below to list your property on Habix</p>
          </div>
          
          <div className="bg-[#1E1E30] border border-gray-800 rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-gray-800 pb-2">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input 
                      id="title"
                      placeholder="e.g. Modern Downtown Apartment"
                      className="bg-gray-800/50 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="room">Room</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="listingType">Listing Type</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="sale">For Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        id="price"
                        type="number"
                        min="0"
                        placeholder="0"
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your property in detail..."
                    className="bg-gray-800/50 border-gray-700 text-white h-32"
                    required
                  />
                </div>
              </div>
              
              {/* Location */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-gray-800 pb-2">Location</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        id="address"
                        placeholder="Street address"
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      placeholder="City"
                      className="bg-gray-800/50 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state"
                      placeholder="State/Province"
                      className="bg-gray-800/50 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input 
                      id="zipCode"
                      placeholder="Zip/Postal code"
                      className="bg-gray-800/50 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Property Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-gray-800 pb-2">Property Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        id="bedrooms"
                        type="number"
                        min="0"
                        placeholder="0"
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        id="bathrooms"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="0"
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sq ft)</Label>
                    <div className="relative">
                      <AreaChart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        id="area"
                        type="number"
                        min="0"
                        placeholder="0"
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="space-y-3">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {["WiFi", "Parking", "Security", "Furnished", "Swimming Pool", "Gym",
                      "Air Conditioning", "Laundry", "Balcony", "Pets Allowed", "Storage", "Dishwasher"].map((amenity) => (
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
              
              {/* Images */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-gray-800 pb-2">Images</h2>
                
                <div className="space-y-3">
                  <Label>Upload Property Images</Label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-400 mb-2">Drag and drop your images here</p>
                    <p className="text-gray-500 text-sm mb-4">Supported formats: JPG, PNG, WebP (max 5MB each)</p>
                    <Button type="button" variant="outline" className="border-habix-purple text-habix-purple hover:bg-habix-purple hover:text-white">
                      Browse Files
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-gray-800 pb-2">Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input 
                      id="contactName"
                      placeholder="Your name"
                      className="bg-gray-800/50 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input 
                      id="contactEmail"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-gray-800/50 border-gray-700 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input 
                      id="contactPhone"
                      placeholder="Phone number"
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>
              
              {/* Terms and Submit */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <label htmlFor="terms" className="text-sm text-gray-300">
                    I agree to the <a href="#" className="text-habix-purple hover:underline">Terms and Conditions</a>
                  </label>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-habix-purple hover:bg-habix-light-purple text-white py-6"
                >
                  Submit Property
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ListProperty;
