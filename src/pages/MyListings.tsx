
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Plus, Home } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: string;
  bathrooms: string;
  created_at: string;
}

const MyListings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setProperties(properties.filter((property) => property.id !== id));
      
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
            <Button 
              onClick={() => navigate("/add-property")}
              className="flex items-center gap-2 bg-[#8b00ff] hover:bg-[#7a00e0]"
            >
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b00ff]"></div>
            </div>
          ) : properties.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="flex flex-col items-center gap-4 py-8">
                <Home className="h-12 w-12 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-700">No Properties Found</h2>
                <p className="text-gray-500 mb-4">
                  You haven't added any properties yet. Create your first property listing now.
                </p>
                <Button 
                  onClick={() => navigate("/add-property")}
                  className="bg-[#8b00ff] hover:bg-[#7a00e0]"
                >
                  Add Your First Property
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Bedrooms</TableHead>
                      <TableHead>Bathrooms</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{property.title}</TableCell>
                        <TableCell>{property.address}</TableCell>
                        <TableCell>{formatPrice(property.price)}</TableCell>
                        <TableCell>{property.bedrooms}</TableCell>
                        <TableCell>{property.bathrooms}</TableCell>
                        <TableCell>{formatDate(property.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/edit-property/${property.id}`)}
                              className="flex items-center"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(property.id)}
                              className="flex items-center text-red-500 hover:text-red-700 hover:border-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default MyListings;
