import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/api/supabase";
import { Mail, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`, // after email confirmation
                },
            });

            if (error) {
                throw error;
            }

            console.log("User registered:", data);
            toast.success("Check your email to confirm your account!");
            navigate("/login"); // Optionally send them to login page after signup
        } catch (error) {
            console.error("Registration error:", error.message);
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Create an Account
                </h2>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </Button>
                </form>

                <div className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Button
                        onClick={() => navigate("/login")}
                        className="text-blue-600 hover:underline"
                    >
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
}