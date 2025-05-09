
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#8b00ff]">About Vastiqa</h1>

          <div className="grid gap-8">
            {/* About Us Section */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Founded in 2025, Vastiqa was born from a passion for connecting people with their perfect homes. We understand that finding the right property is about more than just walls and windows—it's about finding a space where memories are made and lives unfold.
                </p>
                <p className="text-gray-700 mb-4">
                  At Vastiqa, we believe finding your dream home should be simple, transparent, and stress-free . We built Vastiqa to bridge that gap, creating a seamless experience for both buyers and sellers in the property market.
                </p>
              </CardContent>
            </Card>

            {/* Our Mission */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  At Vastiqa, we're on a mission to make property transactions transparent, accessible, and enjoyable for everyone. We believe that finding your dream home or investment property should be an exciting journey, not a stressful process.
                </p>
                <div className="bg-purple-50 border-l-4 border-[#8b00ff] p-4 my-6">
                  <p className="italic text-gray-700">
                    "We're not just listing properties; we're helping people find spaces where life happens."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Our Team */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
                <p className="text-gray-700 mb-4">
                  Vastiqa is powered by a diverse team of real estate professionals, tech experts, and customer service specialists. We work together to ensure that every user experience is smooth, every property listing is accurate, and every question is answered promptly.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  {[
                    {
                      name: "Sarah Johnson",
                      role: "CEO & Founder",
                      bio: "15+ years in luxury real estate",
                    },
                    {
                      name: "Michael Chen",
                      role: "CTO",
                      bio: "Former tech lead at leading property platforms",
                    },
                    {
                      name: "Priya Patel",
                      role: "Head of Customer Relations",
                      bio: "Dedicated to exceptional customer experiences",
                    }
                  ].map((member, index) => (
                    <div key={index} className="text-center">
                      <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-[#8b00ff] text-lg font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-[#8b00ff] text-sm">{member.role}</p>
                      <p className="text-gray-600 text-sm mt-2">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Our Values */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      value: "Transparency",
                      description: "We believe in honest, clear communication in all our dealings.",
                    },
                    {
                      value: "Excellence",
                      description: "We strive for the highest standards in our service and platform.",
                    },
                    {
                      value: "Innovation",
                      description: "We continuously improve our platform to provide the best user experience.",
                    },
                    {
                      value: "Client-Centered",
                      description: "Our users' needs and satisfaction are at the heart of everything we do.",
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mt-1 mr-4">
                        <div className="w-8 h-8 bg-[#8b00ff] rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{item.value}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-700">
              Ready to find your perfect space? <a href="/properties" className="text-[#8b00ff] font-semibold">Browse our properties</a> or <a href="/contact" className="text-[#8b00ff] font-semibold">contact us</a> with any questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
