import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PropertyImageUpload from '@/components/PropertyImageUpload';
import { Label } from '@/components/ui/label';

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  bedrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Bedrooms must be a positive number",
  }),
  bathrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Bathrooms must be a positive number",
  }),
  area: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Area must be a positive number",
  }),
  type: z.string().min(1, "Property type is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  images: z.array(z.string()).optional(),
  for_sale: z.string().default("true"),
});

const propertyTypes = [
  "Apartments",
  "Maisonettes",
  "Bungalows",
  "Bedsitters & Single Rooms",
  "Villas",
  "Townhouses"
];

const kenyaCounties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta", "Garissa", "Wajir", "Mandera",
  "Marsabit", "Isiolo", "Meru", "Tharaka Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia",
  "Uasin Gishu", "Elgeyo Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay",
  "Migori", "Kisii", "Nyamira", "Nairobi"
];

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyId, setPropertyId] = useState<string>('');

  // Fetch user role
  useEffect(() => {
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    if (!error && data) setRole(data.role);
  };

  // If not a lister, show error or redirect
  if (role && role !== 'lister') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="mb-4">You must be a property lister to add a property.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      bedrooms: "1",
      bathrooms: "1",
      area: "",
      type: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      images: [],
      for_sale: "true",
    },
  });

  const handleImagesUpdated = (newImages: string[]) => {
    setImages(newImages);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a property",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("properties").insert({
        user_id: user.id,
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        property_type: data.type,
        status: data.for_sale === "true" ? "sale" : "rent",
        area: parseFloat(data.area),
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        images: data.images,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property added successfully",
      });

      navigate("/my-listings");
    } catch (error: any) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a function to handle final submission
  const handleFinalSubmit = () => {
    navigate("/properties");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-[#8b00ff]" />
              <CardTitle className="text-2xl">Add New Property</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Modern Apartment with City View" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="250000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {propertyTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="for_sale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Listing Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select listing type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">For Sale</SelectItem>
                              <SelectItem value="false">For Rent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Property Details */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Property Details</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select number of bedrooms" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Studio</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select number of bathrooms" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="1.5">1.5</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="2.5">2.5</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="3.5">3.5+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area (sq ft)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1200" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your property in detail..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include key features, recent renovations, and what makes this property special.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Location</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select county" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {kenyaCounties.map((county) => (
                                <SelectItem key={county} value={county}>
                                  {county}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="Enter zip code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Property Images</Label>
                  <PropertyImageUpload
                    propertyId={propertyId}
                    onImagesUpdated={handleImagesUpdated}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  {propertyId && (
                    <Button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Finish & View Property
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#8b00ff] hover:bg-[#8b00ff]/90"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Property"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProperty;
