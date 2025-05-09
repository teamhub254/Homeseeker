
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Property, properties } from "@/data/properties";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Inquiry {
  id: string;
  property_id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const MyInquiries = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    if (user) {
      fetchInquiries();
    }
  }, [user]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);

      if (!user) return;

      const { data, error } = await supabase
        .from("property_inquiries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setInquiries(data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load your inquiries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPropertyDetails = (propertyId: string) => {
    return properties.find(property => property.id === propertyId);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="container mx-auto py-12 px-4">
          <h1 className="text-2xl font-bold text-nest-dark mb-8">My Inquiries</h1>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nest-primary"></div>
            </div>
          ) : inquiries.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => {
                    const property = getPropertyDetails(inquiry.property_id);
                    return (
                      <TableRow key={inquiry.id}>
                        <TableCell className="font-medium">
                          {formatDate(inquiry.created_at)}
                        </TableCell>
                        <TableCell>
                          {property ? (
                            <Link to={`/properties/${property.id}`} className="text-nest-primary hover:underline">
                              {property.title}
                            </Link>
                          ) : (
                            `Property #${inquiry.property_id}`
                          )}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate">{inquiry.message}</div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">You haven't made any inquiries yet</h2>
              <p className="text-muted-foreground mb-6">
                Browse our listings and contact property owners about properties you're interested in
              </p>
              <Link to="/properties">
                <button className="bg-nest-primary hover:bg-nest-primary/90 text-white py-2 px-4 rounded">
                  Browse Properties
                </button>
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

export default MyInquiries;
