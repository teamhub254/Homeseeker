import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/api/supabase";// this is for the database
import { Mail, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      console.error("Login failed:", error.message);
      toast.error(error.message || "Login failed.");
    } else {
      toast.success("Logged in successfully!");
      navigate("/Explore"); // hapa tunafaa tujue vile the landlord and tenant are not on the same page after loging in 
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#1E1E30] p-8 rounded-xl shadow-lg border border-gray-800">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-habix-purple text-white hover:bg-habix-purple/80"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-4">
            Forgot your password?{" "}
            <Link to="/forgot-password" className="text-habix-purple hover:underline">
              Reset here
            </Link>
          </p>

          <p className="text-center text-gray-400 text-sm mt-2">
            Don’t have an account?{" "}
            <Link to="/register" className="text-habix-purple hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;

