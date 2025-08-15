/**
 * Supabase Client Configuration
 * This handles all Supabase connections for the frontend
 */

import { createClient } from "@supabase/supabase-js";

// Supabase configuration - these should be set in environment variables
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database table types
export interface SupabaseUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "admin" | "vendor" | "customer" | "event_organizer";
  avatar_url?: string;
  is_verified: boolean;
  vendor_status?: "pending" | "approved" | "rejected";
  business_name?: string;
  business_type?: "homestay" | "restaurant" | "driver" | "event_services";
  created_at: string;
  updated_at: string;
}

export interface SupabaseService {
  id: string;
  vendor_id: string;
  category_id?: string;
  service_type: "homestay" | "restaurant" | "driver" | "event_services";
  name: string;
  description?: string;
  short_description?: string;
  address?: string;
  location_id?: string;
  latitude?: number;
  longitude?: number;
  base_price: number;
  price_per_unit?: number;
  currency: string;
  service_details?: any;
  primary_image_id?: string;
  gallery_images?: string[];
  status: "pending" | "approved" | "rejected" | "suspended";
  is_active: boolean;
  is_featured: boolean;
  average_rating: number;
  total_reviews: number;
  slug?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  service_count?: number;
  created_at: string;
}

export interface SupabaseLocation {
  id: string;
  name: string;
  type: "city" | "area" | "landmark";
  parent_id?: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  is_popular: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SupabaseBooking {
  id: string;
  booking_reference: string;
  customer_id: string;
  vendor_id: string;
  service_id: string;
  service_type: string;
  check_in_date?: string;
  check_out_date?: string;
  guests: number;
  units: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  total_amount: number;
  currency: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  created_at: string;
  updated_at: string;
}

export interface SupabaseReview {
  id: string;
  service_id?: string;
  user_id: string;
  reviewer_name: string;
  rating: number;
  title?: string;
  comment?: string;
  status: "pending" | "approved" | "rejected";
  is_verified: boolean;
  created_at: string;
}

// Auth helper functions
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If there's an auth session missing error, just return null (user not authenticated)
    if (error && error.message.includes("Auth session missing")) {
      return null;
    }

    if (error) throw error;
    return user;
  } catch (error: any) {
    // Handle auth session missing gracefully
    if (error.message && error.message.includes("Auth session missing")) {
      return null;
    }
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (
  email: string,
  password: string,
  metadata?: any,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};

// Data fetching functions
export const getServices = async (filters?: {
  type?: string;
  location_id?: string;
  status?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) => {
  try {
    let query = supabase.from("services").select(`
        *,
        locations(name, type),
        service_categories(name, slug, color),
        reviews(rating)
      `);

    if (filters?.type) {
      query = query.eq("service_type", filters.type);
    }

    if (filters?.location_id) {
      query = query.eq("location_id", filters.location_id);
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.featured) {
      query = query.eq("is_featured", true);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 20) - 1,
      );
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.warn("Error fetching services:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Services fetch error:", error);
    return [];
  }
};

export const getServiceCategories = async () => {
  try {
    // Try to get categories with service counts
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.warn("Error fetching service categories:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn("No service categories found in database");
      return [];
    }

    // Manually count services for each category
    const categoriesWithCount = await Promise.all(
      data.map(async (category) => {
        try {
          const { count } = await supabase
            .from("services")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id)
            .eq("status", "approved")
            .eq("is_active", true);

          return {
            ...category,
            service_count: count || 0,
          };
        } catch (error) {
          console.warn(`Error counting services for category ${category.name}:`, error);
          return {
            ...category,
            service_count: 0,
          };
        }
      }),
    );

    return categoriesWithCount;
  } catch (error) {
    console.error("Error fetching service categories:", error);
    return [];
  }
};

