
import { ArrowRight } from "lucide-react";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FeaturedProperties = () => {
  const properties = [
    {
      id: "prop-1",
      title: "Luxury Penthouse Suite",
      price: "$2,850/mo",
      address: "123 Downtown Ave, San Francisco, CA",
      type: "Apartment" as const,
      beds: 3,
      baths: 2,
      area: 1800,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
      tags: ["Penthouse", "City View", "Parking"],
      forRent: true,
      featured: true
    },
    {
      id: "prop-2",
      title: "Modern Urban Loft",
      price: "$1,950/mo",
      address: "456 Tech Blvd, San Jose, CA",
      type: "Apartment" as const,
      beds: 2,
      baths: 2,
      area: 1200,
      image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80",
      tags: ["Loft", "Modern", "Security"],
      forRent: true,
      featured: true
    },
    {
      id: "prop-3",
      title: "Oceanfront Villa",
      price: "$3,250,000",
      address: "789 Ocean View, Malibu, CA",
      type: "House" as const,
      beds: 5,
      baths: 4,
      area: 4200,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
      tags: ["Beachfront", "Pool", "Luxury"],
      forSale: true,
      featured: true
    },
    {
      id: "prop-4",
      title: "Downtown Studio",
      price: "$1,400/mo",
      address: "101 Arts District, Los Angeles, CA",
      type: "Room" as const,
      beds: 1,
      baths: 1,
      area: 550,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
      tags: ["Studio", "City Center", "Furnished"],
      forRent: true,
      featured: true
    }
  ];

  // Generate additional properties to fill the 4x5 grid (20 total)
  const moreProperties = Array.from({ length: 16 }).map((_, index) => ({
    id: `prop-${index + 5}`,
    title: "Contemporary Living Space",
    price: `$${(1800 + (index * 100)).toLocaleString()}/mo`,
    address: `${index + 100} Metro District, San Francisco, CA`,
    type: "Apartment" as const,
    beds: 2,
    baths: 2,
    area: 1100,
    image: `https://images.unsplash.com/photo-${[
      "1600596542815-ffad4c1539a9",
      "1600585153490-76fb20a32601",
      "1600607687939-ce8a6c25118c",
      "1600566752355-35792b24d29f",
      "1600573472550-8d929948e72c",
      "1591474200742-8e9bf6b0c83f",
      "1600047509807-ba8f99d2cdde",
      "1600585152915-d208bec867a1",
      "1616137466211-f939a420be84",
      "1613545325278-f24b0cae1224",
      "1613490493141-e8160eb81b79",
      "1614622267890-bf0443be7f80",
      "1615529328331-f8917597711f",
      "1615873968023-06ac0ff593b2",
      "1616046387746-47d20aa96ed4",
      "1616486338812-3dadae4b4ace"
    ][index]}?auto=format&fit=crop&q=80`,
    tags: ["Modern", "Security", "Parking"],
    forRent: true,
    featured: true
  }));

  const allProperties = [...properties, ...moreProperties];

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
          <p className="text-gray-400">Discover our handpicked properties for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/explore">
            <Button className="bg-habix-purple hover:bg-habix-light-purple text-white">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
