import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import User from '../components/User';
import PropertyChat from '../components/PropertyChat';
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
  ArrowLeft,
  MessageSquare
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  property_type: string;
  status: string;
  images: string[];
  created_at: string;
  user_id: string;
}

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [activeInquiry, setActiveInquiry] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchProperty();
      if (user) {
        checkExistingInquiry();
        fetchUserProfile();
      }
    }
  }, [id, user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setUserProfile(data);
        setInquiry(prev => ({
          ...prev,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          email: user?.email || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: "Error",
        description: "Failed to load property details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkExistingInquiry = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('id')
        .eq('property_id', id)
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setActiveInquiry(data.id);
        setShowChat(true);
      }
    } catch (error) {
      console.error('Error checking existing inquiry:', error);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to send an inquiry",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('inquiries')
        .insert({
          property_id: id,
          user_id: user.id,
          name: inquiry.name,
          email: inquiry.email,
          message: inquiry.message,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setActiveInquiry(data.id);
      setShowChat(true);
      toast({
        title: "Success",
        description: "Your inquiry has been sent successfully.",
      });

      setInquiry({
        name: '',
        email: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error sending inquiry:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nest-primary"></div>
          </div>
        </div>
      </div>
    );
  }

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
            <Link to="/" className="text-nest-text-secondary hover:text-nest-primary">
              Home
            </Link>
            <span className="mx-2 text-nest-text-secondary">/</span>
            <Link to="/properties" className="text-nest-text-secondary hover:text-nest-primary">
              Properties
            </Link>
            <span className="mx-2 text-nest-text-secondary">/</span>
            <span className="text-nest-text-primary">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/properties">
            <Button variant="ghost" className="flex items-center gap-1 px-0 text-nest-text-secondary hover:text-nest-primary hover:bg-transparent">
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
            <div className="flex items-center text-nest-text-secondary">
              <MapPin className="h-4 w-4 mr-1 text-nest-secondary" />
              <span>
                {property.address}, {property.city}, {property.state} {property.zip_code}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-2xl md:text-3xl font-bold text-nest-primary">
              ${property.price.toLocaleString()}
              {property.status === 'rented' && <span className="text-lg text-muted-foreground">/mo</span>}
            </div>
          </div>
        </div>

        {/* Property Images */}
        <div className="mb-8">
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <img
              src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder-property.jpg'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          {property.images && property.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {property.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${property.title} - Image ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-nest-dark">Property Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded">
                  <Bed className="h-6 w-6 text-nest-primary mb-2" />
                  <span className="text-sm text-nest-text-secondary">Bedrooms</span>
                  <span className="font-bold text-nest-text-primary">{property.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded">
                  <Bath className="h-6 w-6 text-nest-primary mb-2" />
                  <span className="text-sm text-nest-text-secondary">Bathrooms</span>
                  <span className="font-bold text-nest-text-primary">{property.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded">
                  <Square className="h-6 w-6 text-nest-primary mb-2" />
                  <span className="text-sm text-nest-text-secondary">Area</span>
                  <span className="font-bold text-nest-text-primary">{property.area} sq ft</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded">
                  <Calendar className="h-6 w-6 text-nest-primary mb-2" />
                  <span className="text-sm text-nest-text-secondary">Listed</span>
                  <span className="font-bold text-nest-text-primary">{new Date(property.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-nest-dark">Description</h2>
              <p className="text-nest-text-secondary">
                {property.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Inquiry Form or Chat */}
            {showChat && activeInquiry ? (
              <div className="bg-white rounded-lg shadow-sm">
                <PropertyChat
                  propertyId={property?.id || ''}
                  inquiryId={activeInquiry}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 text-nest-dark">Send Inquiry</h2>
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={inquiry.name}
                      onChange={(e) => setInquiry(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="bg-white text-nest-text-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={inquiry.email}
                      onChange={(e) => setInquiry(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-white text-nest-text-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={inquiry.message}
                      onChange={(e) => setInquiry(prev => ({ ...prev, message: e.target.value }))}
                      required
                      className="bg-white text-nest-text-primary min-h-[100px]"
                      placeholder="Enter your message here..."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-nest-primary hover:bg-nest-primary/90">
                    Send Inquiry
                  </Button>
                </form>
              </div>
            )}

            {/* Share */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 text-nest-dark">Share Property</h2>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
