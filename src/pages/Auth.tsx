import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, Mail, Lock, Eye, EyeOff, Building, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLister, setIsLister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // If user is already logged in, redirect to home
  if (user) {
    navigate('/');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      navigate(redirectTo);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      console.log('Starting signup process...', {
        email,
        firstName,
        lastName,
        isLister
      });

      // First, try to create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            is_lister: isLister
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', {
          message: authError.message,
          status: authError.status,
          name: authError.name
        });
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No user data returned from signup');
      }

      console.log('Auth signup successful, user data:', authData);

      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: null,
            avatar_url: null,
            role: isLister ? 'lister' : 'renter',
            is_admin: false
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      // Verify the profile was created with correct role
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', authData.user.id)
        .single();

      if (verifyError) {
        console.error('Profile verification error:', verifyError);
      } else {
        console.log('Profile created with role:', verifyData.role);
      }

      toast({
        title: 'Sign up successful',
        description: isLister
          ? 'Your property lister account has been created successfully!'
          : 'Your account has been created successfully!',
      });

      navigate('/');
    } catch (error: any) {
      console.error('Signup error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        status: error.status,
        name: error.name
      });
      toast({
        title: 'Sign up failed',
        description: error.message || 'There was a problem creating your account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={isLogin ? handleLogin : handleSignup}>
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="mt-1">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-nest-primary focus:border-nest-primary sm:text-sm text-gray-900"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-nest-primary focus:border-nest-primary sm:text-sm text-gray-900"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-nest-primary focus:border-nest-primary sm:text-sm text-gray-900"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-center">
                <input
                  id="is-lister"
                  name="is-lister"
                  type="checkbox"
                  checked={isLister}
                  onChange={(e) => setIsLister(e.target.checked)}
                  className="h-4 w-4 text-nest-primary focus:ring-nest-primary border-gray-300 rounded"
                />
                <Label htmlFor="is-lister" className="ml-2 block text-sm text-gray-900">
                  I want to list properties
                </Label>
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nest-primary hover:bg-nest-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nest-primary"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign in' : 'Sign up'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nest-primary"
              >
                {isLogin ? 'Create an account' : 'Sign in to your account'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
