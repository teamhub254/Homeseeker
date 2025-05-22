import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const tapEffect = {
  whileTap: { scale: 0.97, opacity: 0.9 },
};

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-3xl font-bold text-center mb-8 text-[#8b00ff]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            About Vastiqa
          </motion.h1>

          <div className="grid gap-8">
            {["Our Story", "Our Mission", "Our Team", "Our Values"].map((section, i) => (
              <motion.div
                key={section}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
              >
                <motion.div {...tapEffect}>
                  {section === "Our Story" && (
                    <Card>
                      <CardContent className="pt-6">
                        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                        <p className="text-gray-700 mb-4">
                          Founded in 2025, Vastiqa was born from a passion for connecting people with their perfect homes. We understand that finding the right property is about more than just walls and windows—it's about finding a space where memories are made and lives unfold.
                        </p>
                        <p className="text-gray-700 mb-4">
                          At Vastiqa, we believe finding your dream home should be simple, transparent, and stress-free. We built Vastiqa to bridge that gap, creating a seamless experience for both buyers and sellers in the property market.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {section === "Our Mission" && (
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
                  )}

                  {section === "Our Team" && (
                    <Card>
                      <CardContent className="pt-6">
                        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
                        <p className="text-gray-700 mb-4">
                          Vastiqa is powered by a diverse team of real estate professionals, tech experts, and customer service specialists. We work together to ensure that every user experience is smooth, every property listing is accurate, and every question is answered promptly.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 mt-6">
                          {[{
                            name: "Fidel Ogolla",
                            role: "CEO & Founder",
                            bio: "15+ years in luxury real estate",
                          },{
                            name: "Charlly O",
                            role: "Co-Founder",
                            bio: "lead in marketing with 5+ of experience",
                          },{
                            name: "E.W Aisha",
                            role: "Software Developer",
                            bio: "Former tech lead at leading property platforms",
                          }, {
                            name: "Victor",
                            role: "Backend engineer",
                            bio: "Dedicated to exceptional customer experiences",
                          }].map((member, index) => (
                            <motion.div
                              key={index}
                              className="text-center"
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true }}
                              variants={fadeUp}
                              custom={index + 1}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="text-[#8b00ff] text-lg font-bold">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <h3 className="font-semibold">{member.name}</h3>
                              <p className="text-[#8b00ff] text-sm">{member.role}</p>
                              <p className="text-gray-600 text-sm mt-2">{member.bio}</p>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {section === "Our Values" && (
                    <Card>
                      <CardContent className="pt-6">
                        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                          {[{
                            value: "Transparency",
                            description: "We believe in honest, clear communication in all our dealings.",
                          }, {
                            value: "Excellence",
                            description: "We strive for the highest standards in our service and platform.",
                          }, {
                            value: "Innovation",
                            description: "We continuously improve our platform to provide the best user experience.",
                          }, {
                            value: "Client-Centered",
                            description: "Our users' needs and satisfaction are at the heart of everything we do.",
                          }].map((item, index) => (
                            <motion.div
                              key={index}
                              className="flex items-start"
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true }}
                              variants={fadeUp}
                              custom={index + 1}
                              whileTap={{ scale: 0.97 }}
                            >
                              <div className="mt-1 mr-4">
                                <div className="w-8 h-8 bg-[#8b00ff] rounded-full flex items-center justify-center text-white font-bold">
                                  {index + 1}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{item.value}</h3>
                                <p className="text-gray-600">{item.description}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={5}
            whileTap={{ scale: 0.96 }}
          >
            <p className="text-gray-700">
              Ready to find your perfect space? <a href="/properties" className="text-[#8b00ff] font-semibold">Browse our properties</a> or <a href="/contact" className="text-[#8b00ff] font-semibold">contact us</a> with any questions.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;


