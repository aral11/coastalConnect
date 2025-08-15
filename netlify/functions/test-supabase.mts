import type { Context, Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

export default async (req: Request, context: Context) => {
  try {
    // Get environment variables
    const supabaseUrl =
      Netlify.env.get("VITE_SUPABASE_URL") || Netlify.env.get("SUPABASE_URL");
    const supabaseKey =
      Netlify.env.get("VITE_SUPABASE_ANON_KEY") ||
      Netlify.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({
          error: "Missing Supabase credentials",
          url: !!supabaseUrl,
          key: !!supabaseKey,
          env: {
            VITE_SUPABASE_URL: !!Netlify.env.get("VITE_SUPABASE_URL"),
            SUPABASE_URL: !!Netlify.env.get("SUPABASE_URL"),
            VITE_SUPABASE_ANON_KEY: !!Netlify.env.get("VITE_SUPABASE_ANON_KEY"),
            SUPABASE_ANON_KEY: !!Netlify.env.get("SUPABASE_ANON_KEY"),
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test basic queries
    const results = {
      timestamp: new Date().toISOString(),
      supabaseUrl: supabaseUrl,
      hasKey: !!supabaseKey,
    };

    try {
      // Test service categories (no RLS)
      const { data: categories, error: catError } = await supabase
        .from("service_categories")
        .select("*")
        .limit(5);

      results.categories = {
        success: !catError,
        count: categories?.length || 0,
        error: catError?.message,
      };
    } catch (err) {
      results.categories = { success: false, error: err.message };
    }

    try {
      // Test services (with RLS)
      const { data: services, error: servError } = await supabase
        .from("services")
        .select("*")
        .eq("status", "approved")
        .limit(3);

      results.services = {
        success: !servError,
        count: services?.length || 0,
        error: servError?.message,
      };
    } catch (err) {
      results.services = { success: false, error: err.message };
    }

    try {
      // Test locations (no RLS)
      const { data: locations, error: locError } = await supabase
        .from("locations")
        .select("*")
        .limit(3);

      results.locations = {
        success: !locError,
        count: locations?.length || 0,
        error: locError?.message,
      };
    } catch (err) {
      results.locations = { success: false, error: err.message };
    }

    return new Response(JSON.stringify(results, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Function error",
        message: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

export const config: Config = {
  path: "/api/test-supabase",
};
