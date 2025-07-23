export interface Homestay {
  id?: number;
  name: string;
  description?: string;
  location: string;
  address?: string;
  price_per_night?: number;
  rating?: number;
  total_reviews?: number;
  phone?: string;
  email?: string;
  amenities?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Eatery {
  id?: number;
  name: string;
  description?: string;
  location: string;
  address?: string;
  cuisine_type?: string;
  rating?: number;
  total_reviews?: number;
  phone?: string;
  opening_hours?: string;
  price_range?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Driver {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  location: string;
  vehicle_type?: string;
  vehicle_number?: string;
  license_number?: string;
  rating?: number;
  total_reviews?: number;
  hourly_rate?: number;
  experience_years?: number;
  languages?: string;
  is_available?: boolean;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
