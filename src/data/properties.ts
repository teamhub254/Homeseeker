
export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  forSale: boolean;
  features: string[];
  imageUrl: string;
  images: string[];
  yearBuilt: number;
  createdAt: string;
  owner: {
    name: string;
    phone: string;
    email: string;
  };
}

export const properties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    description: 'Luxurious apartment in the heart of downtown with stunning city views. This newly renovated unit features hardwood floors, stainless steel appliances, and an open floor plan perfect for entertaining. Building amenities include a fitness center, rooftop pool, and 24-hour concierge service.',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    price: 750000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: 'Apartment',
    forSale: true,
    features: ['Hardwood Floors', 'Stainless Steel Appliances', 'Central AC', 'In-unit Laundry', 'Balcony', 'Garage Parking'],
    imageUrl: 'https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&q=80&w=800&h=500',
    images: [
      'https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&q=80&w=800&h=500'
    ],
    yearBuilt: 2015,
    createdAt: '2024-04-15',
    owner: {
      name: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john@example.com'
    }
  },
  {
    id: '2',
    title: 'Charming Suburban Home',
    description: 'Beautiful family home in a quiet suburban neighborhood. This 4-bedroom house offers plenty of space with a large backyard, updated kitchen, and finished basement. Perfect for families looking for good schools and a friendly community.',
    address: '456 Oak Ave',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60007',
    price: 520000,
    bedrooms: 4,
    bathrooms: 3.5,
    area: 2800,
    type: 'House',
    forSale: true,
    features: ['Updated Kitchen', 'Finished Basement', 'Large Backyard', 'Attached Garage', 'Fireplace', 'Deck'],
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800&h=500',
    images: [
      'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800&h=500'
    ],
    yearBuilt: 1995,
    createdAt: '2024-04-12',
    owner: {
      name: 'Sarah Johnson',
      phone: '(555) 987-6543',
      email: 'sarah@example.com'
    }
  },
  {
    id: '3',
    title: 'Luxury Waterfront Condo',
    description: 'Exclusive waterfront condo with panoramic ocean views. This high-end unit features premium finishes, a gourmet kitchen, and floor-to-ceiling windows. Residents enjoy access to a private beach, infinity pool, and full-service spa.',
    address: '789 Bayshore Blvd',
    city: 'Miami',
    state: 'FL',
    zipCode: '33131',
    price: 1250000,
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    type: 'Condo',
    forSale: true,
    features: ['Ocean View', 'Private Beach Access', 'Marble Countertops', 'Smart Home System', 'Wine Cellar', '24/7 Security'],
    imageUrl: 'https://images.unsplash.com/photo-1607684282763-a32e29d5431c?auto=format&fit=crop&q=80&w=800&h=500',
    images: [
      'https://images.unsplash.com/photo-1607684282763-a32e29d5431c?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&q=80&w=800&h=500'
    ],
    yearBuilt: 2020,
    createdAt: '2024-04-10',
    owner: {
      name: 'Michael Rodriguez',
      phone: '(555) 789-0123',
      email: 'michael@example.com'
    }
  },
  {
    id: '4',
    title: 'Cozy Studio for Rent',
    description: 'Compact and efficient studio apartment in a central location. Perfect for students or young professionals. Comes fully furnished with utilities included in the monthly rent. Located near public transportation, restaurants, and shopping.',
    address: '321 Pine St',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    price: 1200,
    bedrooms: 0,
    bathrooms: 1,
    area: 500,
    type: 'Studio',
    forSale: false,
    features: ['Furnished', 'Utilities Included', 'Pet Friendly', 'On-site Laundry', 'Elevator', 'Bike Storage'],
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800&h=500',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800&h=500'
    ],
    yearBuilt: 2010,
    createdAt: '2024-04-14',
    owner: {
      name: 'Lisa Wong',
      phone: '(555) 456-7890',
      email: 'lisa@example.com'
    }
  },
  {
    id: '5',
    title: 'Modern Townhouse with Garage',
    description: 'Contemporary townhouse in a gated community with modern design and high ceilings. Features an attached garage, private patio, and energy-efficient appliances. Conveniently located near schools, parks, and shopping centers.',
    address: '555 Cedar Ln',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    price: 475000,
    bedrooms: 3,
    bathrooms: 2.5,
    area: 1800,
    type: 'Townhouse',
    forSale: true,
    features: ['Gated Community', 'High Ceilings', 'Energy Efficient', 'Private Patio', 'Attached Garage', 'Guest Parking'],
    imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=800&h=500',
    images: [
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?auto=format&fit=crop&q=80&w=800&h=500'
    ],
    yearBuilt: 2018,
    createdAt: '2024-04-08',
    owner: {
      name: 'David Thompson',
      phone: '(555) 234-5678',
      email: 'david@example.com'
    }
  },
  {
    id: '6',
    title: 'Spacious Family Apartment',
    description: 'Large family apartment available for rent in a quiet residential area. This well-maintained unit features 3 bedrooms, a renovated kitchen, and a spacious living room. Monthly rent includes water and parking. Small pets allowed with deposit.',
    address: '987 Maple Rd',
    city: 'Boston',
    state: 'MA',
    zipCode: '02108',
    price: 2800,
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    type: 'Apartment',
    forSale: false,
    features: ['Pet Friendly', 'Renovated Kitchen', 'Storage Unit', 'Parking Included', 'Dishwasher', 'Walk-in Closets'],
    imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80&w=800&h=500',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=800&h=500',
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&q=80&w=800&h=500'
    ],
    yearBuilt: 2005,
    createdAt: '2024-04-05',
    owner: {
      name: 'Jennifer Garcia',
      phone: '(555) 345-6789',
      email: 'jennifer@example.com'
    }
  }
];
