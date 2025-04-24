
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing!");
      setEmail("");
    } else {
      toast.error("Please enter your email address");
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="relative max-w-4xl mx-auto bg-[url('https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80')] bg-cover rounded-xl overflow-hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-habix-black/90 to-habix-black/70 backdrop-blur-sm"></div>
          
          {/* Content */}
          <div className="relative p-8 md:p-12 z-10">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                Subscribe to our newsletter for the latest properties and exclusive offers.
              </p>
              
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white flex-grow"
                  />
                  <Button type="submit" className="bg-habix-purple hover:bg-habix-light-purple text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  By subscribing, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
