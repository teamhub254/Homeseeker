
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

interface SavedProperty {
  id: string;
  property_id: string;
}

const SavedProperties = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [savedIds, setSavedIds] = useState<SavedProperty[]>([]);

  useEffect(() => {
    if (user) {
      fetchSavedProperties();
    }
  }, [user]);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);

      if (!user) return;

      const { data, error } = await supabase
        .from("saved_properties")
        .select("id, property_id")
        .eq("user_id", user.id);

      if (error) throw error;

      // Save the saved property IDs with their database IDs
      setSavedIds(data);

      // Filter properties from our data file
      const savedProps = properties.filter(prop =>
        data.some(saved => saved.property_id === prop.id)
      );

      setSavedProperties(savedProps);
    } catch (error) {
      console.error("Error fetching saved properties:", error);
      toast({
        title: "Error",
        description: "Failed to load your saved properties.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeSavedProperty = async (propertyId: string) => {
    try {
      if (!user) return;

      // Find the saved property database ID
      const savedProperty = savedIds.find(saved => saved.property_id === propertyId);

      if (!savedProperty) return;

      const { error } = await supabase
        .from("saved_properties")
        .delete()
        .eq("id", savedProperty.id);

      if (error) throw error;

      // Update UI
      setSavedProperties(savedProperties.filter(prop => prop.id !== propertyId));
      setSavedIds(savedIds.filter(saved => saved.property_id !== propertyId));

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

        <div className="container mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold text-nest-dark mb-8">Saved Properties</h1>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nest-primary"></div>
            </div>
          ) : savedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map(property => (
                <div key={property.id} className="relative group">
                  <PropertyCard
                    id={property.id}
                    title={property.title}
                    address={`${property.address}, ${property.city}, ${property.state}`}
                    price={property.price}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={property.area}
                    type={property.type}
                    imageUrl={property.imageUrl}
                    forSale={property.forSale}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeSavedProperty(property.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">You haven't saved any properties yet</h2>
              <p className="text-muted-foreground mb-6">
                Browse our listings and save properties you're interested in
              </p>
              <Link to="/properties">
                <Button className="bg-nest-primary hover:bg-nest-primary/90">
                  Browse Properties
                </Button>
              </Link>
            </div>
          )}
        </div>

        <footer className="bg-nest-dark py-8 px-4 text-white mt-auto">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Vastiqa. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
};

export default SavedProperties;
