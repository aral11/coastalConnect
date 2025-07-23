export interface DemoResponse {
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface Homestay {
  id: number;
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
  created_at?: string;
  updated_at?: string;
}

export interface Eatery {
  id: number;
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
  created_at?: string;
  updated_at?: string;
}

export interface Driver {
  id: number;
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
  created_at?: string;
  updated_at?: string;
}

export interface SearchParams {
  location?: string;
  maxPrice?: number;
  minRating?: number;
  cuisine?: string;
  vehicleType?: string;
  maxRate?: number;
}

export type HomestayResponse = ApiResponse<Homestay[]>;
export type EateryResponse = ApiResponse<Eatery[]>;
export type DriverResponse = ApiResponse<Driver[]>;
