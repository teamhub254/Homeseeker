export type UserRole = 'seeker' | 'agent';

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  is_admin: boolean;
  created_at: string;
};

export type PropertyStatus = 'available' | 'pending' | 'sold' | 'rented';

export type Property = {
  id: string;
  agent_id: string;
  title: string;
  price: number;
  description: string;
  images: string[]; // store image URLs
  amenities: string[]; // e.g., ['pool', 'wifi']
  status: PropertyStatus;
  location: string;
  bedrooms: number;
  bathrooms: number;
  created_at: string;
};

export type Booking = {
  id: string;
  seeker_id: string;
  property_id: string;
  message: string;
  created_at: string;
};

export type Favorite = {
  id: string;
  seeker_id: string;
  property_id: string;
  created_at: string;
};

export type Chat = {
  id: string;
  sender_id: string;
  receiver_id: string;
  property_id?: string;
  message: string;
  sent_at: string;
};

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export type Payment = {
  id: string;
  agent_id: string;
  amount: number;
  status: PaymentStatus;
  transaction_ref: string;
  created_at: string;
};

export type SearchFilters = {
  title?: string;
  priceRange?: [number, number];
  bedrooms?: number;
  bathrooms?: number;
  status?: 'for sale' | 'for rent';
  location?: string;
};

