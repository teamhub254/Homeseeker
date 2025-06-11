import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  property_type: string;
  status: string;
  image_url: string;
  created_at: string;
  images?: string[];
}

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      // Transform the data to include full image URLs
      const transformedData = data?.map(property => {
        let imageUrl = '/placeholder-property.jpg';

        if (property.image_url) {
          // If the image_url is already a full URL, use it
          if (property.image_url.startsWith('http')) {
            imageUrl = property.image_url;
          } else {
            // Otherwise, construct the full URL for Supabase storage
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const imagePath = property.image_url.startsWith('/') ? property.image_url.slice(1) : property.image_url;
            imageUrl = `${supabaseUrl}/storage/v1/object/public/property-images/${imagePath}`;
          }
        }

        return {
          ...property,
          image_url: imageUrl
        };
      }) || [];

      console.log('Transformed properties:', transformedData); // Debug log
      setProperties(transformedData);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

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

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nest-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading properties...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                address={`${property.address}, ${property.city}, ${property.state}`}
                price={property.price}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                type={property.property_type}
                imageUrl={property.image_url}
                forSale={property.status === 'available'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No featured properties available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <a href="/properties" className="text-nest-primary hover:text-nest-primary/80 font-medium">
            View All Properties →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
