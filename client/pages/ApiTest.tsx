/**
 * Debug Page to Test Supabase Connection and Data
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase, getServiceCategories, getLocations, getServices } from "@/lib/supabase";
import Layout from "@/components/Layout";

export default function ApiTest() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResults({});

    try {
      console.log("Testing Supabase connection...");
      
      // Test basic connection
      const { data: health, error: healthError } = await supabase
        .from('service_categories')
        .select('*', { count: 'exact', head: true });

      setResults(prev => ({
        ...prev,
        health: healthError ? `Error: ${healthError.message}` : 'Connected successfully'
      }));

      // Test service categories
      try {
        const categories = await getServiceCategories();
        setResults(prev => ({
          ...prev,
          categories: {
            count: categories.length,
            data: categories.slice(0, 3) // Show first 3 for debugging
          }
        }));
      } catch (error: any) {
        setResults(prev => ({
          ...prev,
          categories: `Error: ${error.message}`
        }));
      }

      // Test locations
      try {
        const locations = await getLocations(true);
        setResults(prev => ({
          ...prev,
          locations: {
            count: locations.length,
            data: locations.slice(0, 3)
          }
        }));
      } catch (error: any) {
        setResults(prev => ({
          ...prev,
          locations: `Error: ${error.message}`
        }));
      }

      // Test services
      try {
        const services = await getServices({ status: "approved", limit: 5 });
        setResults(prev => ({
          ...prev,
          services: {
            count: services.length,
            data: services.slice(0, 2)
          }
        }));
      } catch (error: any) {
        setResults(prev => ({
          ...prev,
          services: `Error: ${error.message}`
        }));
      }

      // Test direct database query
      try {
        const { data: directQuery, error: directError } = await supabase
          .from('service_categories')
          .select('*')
          .limit(3);

        setResults(prev => ({
          ...prev,
          directQuery: directError ? `Error: ${directError.message}` : {
            count: directQuery?.length || 0,
            data: directQuery
          }
        }));
      } catch (error: any) {
        setResults(prev => ({
          ...prev,
          directQuery: `Error: ${error.message}`
        }));
      }

      // Test environment variables
      setResults(prev => ({
        ...prev,
        environment: {
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'Not set',
          VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'
        }
      }));

    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        error: error.message
      }));
    }

    setLoading(false);
  };

  const initializeDatabase = async () => {
    try {
      console.log("Attempting to initialize database with sample data...");
      
      // Try to insert a sample service category if none exist
      const { data: existingCategories } = await supabase
        .from('service_categories')
        .select('*')
        .limit(1);

      if (!existingCategories || existingCategories.length === 0) {
        const { data, error } = await supabase
          .from('service_categories')
          .insert([
            {
              name: 'Hotels & Homestays',
              slug: 'hotels-homestays',
              icon: 'hotel',
              color: '#E91E63',
              description: 'Accommodation services',
              display_order: 1,
              is_active: true
            }
          ])
          .select();

        if (error) {
          console.error("Failed to insert sample category:", error);
          setResults(prev => ({
            ...prev,
            initialization: `Error: ${error.message}`
          }));
        } else {
          console.log("Sample category inserted:", data);
          setResults(prev => ({
            ...prev,
            initialization: 'Sample data inserted successfully'
          }));
        }
      } else {
        setResults(prev => ({
          ...prev,
          initialization: 'Data already exists'
        }));
      }
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        initialization: `Error: ${error.message}`
      }));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Supabase API Debug Test</h1>
        
        <div className="space-y-4 mb-8">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? 'Testing...' : 'Test Connection & Data'}
          </Button>
          
          <Button onClick={initializeDatabase} variant="outline">
            Initialize Sample Data
          </Button>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Results:</h2>
            <pre className="text-sm overflow-auto whitespace-pre-wrap">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Layout>
  );
}
