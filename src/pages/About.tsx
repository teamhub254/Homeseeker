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
    <div className="min-h-screen bg-[#110e1c] text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-3xl font-bold text-center mb-8 text-purple-400"
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
                  <Card className="bg-[#1a1626] border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="pt-6">
                      {section === "Our Story" && (
                        <>
                          <h2 className="text-2xl font-semibold mb-4 text-white">Our Story</h2>
                          <p className="text-gray-300 mb-4">
                            Founded in 2025, Vastiqa was born from a passion for connecting people with their perfect homes...
                          </p>
                          <p className="text-gray-300 mb-4">
                            At Vastiqa, we believe finding your dream home should be simple, transparent, and stress-free...
                          </p>
                        </>
                      )}

                      {section === "Our Mission" && (
                        <>
                          <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
                          <p className="text-gray-300 mb-4">
                            At Vastiqa, we're on a mission to make property transactions transparent, accessible, and enjoyable...
                          </p>
                          <div className="bg-[#241d33] border-l-4 border-purple-500 p-4 my-6">
                            <p className="italic text-gray-300">
                              "We're not just listing properties; we're helping people find spaces where life happens."
                            </p>
                          </div>
                        </>
                      )}

                      {section === "Our Team" && (
                        <>
                          <h2 className="text-2xl font-semibold mb-4 text-white">Our Team</h2>
                          <p className="text-gray-300 mb-4">
                            Vastiqa is powered by a diverse team of real estate professionals, tech experts...
                          </p>
                          <div className="grid md:grid-cols-3 gap-6 mt-6">
                            {[
                              {
                                name: "Fidel Ogolla",
                                role: "Founder",
                                bio: "Dedicated top-notch tech and real estate enthusiast",
                              },
                              {
                                name: "Charlly Mush",
                                role: "Founding Marketing lead",
                                bio: "Lead in marketing with 3+ years of experience",
                              },
                              {
                                name: "E.W Aisha",
                                role: "Software Developer",
                                bio: "Former tech lead at leading property platforms",
                              },
                              {
                                name: "Romano Victor Juma",
                                role: "Software Developer",
                                bio: "Dedicated to exceptional customer experiences",
                              },
                            ].map((member, index) => (
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
                                <div className="w-24 h-24 bg-[#2a233c] rounded-full mx-auto mb-4 flex items-center justify-center">
                                  <span className="text-purple-400 text-lg font-bold">
                                    {member.name.split(" ").map((n) => n[0]).join("")}
                                  </span>
                                </div>
                                <h3 className="font-semibold text-white">{member.name}</h3>
                                <p className="text-purple-400 text-sm">{member.role}</p>
                                <p className="text-gray-400 text-sm mt-2">{member.bio}</p>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      )}

                      {section === "Our Values" && (
                        <>
                          <h2 className="text-2xl font-semibold mb-4 text-white">Our Values</h2>
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
                              },
                            ].map((item, index) => (
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
                                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg text-white">{item.value}</h3>
                                  <p className="text-gray-400">{item.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
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
            <p className="text-gray-300">
              Ready to find your perfect space?{" "}
              <a href="/properties" className="text-purple-400 font-semibold hover:underline">
                Browse our properties
              </a>{" "}
              or{" "}
              <a href="/contact" className="text-purple-400 font-semibold hover:underline">
                contact us
              </a>{" "}
              with any questions.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
