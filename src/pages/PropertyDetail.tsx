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

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: string;
  bathrooms: string;
  property_type: string;
  status: string;
  area: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  images: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    if (user && property) {
      checkIfPropertyIsSaved();
    }
  }, [user, property]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        throw new Error('Property not found');
      }

      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: "Error",
        description: "Failed to load property details",
        variant: "destructive",
      });
    }
  };

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

      // Validate form data
      if (!contactFormData.name || !contactFormData.email || !contactFormData.phone || !contactFormData.message) {
        throw new Error('Please fill in all fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactFormData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone number (basic validation)
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(contactFormData.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      const formData = {
        ...contactFormData,
        user_id: user?.id || null,
        property_id: property.id,
        created_at: new Date().toISOString(),
        status: 'new' // Add status field for tracking
      };

      const { error } = await supabase
        .from('property_inquiries')
        .insert([formData]);

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === '42P01') {
          throw new Error('The inquiries table does not exist. Please contact support.');
        } else if (error.code === '23505') {
          throw new Error('You have already sent an inquiry for this property.');
        } else {
          throw new Error(error.message || 'Failed to send message');
        }
      }

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
    } catch (error: any) {
      console.error('Error sending inquiry:', error);
      toast({
        title: "Error",
        description: error.message || "There was a problem sending your message. Please try again.",
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
              <MapPin className="h-4 w-4 mr-1" />
              <span>{`${property.address}, ${property.city}, ${property.state} ${property.zip_code}`}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={handleShareProperty}
              className="rounded-full"
              aria-label="Share property"
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSaveProperty}
              disabled={isLoading}
              className={`rounded-full ${isSaved ? 'text-red-500' : ''}`}
              aria-label={isSaved ? "Remove from saved" : "Save property"}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Property Images */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative aspect-video">
            <img
              src={property.images[activeImage] || '/placeholder-property.jpg'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          {property.images.length > 1 && (
            <div className="p-4 flex gap-2 overflow-x-auto">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${activeImage === index ? 'ring-2 ring-nest-primary' : ''
                    }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Price and Status */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-nest-primary">
                    ${property.price.toLocaleString()}
                    {property.status === 'rent' && <span className="text-sm text-muted-foreground">/mo</span>}
                  </p>
                  <Badge className={`mt-2 ${property.status === 'sale' ? 'bg-nest-secondary' : 'bg-nest-accent'}`}>
                    {property.status === 'sale' ? 'For Sale' : 'For Rent'}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Listed on</p>
                  <p className="font-medium">
                    {new Date(property.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-nest-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-medium">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-nest-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-medium">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-nest-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-medium">{property.area} sq ft</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-nest-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Listed</p>
                    <p className="font-medium">
                      {new Date(property.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Contact Agent</h2>
              <form onSubmit={handleContactFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={contactFormData.name}
                    onChange={handleContactFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={contactFormData.email}
                    onChange={handleContactFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={contactFormData.phone}
                    onChange={handleContactFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={contactFormData.message}
                    onChange={handleContactFormChange}
                    required
                    className="min-h-[100px]"
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

export default PropertyDetail;
