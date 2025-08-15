/**
 * Supabase Connection Test Utility
 * Tests database connectivity and basic queries
 */

import { supabase } from "@/lib/supabase";

export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...");
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error("Supabase connection error:", error);
      return { success: false, error: error.message };
    }
    
    console.log("Supabase connection successful");
    return { success: true, data };
  } catch (error: any) {
    console.error("Supabase connection failed:", error);
    return { success: false, error: error.message };
  }
};

export const testTablesExist = async () => {
  const tables = ['users', 'services', 'service_categories', 'locations', 'bookings'];
  const results: Record<string, boolean> = {};
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1);
      results[table] = !error;
      if (error) {
        console.warn(`Table ${table} not accessible:`, error.message);
      }
    } catch (error) {
      results[table] = false;
      console.warn(`Table ${table} test failed:`, error);
    }
  }
  
  return results;
};

export const initializeBasicData = async () => {
  try {
    // Check if service_categories table has data
    const { data: categories, error: catError } = await supabase
      .from('service_categories')
      .select('*')
      .limit(5);

    if (catError) {
      console.warn("Service categories query failed:", catError);
      return { needsSetup: true, error: catError.message };
    }

    if (!categories || categories.length === 0) {
      console.log("No service categories found - database needs initialization");
      return { needsSetup: true, categories: 0 };
    }

    // Check locations
    const { data: locations, error: locError } = await supabase
      .from('locations')
      .select('*')
      .limit(5);

    if (locError) {
      console.warn("Locations query failed:", locError);
    }

    return {
      needsSetup: false,
      categories: categories.length,
      locations: locations?.length || 0
    };
  } catch (error: any) {
    console.error("Database initialization check failed:", error);
    return { needsSetup: true, error: error.message };
  }
};
