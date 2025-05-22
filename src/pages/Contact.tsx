import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll respond shortly.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 text-[#8b00ff] tracking-tight">Contact Us</h1>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Card className="h-full shadow-xl border-none">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 text-[#8b00ff]">Get In Touch</h2>

                  <div className="space-y-4 text-sm text-gray-600">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-[#8b00ff] mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p>teamhub254@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-[#8b00ff] mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <p>+254 741 677 399</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-[#8b00ff] mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Office</h3>
                        <p>
                          123 Property Lane<br />
                          Nairobi City<br />
                          Kenya
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-[#8b00ff] mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Business Hours</h3>
                        <p>
                          Mon - Fri: 9am - 5pm<br />
                          Sat: 10am - 2pm<br />
                          Sun: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="shadow-xl border-none">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-6 text-[#8b00ff]">Send Us a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="I'm interested in your services..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#8b00ff] hover:bg-[#8b00ff]/90 flex items-center gap-2 px-6 py-2 text-white rounded-md"
                      >
                        <Send className="h-4 w-4" />
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <Card className="shadow-md border-none">
              <CardContent className="p-0 overflow-hidden">
                <iframe
                  src="https://maps.google.com/maps?q=nairobi&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-80"
                  allowFullScreen
                  loading="lazy"
                  title="Google Map"
                ></iframe>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-center text-[#8b00ff] mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[{
                question: "How do I list my property on Vastiqa?",
                answer: "Register for an account, navigate to 'Add Property' and follow the step-by-step guide to list your property. It's quick and easy!"
              }, {
                question: "What are your commission rates?",
                answer: "Our commission rates vary depending on the property value and type of service. Contact our team for a personalized quote."
              }, {
                question: "How long does it take to sell a property?",
                answer: "The selling timeline varies based on market conditions, property type, location, and pricing strategy. Our average time to sell is 45 days."
              }, {
                question: "Do you handle commercial properties?",
                answer: "Yes, we handle both residential and commercial properties. Our team includes specialists in commercial real estate."
              }].map((faq, index) => (
                <Card key={index} className="shadow-sm hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">{faq.question}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

