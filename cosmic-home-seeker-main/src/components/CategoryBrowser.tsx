
import { Home, Building2, Bed, Key } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryBrowser = () => {
  const categories = [
    {
      id: "houses",
      title: "Houses",
      description: "Find standalone houses with yards and privacy",
      icon: <Home className="h-8 w-8" />,
      listings: 534,
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80",
      link: "/category/houses"
    },
    {
      id: "apartments",
      title: "Apartments",
      description: "Explore modern apartments in prime locations",
      icon: <Building2 className="h-8 w-8" />,
      listings: 712,
      image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80",
      link: "/category/apartments"
    },
    {
      id: "rooms",
      title: "Rooms",
      description: "Budget-friendly rooms in shared accommodations",
      icon: <Bed className="h-8 w-8" />,
      listings: 267,
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=80",
      link: "/category/rooms"
    },
    {
      id: "rentals",
      title: "Rentals",
      description: "Temporary stays with flexible terms",
      icon: <Key className="h-8 w-8" />,
      listings: 1245,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
      link: "/category/rentals"
    }
  ];

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-gray-400">Find the perfect property type for your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link to={category.link} key={category.id} className="group">
              <div className="relative rounded-xl overflow-hidden h-[300px]">
                {/* Image and overlay */}
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
                
                {/* Information content */}
                <div className="absolute inset-0 flex flex-col p-6">
                  <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <div className="bg-habix-purple/20 p-4 rounded-full mb-4 backdrop-blur-sm group-hover:bg-habix-purple/40 transition-all">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                    <p className="text-gray-300 mb-4">{category.description}</p>
                  </div>
                  
                  {/* Bottom indicator */}
                  <div className="bg-gray-800/80 px-3 py-1 rounded-lg self-center">
                    <span className="text-sm text-gray-300">{category.listings} listings</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBrowser;
