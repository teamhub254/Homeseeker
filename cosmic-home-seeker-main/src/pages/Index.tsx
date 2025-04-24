
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import CategoryBrowser from "@/components/CategoryBrowser";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <CategoryBrowser />
      <Statistics />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
