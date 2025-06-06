import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Upload, User } from 'lucide-react';

interface AvatarUploadProps {
    userId: string;
    currentAvatarUrl?: string;
    onAvatarUpdated?: (newAvatarUrl: string) => void;
}

const AvatarUpload = ({ userId, currentAvatarUrl, onAvatarUpdated }: AvatarUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!userId) {
            toast({
                title: "Error",
                description: "User ID is required for avatar upload",
                variant: "destructive",
            });
            return;
        }

        const file = acceptedFiles[0]; // Only take the first file
        if (!file) return;

        setUploading(true);

        try {
            // Create a preview URL
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);

            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('user_id', userId);

            if (updateError) throw updateError;

            // Notify parent component
            onAvatarUpdated?.(publicUrl);

            toast({
                title: "Success",
                description: "Avatar updated successfully",
            });
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to upload avatar",
                variant: "destructive",
            });
            // Reset preview on error
            setPreviewUrl(currentAvatarUrl || null);
        } finally {
            setUploading(false);
        }
    }, [userId, currentAvatarUrl, onAvatarUpdated]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxSize: 2097152, // 2MB
        multiple: false
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`relative w-32 h-32 mx-auto rounded-full overflow-hidden cursor-pointer
                    ${isDragActive ? 'ring-2 ring-nest-primary' : 'hover:ring-2 hover:ring-nest-primary'}`}
            >
                <input {...getInputProps()} />
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Profile avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                    </div>
                )}
                {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                )}
            </div>
            <div className="text-center">
                <p className="text-sm text-nest-text-secondary">
                    {isDragActive ? (
                        "Drop your avatar here"
                    ) : (
                        "Click or drag to upload avatar"
                    )}
                </p>
                <p className="text-xs text-nest-text-secondary mt-1">
                    JPG, PNG, WEBP up to 2MB
                </p>
            </div>
        </div>
    );
};

export default AvatarUpload; 