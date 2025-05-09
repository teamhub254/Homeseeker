
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import User from '../components/User';
import { properties } from '../data/properties';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Phone,
  Mail,
  Heart,
  Share,
  ArrowLeft
} from "lucide-react";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const property = properties.find(p => p.id === id);

  useEffect(() => {
    if (user && property) {
      checkIfPropertyIsSaved();
    }
  }, [user, property]);

  const checkIfPropertyIsSaved = async () => {
    if (!user || !property) return;
    
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select('*')
        .eq('user_id', user.id)
        .eq('property_id', property.id)
        .maybeSingle();
      
      if (error) throw error;
      
      setIsSaved(!!data);
    } catch (error) {
      console.error('Error checking saved property:', error);
    }
  };

  const handleSaveProperty = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save properties",
      });
      navigate('/login?redirectTo=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    if (!property) return;
    
    try {
      setIsLoading(true);
      
      if (isSaved) {
        // Unsave property
        const { error } = await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', property.id);
        
        if (error) throw error;
        
        setIsSaved(false);
        toast({
          title: "Property removed",
          description: "Property has been removed from your saved list",
        });
      } else {
        // Save property
        const { error } = await supabase
          .from('saved_properties')
          .insert([
            {
              user_id: user.id,
              property_id: property.id
            }
          ]);
        
        if (error) throw error;
        
        setIsSaved(true);
        toast({
          title: "Property saved",
          description: "Property has been added to your saved list",
        });
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the property",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || 'Property Listing',
        text: `Check out this property: ${property?.title}`,
        url: window.location.href,
      });
    } else {
      // Copy to clipboard fallback
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Property link has been copied to clipboard",
      });
    }
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!property) return;
    
    try {
      setIsLoading(true);
      
      const formData = {
        ...contactFormData,
        user_id: user?.id || null,
        property_id: property.id
      };
      
      const { error } = await supabase
        .from('property_inquiries')
        .insert([formData]);
      
      if (error) throw error;
      
      setContactFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      toast({
        title: "Inquiry sent",
        description: "Your message has been sent to the property owner",
      });
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!property) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-12 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Property not found</h2>
          <Link to="/" className="text-nest-primary hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-muted-foreground hover:text-nest-primary">
              Home
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <Link to="/properties" className="text-muted-foreground hover:text-nest-primary">
              Properties
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-nest-primary">{property.title}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/properties">
            <Button variant="ghost" className="flex items-center gap-1 px-0 text-muted-foreground hover:text-nest-primary hover:bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to listings
            </Button>
          </Link>
        </div>
        
        {/* Property Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-nest-dark mb-1">
              {property.title}
            </h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1 text-nest-secondary" />
              <span>
                {property.address}, {property.city}, {property.state} {property.zipCode}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-2xl md:text-3xl font-bold text-nest-primary">
              ${property.price.toLocaleString()}
              {!property.forSale && <span className="text-lg text-muted-foreground">/mo</span>}
            </div>
          </div>
        </div>
        
        {/* Property Images */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-[300px] md:h-[500px]">
            <img 
              src={property.images[activeImage]} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* For Sale/Rent Badge */}
            <Badge 
              className={`absolute top-4 left-4 ${property.forSale ? 'bg-nest-secondary' : 'bg-nest-accent'}`}
            >
              {property.forSale ? 'For Sale' : 'For Rent'}
            </Badge>
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button 
                variant="secondary"
                size="icon"
                className={`${isSaved ? 'bg-nest-accent text-white' : 'bg-white/80 hover:bg-white text-nest-accent hover:text-nest-accent'} rounded-full h-10 w-10`}
                onClick={handleSaveProperty}
                disabled={isLoading}
              >
                <Heart className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} />
              </Button>
              <Button 
                variant="secondary"
                size="icon"
                className="bg-white/80 hover:bg-white text-nest-dark hover:text-nest-dark rounded-full h-10 w-10"
                onClick={handleShareProperty}
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Thumbnail Images */}
          <div className="grid grid-cols-3 gap-2 p-2">
            {property.images.map((image, index) => (
              <button 
                key={index}
                onClick={() => setActiveImage(index)}
                className={`h-24 relative rounded overflow-hidden ${
                  index === activeImage ? 'ring-2 ring-nest-primary' : ''
                }`}
              >
                <img 
                  src={image} 
                  alt={`${property.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-nest-dark">Property Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded">
                  <Bed className="h-6 w-6 text-nest-primary mb-2" />
                  <span className="text-sm text-muted-foreground">Bedrooms</span>
                  <span className="font-bold">{property.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded">
                  <Bath className="h-6 w-6 text-nest-primary mb-2" />
                  <span className="text-sm text-muted-foreground">Bathrooms</span>
                  <span className="font-bold">{property.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded">
                  <Square className="h-6 w-6 text-nest-primary mb-2" />
                  <span className="text-sm text-muted-foreground">Area</span>
                  <span className="font-bold">{property.area} sq ft</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded">
                  <Calendar className="h-6 w-6 text-nest-primary mb-2" />
                  <span className="text-sm text-muted-foreground">Year Built</span>
                  <span className="font-bold">{property.yearBuilt}</span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-nest-dark">Description</h2>
              <p className="text-muted-foreground">
                {property.description}
              </p>
            </div>
            
            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-nest-dark">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-nest-primary mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-nest-dark">Contact Agent</h2>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-nest-light text-nest-primary flex items-center justify-center mr-3">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">{property.owner.name}</p>
                  <p className="text-sm text-muted-foreground">Property Agent</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <a href={`tel:${property.owner.phone}`} className="flex items-center text-muted-foreground hover:text-nest-primary">
                  <Phone className="h-4 w-4 mr-2" />
                  {property.owner.phone}
                </a>
                <a href={`mailto:${property.owner.email}`} className="flex items-center text-muted-foreground hover:text-nest-primary">
                  <Mail className="h-4 w-4 mr-2" />
                  {property.owner.email}
                </a>
              </div>
              <form onSubmit={handleContactFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={contactFormData.name}
                    onChange={handleContactFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={contactFormData.email}
                    onChange={handleContactFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Your Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={contactFormData.phone}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={contactFormData.message}
                    onChange={handleContactFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded"
                    defaultValue={`I'm interested in this property: ${property.title}`}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-nest-primary hover:bg-nest-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
            
            {/* Similar Properties */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-nest-dark">Similar Properties</h2>
              <div className="space-y-4">
                {properties
                  .filter(p => p.id !== property.id && p.type === property.type)
                  .slice(0, 2)
                  .map(similarProperty => (
                    <Link key={similarProperty.id} to={`/properties/${similarProperty.id}`} className="block">
                      <div className="flex border rounded overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-24 w-24 flex-shrink-0">
                          <img 
                            src={similarProperty.imageUrl} 
                            alt={similarProperty.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-3">
                          <h3 className="font-medium line-clamp-1">{similarProperty.title}</h3>
                          <p className="text-nest-primary text-sm font-bold">
                            ${similarProperty.price.toLocaleString()}
                            {!similarProperty.forSale && <span className="text-xs text-muted-foreground">/mo</span>}
                          </p>
                          <div className="flex text-xs text-muted-foreground">
                            <span className="mr-2">{similarProperty.bedrooms} beds</span>
                            <span className="mr-2">{similarProperty.bathrooms} baths</span>
                            <span>{similarProperty.area} sq ft</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-nest-dark py-8 px-4 text-white mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} NestQuestHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PropertyDetail;
