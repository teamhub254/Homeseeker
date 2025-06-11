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
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const propertySchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a positive number",
    }),
    bedrooms: z.string(),
    bathrooms: z.string(),
    propertyType: z.string(),
    status: z.string(),
    area: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Area must be a positive number",
    }),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "Zip code is required"),
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

const EditProperty = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [role, setRole] = useState<string | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const form = useForm<z.infer<typeof propertySchema>>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            title: "",
            description: "",
            price: "",
            bedrooms: "1",
            bathrooms: "1",
            propertyType: "house",
            status: "sale",
            area: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
        },
    });

    useEffect(() => {
        if (user) {
            fetchUserRole();
            fetchProperty();
        }
        // eslint-disable-next-line
    }, [user, id]);

    const fetchUserRole = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();
        if (!error && data) setRole(data.role);
    };

    const fetchProperty = async () => {
        if (!user || !id) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();
        if (error || !data) {
            toast({
                title: "Error",
                description: "Property not found or you do not have permission to edit it.",
                variant: "destructive",
            });
            navigate('/my-listings');
            return;
        }
        form.reset({
            title: data.title || "",
            description: data.description || "",
            price: data.price ? String(data.price) : "",
            bedrooms: data.bedrooms || "1",
            bathrooms: data.bathrooms || "1",
            propertyType: data.property_type || "house",
            status: data.status || "sale",
            area: data.area ? String(data.area) : "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            zipCode: data.zip_code || "",
        });
        setExistingImages(data.images || []);
        setLoading(false);
    };

    // If not a lister, show error or redirect
    if (role && role !== 'lister') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow text-center">
                    <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                    <p className="mb-4">You must be a property lister to edit a property.</p>
                    <Button onClick={() => navigate('/')}>Go Home</Button>
                </div>
            </div>
        );
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages((prev) => [...prev, ...newFiles].slice(0, 6)); // Limit to 6 images
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: z.infer<typeof propertySchema>) => {
        if (!user || !id) return;
        setIsSubmitting(true);
        try {
            // Upload new images if any
            let imageUrls = [...existingImages];
            if (images.length > 0) {
                for (const [index, image] of images.entries()) {
                    const filePath = `properties/${id}/${index}-${Date.now()}`;
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('property_images')
                        .upload(filePath, image);
                    if (uploadError) {
                        console.error("Error uploading image:", uploadError);
                        continue;
                    }
                    const { data: publicUrlData } = supabase.storage
                        .from('property_images')
                        .getPublicUrl(filePath);
                    if (publicUrlData) {
                        imageUrls.push(publicUrlData.publicUrl);
                    }
                }
            }
            // Update property
            const { error: updateError } = await supabase
                .from('properties')
                .update({
                    title: data.title,
                    description: data.description,
                    price: parseFloat(data.price),
                    bedrooms: data.bedrooms,
                    bathrooms: data.bathrooms,
                    property_type: data.propertyType,
                    status: data.status,
                    area: parseFloat(data.area),
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zip_code: data.zipCode,
                    images: imageUrls,
                })
                .eq('id', id);
            if (updateError) throw updateError;
            toast({
                title: "Property updated!",
                description: "Your property has been updated successfully.",
            });
            navigate("/my-listings");
        } catch (error: any) {
            console.error("Error updating property:", error);
            toast({
                title: "Error updating property",
                description: error.message || "There was a problem updating your property. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b00ff]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Home className="h-6 w-6 text-[#8b00ff]" />
                            <CardTitle className="text-2xl">Edit Property</CardTitle>
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
                                            name="status"
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
                                                            <SelectItem value="sale">For Sale</SelectItem>
                                                            <SelectItem value="rent">For Rent</SelectItem>
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
                                            name="location"
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
                                                        <Input placeholder="10001" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                {/* Images */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Property Images</h3>
                                    <div className="border-2 border-dashed border-gray-300 p-6 rounded-md">
                                        <div className="flex flex-col items-center">
                                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500 mb-4">
                                                Drag and drop images here, or click to select files
                                            </p>
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <div className="bg-[#8b00ff] text-white px-4 py-2 rounded-md hover:bg-[#8b00ff]/90 transition">
                                                    Select Images
                                                </div>
                                                <input
                                                    id="file-upload"
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        {/* Existing Images */}
                                        {existingImages.length > 0 && (
                                            <div className="mt-6">
                                                <p className="text-sm font-medium mb-2">
                                                    Existing Images:
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                    {existingImages.map((url, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={url}
                                                                alt={`Property existing ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded-md"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingImage(index)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                                aria-label="Remove image"
                                                                title="Remove image"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {/* New Images */}
                                        {images.length > 0 && (
                                            <div className="mt-6">
                                                <p className="text-sm font-medium mb-2">
                                                    {images.length} {images.length === 1 ? "image" : "images"} selected:
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                    {images.map((file, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={`Property new ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded-md"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                                aria-label="Remove image"
                                                                title="Remove image"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 mt-4">
                                            Upload up to 6 high-quality images. Recommended size: 1200x800px.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-[#8b00ff] hover:bg-[#8b00ff]/90"
                                    >
                                        {isSubmitting ? "Updating..." : "Update Property"}
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

export default EditProperty;
