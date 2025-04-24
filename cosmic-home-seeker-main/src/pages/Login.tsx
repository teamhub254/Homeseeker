
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Lock, Mail, MapPin, Upload } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userType, setUserType] = useState("buyer");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [purpose, setPurpose] = useState("rent");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isLogin && (!firstName || !lastName || !country || !city || !agreeToTerms)) {
      toast.error("Please fill in all required fields and accept the terms");
      return;
    }

    if (isLogin) {
      toast.success("Successfully logged in!");
    } else {
      toast.success("Account created successfully!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1E1E30] border border-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p className="text-gray-400 mt-2">
              {isLogin ? "Sign in to access your account and saved properties" : "Join us to explore properties and more"}
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button 
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-lg ${isLogin ? 'bg-habix-purple text-white' : 'text-gray-400'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-lg ${!isLogin ? 'bg-habix-purple text-white' : 'text-gray-400'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                {isLogin && (
                  <Link to="/forgot-password" className="text-sm text-habix-purple hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
              {!isLogin && (
                <p className="text-sm text-gray-400">Password must be at least 8 characters long</p>
              )}
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label className="text-gray-300">Your Location</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Select value={city} onValueChange={setCity}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                          <SelectValue placeholder="Select a country first" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ny">New York</SelectItem>
                          <SelectItem value="la">Los Angeles</SelectItem>
                          <SelectItem value="ch">Chicago</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Select your country and city from the dropdown lists</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">I am registering as a</Label>
                  <RadioGroup value={userType} onValueChange={setUserType} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buyer" id="buyer" />
                      <Label htmlFor="buyer" className="text-gray-300">Buyer / House-hunter / Renter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="landlord" id="landlord" />
                      <Label htmlFor="landlord" className="text-gray-300">Landlord / Property Owner</Label>
                    </div>
                  </RadioGroup>
                </div>

                {userType === "landlord" && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Profile Picture (Required)</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Photo
                      </Button>
                    </div>
                    <p className="text-sm text-gray-400">A profile picture helps build trust with potential renters/buyers</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-gray-300">I want to</Label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                      <SelectValue placeholder="Select your purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Find a place to rent</SelectItem>
                      <SelectItem value="buy">Buy a property</SelectItem>
                      <SelectItem value="sell">List my property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-300">
                    I agree to the{" "}
                    <Link to="/terms" className="text-habix-purple hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-habix-purple hover:underline">Privacy Policy</Link>
                  </Label>
                </div>
              </>
            )}

            <Button 
              type="submit"
              className="w-full bg-habix-purple hover:bg-habix-light-purple text-white"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {!isLogin && (
            <p className="mt-4 text-sm text-gray-400 text-center">
              By signing in or creating an account, you agree to our{" "}
              <Link to="/terms" className="text-habix-purple hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-habix-purple hover:underline">Privacy Policy</Link>.
            </p>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
