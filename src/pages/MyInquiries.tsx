import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Property, properties } from "@/data/properties";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Calendar, ArrowLeft } from "lucide-react";

interface Inquiry {
  id: string;
  property_id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  response?: string;
  property: {
    title: string;
    address: string;
  };
}

const MyInquiries = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [response, setResponse] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchInquiries();
    }
  }, [user]);

  const fetchInquiries = async () => {
    try {
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id')
        .eq('user_id', user?.id);

      if (propertiesError) throw propertiesError;

      const propertyIds = properties.map(p => p.id);

      const { data, error } = await supabase
        .from('property_inquiries')
        .select(`
          *,
          property:properties (
            title,
            address
          )
        `)
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    try {
      setSendingResponse(true);

      // Send email to the inquirer
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: selectedInquiry.email,
          subject: `Re: Inquiry about ${selectedInquiry.property.title}`,
          text: response,
        },
      });

      if (emailError) throw emailError;

      // Update inquiry status
      const { error: updateError } = await supabase
        .from('property_inquiries')
        .update({
          status: 'responded',
          response: response,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedInquiry.id);

      if (updateError) throw updateError;

      toast({
        title: "Response sent",
        description: "Your response has been sent to the inquirer",
      });

      setSelectedInquiry(null);
      setResponse('');
      fetchInquiries(); // Refresh the list
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive",
      });
    } finally {
      setSendingResponse(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'responded':
        return <Badge className="bg-green-500">Responded</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b00ff]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/my-listings')}
              className="flex items-center gap-1 px-0 text-muted-foreground hover:text-nest-primary hover:bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Listings
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Property Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              {inquiries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No inquiries yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg mb-1">
                              {inquiry.property.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {inquiry.property.address}
                            </p>
                          </div>
                          {getStatusBadge(inquiry.status)}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="font-medium mb-2">Inquirer Details</p>
                            <div className="space-y-2">
                              <p className="flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-2 text-nest-primary" />
                                {inquiry.email}
                              </p>
                              <p className="flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-2 text-nest-primary" />
                                {inquiry.phone}
                              </p>
                              <p className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-nest-primary" />
                                {new Date(inquiry.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="font-medium mb-2">Message</p>
                            <p className="text-sm text-muted-foreground">
                              {inquiry.message}
                            </p>
                          </div>
                        </div>

                        {inquiry.status === 'new' && (
                          <div className="mt-4">
                            <Button
                              onClick={() => setSelectedInquiry(inquiry)}
                              className="w-full"
                            >
                              Respond to Inquiry
                            </Button>
                          </div>
                        )}

                        {inquiry.response && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-md">
                            <p className="font-medium mb-2">Your Response</p>
                            <p className="text-sm text-muted-foreground">
                              {inquiry.response}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Response Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Respond to Inquiry</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRespond} className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Responding to inquiry about: {selectedInquiry.property.title}
                    </p>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Type your response here..."
                      className="min-h-[200px]"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedInquiry(null);
                        setResponse('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={sendingResponse}
                      className="bg-nest-primary hover:bg-nest-primary/90"
                    >
                      {sendingResponse ? "Sending..." : "Send Response"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

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
