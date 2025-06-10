import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { toast } from "@/components/ui/use-toast";
import { Property, properties } from "@/data/properties";
import { Trash2 } from "lucide-react";

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  image_url: string;
  for_sale: boolean;
}

const SavedProperties = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (user) {
      fetchSavedProperties();
    }
  }, [user]);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);

      // First get the saved property IDs
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user?.id);

      if (favoritesError) throw favoritesError;

      if (!favorites || favorites.length === 0) {
        setProperties([]);
        return;
      }

      const propertyIds = favorites.map(fav => fav.property_id);

      // Then get the full property details
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .in('id', propertyIds);

      if (propertiesError) throw propertiesError;

      setProperties(propertiesData || []);
    } catch (error: any) {
      console.error('Error fetching saved properties:', error);
      toast({
        title: "Error",
        description: "Failed to load saved properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeSavedProperty = async (propertyId: string) => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId);

      if (error) throw error;

      // Update UI
      setProperties(properties.filter(prop => prop.id !== propertyId));

      toast({
        title: "Property removed",
        description: "Property has been removed from your saved list.",
      });
    } catch (error) {
      console.error("Error removing saved property:", error);
      toast({
        title: "Error",
        description: "Failed to remove the property from your saved list.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Saved Properties</h1>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nest-primary"></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't saved any properties yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    address={property.address}
                    price={property.price}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={property.area}
                    type={property.type}
                    imageUrl={property.image_url}
                    forSale={property.for_sale}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default SavedProperties;
