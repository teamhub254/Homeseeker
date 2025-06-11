import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Mail, Upload, Building, Home } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AvatarUpload from '@/components/AvatarUpload';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  // We're removing the role property from the interface since it doesn't exist in the database yet
  // role: string | null;
}

const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [propertyCount, setPropertyCount] = useState(0);
  const [isPropertyLister, setIsPropertyLister] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPropertyCount();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          await createProfile();
          return;
        }
        throw error;
      }

      if (data) {
        form.reset({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
        });
        setAvatarUrl(data.avatar_url);
      }

      // Check if user is a property lister based on user metadata
      // This is a temporary solution until we have the role column
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.user_metadata?.is_lister) {
        setIsPropertyLister(true);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: user?.id,
          first_name: '',
          last_name: '',
          phone: '',
        });

      if (error) throw error;

      // Fetch the newly created profile
      await fetchProfile();
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    }
  };

  const fetchPropertyCount = async () => {
    try {
      if (!user) return;

      const { count, error } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (error) throw error;

      setPropertyCount(count || 0);
    } catch (error) {
      console.error("Error fetching property count:", error);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpdated = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b00ff]"></div>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    if (form.getValues('first_name') && form.getValues('last_name')) {
      return `${form.getValues('first_name')[0]}${form.getValues('last_name')[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-nest-dark mb-8">My Profile</h1>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Sidebar with stats */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
                      <AvatarUpload
                        userId={user.id}
                        currentAvatarUrl={avatarUrl || undefined}
                        onAvatarUpdated={handleAvatarUpdated}
                      />
                    </div>

                    <h2 className="text-xl font-semibold mt-2">
                      {form.getValues('first_name')} {form.getValues('last_name')}
                    </h2>
                    <p className="text-gray-500">{user?.email}</p>

                    {isPropertyLister && (
                      <div className="flex items-center mt-2 text-[#8b00ff] text-sm font-medium">
                        <Building className="h-4 w-4 mr-1" />
                        Property Lister
                      </div>
                    )}

                    <div className="w-full mt-6">
                      {isPropertyLister && (
                        <Button
                          variant="outline"
                          className="w-full mb-3 justify-start"
                          onClick={() => navigate("/my-listings")}
                        >
                          <Home className="mr-2 h-4 w-4" />
                          My Properties ({propertyCount})
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="w-full mb-3 justify-start"
                        onClick={() => navigate("/saved-properties")}
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Saved Properties
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate("/my-inquiries")}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        My Inquiries
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main profile form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} aria-label="First Name" placeholder="Enter your first name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} aria-label="Last Name" placeholder="Enter your last name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} aria-label="Phone Number" placeholder="Enter your phone number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-[#8b00ff] hover:bg-[#8b00ff]/90"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-nest-dark py-8 px-4 text-white mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Vastiqa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