export const getLocations = async (popularOnly = false) => {
  try {
    let query = supabase.from("locations").select("*").eq("is_active", true);

    if (popularOnly) {
      query = query.eq("is_popular", true);
    }

    const { data, error } = await query.order("display_order", {
      ascending: true,
    });

    if (error) {
      console.warn("Error fetching locations:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Locations fetch error:", error);
    return [];
  }
};

export const searchServices = async (
  searchQuery: string,
  filters?: {
    type?: string;
    location_id?: string;
    min_price?: number;
    max_price?: number;
    min_rating?: number;
  },
) => {
  let query = supabase
    .from("services")
    .select(
      `
      *,
      locations(name, type),
      service_categories(name, slug, color),
      reviews(rating)
    `,
    )
    .eq("status", "approved")
    .eq("is_active", true);

  // Full-text search on name and description
  if (searchQuery) {
    query = query.or(
      `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
    );
  }

  if (filters?.type) {
    query = query.eq("service_type", filters.type);
  }

  if (filters?.location_id) {
    query = query.eq("location_id", filters.location_id);
  }

  if (filters?.min_price) {
    query = query.gte("base_price", filters.min_price);
  }

  if (filters?.max_price) {
    query = query.lte("base_price", filters.max_price);
  }

  if (filters?.min_rating) {
    query = query.gte("average_rating", filters.min_rating);
  }

  const { data, error } = await query.order("average_rating", {
    ascending: false,
  });

  if (error) throw error;
  return data;
};

export const getServiceById = async (id: string) => {
  const { data, error } = await supabase
    .from("services")
    .select(
      `
      *,
      locations(name, type, latitude, longitude),
      service_categories(name, slug, color),
      users!vendor_id(name, email, business_name),
      reviews(
        id,
        user_id,
        reviewer_name,
        rating,
        title,
        comment,
        created_at,
        users!user_id(name, avatar_url)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// Analytics tracking
export const trackEvent = async (eventType: string, properties?: any) => {
  try {
    const user = await getCurrentUser();

    const { error } = await supabase.from("analytics_events").insert({
      event_type: eventType,
      user_id: user?.id,
      session_id: crypto.randomUUID(),
      properties,
      page_url: window.location.href,
      page_title: document.title,
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString(),
    });

    if (error) console.warn("Analytics tracking failed:", error);
  } catch (error: any) {
    // Silently fail analytics tracking if there are auth issues
    console.warn("Analytics tracking failed:", error.message);
  }
};

// Events functions
export const getEvents = async (filters?: {
  category?: string;
  location_id?: string;
  status?: string;
  featured?: boolean;
  upcoming?: boolean;
  limit?: number;
  offset?: number;
}) => {
  let query = supabase
    .from("events")
    .select(`
      *,
      locations(name, type),
      users!organizer_id(name, email)
    `);

  if (filters?.status) {
    query = query.eq("status", filters.status);
  } else {
    query = query.in("status", ["published", "approved"]);
  }

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.location_id) {
    query = query.eq("location_id", filters.location_id);
  }

  if (filters?.featured) {
    query = query.eq("is_featured", true);
  }

  if (filters?.upcoming) {
    query = query.gte("event_date", new Date().toISOString().split('T')[0]);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 20) - 1
    );
  }

  query = query.order("event_date", { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getEventById = async (id: string) => {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      locations(name, type, latitude, longitude),
      users!organizer_id(name, email, phone)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// Festivals functions
export const getFestivals = async (filters?: {
  category?: string;
  month?: number;
  major_only?: boolean;
  limit?: number;
}) => {
  let query = supabase
    .from("festivals")
    .select(`
      *,
      locations(name, type)
    `)
    .eq("is_active", true);

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.month) {
    query = query.eq("festival_month", filters.month);
  }

  if (filters?.major_only) {
    query = query.eq("is_major_festival", true);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  query = query.order("festival_month", { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Visit Guide functions
export const getVisitGuideContent = async (section?: string) => {
  let query = supabase
    .from("visit_guide_content")
    .select("*")
    .eq("is_active", true);

  if (section) {
    query = query.eq("section", section);
  }

  query = query.order("display_order", { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Cultural Attractions functions
export const getCulturalAttractions = async (filters?: {
  category?: string;
  featured?: boolean;
  location_id?: string;
  limit?: number;
}) => {
  let query = supabase
    .from("cultural_attractions")
    .select(`
      *,
      locations(name, type)
    `)
    .eq("is_active", true);

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.featured) {
    query = query.eq("is_featured", true);
  }

  if (filters?.location_id) {
    query = query.eq("location_id", filters.location_id);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  query = query.order("tourist_priority", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Real-time subscriptions
export const subscribeToServices = (callback: (payload: any) => void) => {
  return supabase
    .channel("services")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "services" },
      callback,
    )
    .subscribe();
};

export const subscribeToBookings = (
  userId: string,
  callback: (payload: any) => void,
) => {
  return supabase
    .channel("bookings")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookings",
        filter: `customer_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe();
};

export const subscribeToEvents = (callback: (payload: any) => void) => {
  return supabase
    .channel("events")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "events" },
      callback,
    )
    .subscribe();
};

export default supabase;
