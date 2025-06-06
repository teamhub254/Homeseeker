import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AuthGuard } from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import PropertyChat from "@/components/PropertyChat";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Building, User } from "lucide-react";

interface Inquiry {
    id: string;
    property_id: string;
    user_id: string;
    name: string;
    email: string;
    message: string;
    status: string;
    created_at: string;
    property?: {
        title: string;
        id: string;
    };
    user?: {
        email: string;
        profile?: {
            first_name: string;
            last_name: string;
            phone: string;
        };
    };
}

const PropertyInquiries = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    useEffect(() => {
        if (user) {
            fetchInquiries();
        }
    }, [user]);

    const fetchInquiries = async () => {
        try {
            setLoading(true);

            if (!user) return;

            // First, get all properties owned by the user
            const { data: properties, error: propertiesError } = await supabase
                .from('properties')
                .select('id')
                .eq('user_id', user.id);

            if (propertiesError) throw propertiesError;

            if (!properties || properties.length === 0) {
                setInquiries([]);
                return;
            }

            const propertyIds = properties.map(p => p.id);

            // Then get all inquiries for these properties
            const { data, error } = await supabase
                .from('inquiries')
                .select(`
                    id,
                    property_id,
                    user_id,
                    name,
                    email,
                    message,
                    status,
                    created_at,
                    property:properties (
                        id,
                        title
                    )
                `)
                .in('property_id', propertyIds)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Fetch user profiles separately
            const userIds = [...new Set(data.map(inquiry => inquiry.user_id))];
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('user_id, first_name, last_name, phone')
                .in('user_id', userIds);

            if (profilesError) throw profilesError;

            // Create a map of user profiles
            const profilesMap = new Map(
                profilesData?.map(profile => [profile.user_id, profile]) || []
            );

            // Transform the data to match the expected structure
            const transformedData = data.map(inquiry => {
                const profile = profilesMap.get(inquiry.user_id);
                return {
                    ...inquiry,
                    user: {
                        email: inquiry.email,
                        profile: profile ? {
                            first_name: profile.first_name,
                            last_name: profile.last_name,
                            phone: profile.phone
                        } : null
                    }
                };
            });

            setInquiries(transformedData);
        } catch (error) {
            console.error("Error fetching inquiries:", error);
            toast({
                title: "Error",
                description: "Failed to load inquiries.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM d, yyyy");
        } catch (e) {
            return dateString;
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: "Pending", variant: "secondary" },
            responded: { label: "Responded", variant: "default" },
            closed: { label: "Closed", variant: "destructive" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return <Badge variant={config.variant as any}>{config.label}</Badge>;
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto py-12 px-4">
                    <h1 className="text-2xl font-bold text-nest-dark mb-8">Property Inquiries</h1>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nest-primary"></div>
                        </div>
                    ) : inquiries.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Inquiries List */}
                            <div className="lg:col-span-1">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Inquiries</CardTitle>
                                        <CardDescription>
                                            {inquiries.length} total inquiries
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {inquiries.map((inquiry) => (
                                                <div
                                                    key={inquiry.id}
                                                    className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedInquiry?.id === inquiry.id
                                                        ? "bg-nest-primary/10 border border-nest-primary"
                                                        : "bg-white hover:bg-gray-50 border border-gray-200"
                                                        }`}
                                                    onClick={() => setSelectedInquiry(inquiry)}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center space-x-2">
                                                            <User className="h-4 w-4 text-nest-text-secondary" />
                                                            <span className="font-medium">
                                                                {inquiry.user?.profile
                                                                    ? `${inquiry.user.profile.first_name} ${inquiry.user.profile.last_name}`
                                                                    : inquiry.name}
                                                            </span>
                                                        </div>
                                                        {getStatusBadge(inquiry.status)}
                                                    </div>
                                                    <div className="text-sm text-nest-text-secondary mb-2">
                                                        {inquiry.property?.title}
                                                    </div>
                                                    <div className="text-xs text-nest-text-secondary">
                                                        {formatDate(inquiry.created_at)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Chat Section */}
                            <div className="lg:col-span-2">
                                {selectedInquiry ? (
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle>Chat with {selectedInquiry.user?.profile
                                                        ? `${selectedInquiry.user.profile.first_name} ${selectedInquiry.user.profile.last_name}`
                                                        : selectedInquiry.name}</CardTitle>
                                                    <CardDescription>
                                                        {selectedInquiry.property?.title}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const email = selectedInquiry.user?.email || selectedInquiry.email;
                                                            window.location.href = `mailto:${email}`;
                                                        }}
                                                    >
                                                        <MessageSquare className="h-4 w-4 mr-2" />
                                                        Email
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const phone = selectedInquiry.user?.profile?.phone;
                                                            if (phone) {
                                                                window.location.href = `tel:${phone}`;
                                                            }
                                                        }}
                                                        disabled={!selectedInquiry.user?.profile?.phone}
                                                    >
                                                        <Building className="h-4 w-4 mr-2" />
                                                        Call
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <PropertyChat
                                                propertyId={selectedInquiry.property_id}
                                                inquiryId={selectedInquiry.id}
                                            />
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card>
                                        <CardContent className="flex items-center justify-center h-[500px]">
                                            <div className="text-center text-nest-text-secondary">
                                                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                                                <p>Select an inquiry to start chatting</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h2 className="text-xl font-semibold mb-4">No inquiries yet</h2>
                            <p className="text-muted-foreground mb-6">
                                When potential buyers inquire about your properties, they will appear here
                            </p>
                            <Link to="/my-listings">
                                <Button className="bg-nest-primary hover:bg-nest-primary/90">
                                    View My Properties
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
};

export default PropertyInquiries; 