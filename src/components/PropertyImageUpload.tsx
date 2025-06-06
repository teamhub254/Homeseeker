import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Upload, X } from 'lucide-react';

interface PropertyImageUploadProps {
    propertyId: string;
    onImagesUpdated?: (newImages: string[]) => void;
}

const PropertyImageUpload = ({ propertyId, onImagesUpdated }: PropertyImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [currentImages, setCurrentImages] = useState<string[]>([]);

    // Fetch existing images when propertyId changes
    useEffect(() => {
        if (propertyId) {
            fetchExistingImages();
        }
    }, [propertyId]);

    const fetchExistingImages = async () => {
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('images')
                .eq('id', propertyId)
                .single();

            if (error) throw error;
            if (data?.images) {
                setCurrentImages(data.images);
                onImagesUpdated?.(data.images);
            }
        } catch (error) {
            console.error('Error fetching existing images:', error);
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!propertyId) {
            toast({
                title: "Error",
                description: "Property ID is required for image upload",
                variant: "destructive",
            });
            return;
        }

        setUploading(true);
        const newImageUrls: string[] = [];

        try {
            // Upload each file
            for (const file of acceptedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
                const filePath = `${propertyId}/${fileName}`;

                // Upload to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('property_images')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (uploadError) {
                    throw uploadError;
                }

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('property_images')
                    .getPublicUrl(filePath);

                newImageUrls.push(publicUrl);
                setUploadProgress(prev => ({ ...prev, [fileName]: 100 }));
            }

            // Update property record with new image URLs
            const updatedImages = [...currentImages, ...newImageUrls];
            const { error: updateError } = await supabase
                .from('properties')
                .update({ images: updatedImages })
                .eq('id', propertyId);

            if (updateError) throw updateError;

            // Update local state and notify parent
            setCurrentImages(updatedImages);
            onImagesUpdated?.(updatedImages);

            toast({
                title: "Success",
                description: "Images uploaded successfully",
            });
        } catch (error: any) {
            console.error('Error uploading images:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to upload images",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
            setUploadProgress({});
        }
    }, [propertyId, currentImages, onImagesUpdated]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxSize: 5242880, // 5MB
        multiple: true
    });

    const removeImage = async (imageUrl: string) => {
        try {
            // Extract file path from URL
            const filePath = imageUrl.split('/').pop();
            if (!filePath) return;

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from('property_images')
                .remove([`${propertyId}/${filePath}`]);

            if (storageError) throw storageError;

            // Update property record
            const updatedImages = currentImages.filter(url => url !== imageUrl);
            const { error: updateError } = await supabase
                .from('properties')
                .update({ images: updatedImages })
                .eq('id', propertyId);

            if (updateError) throw updateError;

            // Update local state and notify parent
            setCurrentImages(updatedImages);
            onImagesUpdated?.(updatedImages);

            toast({
                title: "Success",
                description: "Image removed successfully",
            });
        } catch (error: any) {
            console.error('Error removing image:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to remove image",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-nest-primary bg-nest-primary/5' : 'border-gray-300 hover:border-nest-primary'}`}
            >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-nest-primary" />
                {isDragActive ? (
                    <p className="text-nest-primary">Drop the images here...</p>
                ) : (
                    <div>
                        <p className="text-nest-text-primary">Drag & drop images here, or click to select</p>
                        <p className="text-sm text-nest-text-secondary mt-1">
                            Supports JPG, PNG, WEBP up to 5MB
                        </p>
                    </div>
                )}
            </div>

            {uploading && (
                <div className="space-y-2">
                    {Object.entries(uploadProgress).map(([fileName, progress]) => (
                        <div key={fileName} className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-nest-primary" />
                            <div className="flex-1">
                                <div className="text-sm text-nest-text-primary">{fileName}</div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-nest-primary h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Display uploaded images */}
            {currentImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {currentImages.map((imageUrl, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img
                                src={imageUrl}
                                alt={`Property ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                                onClick={() => removeImage(imageUrl)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PropertyImageUpload; 