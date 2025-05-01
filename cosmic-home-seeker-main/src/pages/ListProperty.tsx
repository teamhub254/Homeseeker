import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, MapPin, DollarSign, Home, Building, Bed, Bath, AreaChart } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ListProperty = () => {
  const [propertyType, setPropertyType] = useState("");
  const [images, setImages] = useState<FileList | null>(null); // State for holding selected images
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {};

    if (!title) {
      newErrors.title = "Title is required";
    }

    if (!propertyType) {
      newErrors.propertyType = "Property type is required";
    }

    if (!price || price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!description) {
      newErrors.description = "Description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create FormData to handle file upload along with other data
    const formData = new FormData();
    if (images) {
      Array.from(images).forEach((image) => {
        formData.append("images", image);
      });
    }
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("propertyType", propertyType);

    // Here you would send the formData to your backend (example using fetch)
    fetch("/api/upload-property", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Property submitted successfully! It will be reviewed by our team.");
      })
      .catch((error) => {
        toast.error("Something went wrong while submitting the property.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">List Your Property</h1>
            <p className="text-gray-400">Complete the form below to list your property on Habix</p>
          </div>
          <div className="bg-[#1E1E30] border border-gray-800 rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-gray-800 pb-2">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Modern Downtown Apartment"
                      className="bg-gray-800/50 border-gray-700 text-white"
                      required
                    />
                    {errors.title && <p className="text-red-500">{errors.title}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="room">Room</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.propertyType && <p className="text-red-500">{errors.propertyType}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                        min="0"
                        placeholder="0"
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                        required
                      />
                    </div>
                    {errors.price && <p className="text-red-500">{errors.price}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your property in detail..."
                    className="bg-gray-800/50 border-gray-700 text-white h-32"
                    required
                  />
                  {errors.description && <p className="text-red-500">{errors.description}</p>}
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-gray-800 pb-2">Images</h2>
                <div className="space-y-3">
                  <Label>Upload Property Images</Label>
                  <div className="border-2 border-dashed border-gray-700 rounded-xl p-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="text-gray-400"
                    />
                    <p className="text-sm text-gray-400 mt-2">Drag and drop or browse to select images</p>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Button type="submit" className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700">
                  Submit Property
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListProperty;