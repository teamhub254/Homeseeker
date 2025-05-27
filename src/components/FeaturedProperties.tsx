
import PropertyCard from './PropertyCard';
import { properties } from '../data/properties';

const FeaturedProperties = () => {
  // In a real app, we might filter for featured properties
  // For now, we'll just use the first 3 properties
  const featuredProperties = properties.slice(0, 3);
  
  return (
   <section className="py-12 px-4">
  <div className="container mx-auto">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
        Featured Properties
      </h2>
      <p className="text-neutral-300 mt-2 max-w-2xl mx-auto">
        Discover our handpicked selection of premium properties that might be your next dream home
      </p>
    </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              address={`${property.address}, ${property.city}, ${property.state}`}
              price={property.price}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              type={property.type}
              imageUrl={property.imageUrl}
              forSale={property.forSale}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button className="text-nest-primary hover:text-nest-primary/80 font-medium">
            View All Properties →
          </button>
        </div>
      </div>
    </section>
  );
};
export default FeaturedProperties;
