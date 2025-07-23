import { RequestHandler } from "express";
import { getConnection } from "../db/connection";
import { Homestay } from "../models";

// Fallback data when database is not accessible
const mockHomestays: Homestay[] = [
  {
    id: 1,
    name: "Coastal Heritage Homestay",
    description: "Experience traditional Udupi hospitality in our heritage home with authentic coastal Karnataka cuisine and modern amenities.",
    location: "Malpe Beach Road, Udupi",
    address: "Near Malpe Beach, Udupi, Karnataka 576103",
    price_per_night: 2500,
    rating: 4.8,
    total_reviews: 124,
    phone: "+91 98456 78901",
    email: "stay@coastalheritage.com",
    amenities: "AC Rooms, Free WiFi, Traditional Breakfast, Beach Access, Parking, Kitchen Access",
    image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
    latitude: 13.3494,
    longitude: 74.7421,
    is_active: true
  },
  {
    id: 2,
    name: "Krishna Temple View Homestay",
    description: "Stay near the famous Krishna Temple with temple views and authentic Udupi vegetarian meals.",
    location: "Car Street, Udupi",
    address: "Car Street, Near Krishna Temple, Udupi, Karnataka 576101",
    price_per_night: 1800,
    rating: 4.6,
    total_reviews: 89,
    phone: "+91 94488 12345",
    email: "info@krishnaview.com",
    amenities: "Temple View, Vegetarian Meals, AC, Free WiFi, Cultural Tours, Parking",
    image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    latitude: 13.3409,
    longitude: 74.7421,
    is_active: true
  },
  {
    id: 3,
    name: "Backwater Bliss Homestay",
    description: "Peaceful homestay surrounded by backwaters and coconut groves, perfect for nature lovers.",
    location: "Brahmavar, Udupi",
    address: "Brahmavar Backwaters, Udupi District, Karnataka 576213",
    price_per_night: 2200,
    rating: 4.7,
    total_reviews: 67,
    phone: "+91 95916 54321",
    email: "contact@backwaterbliss.in",
    amenities: "Backwater View, Kayaking, Traditional Food, AC, WiFi, Nature Walks",
    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    latitude: 13.3625,
    longitude: 74.7678,
    is_active: true
  },
  {
    id: 4,
    name: "Kaup Beach Cottage",
    description: "Beachfront cottage with stunning lighthouse views and easy access to Kaup Beach.",
    location: "Kaup, Udupi",
    address: "Kaup Beach Road, Near Lighthouse, Kaup, Udupi, Karnataka 574106",
    price_per_night: 3000,
    rating: 4.9,
    total_reviews: 156,
    phone: "+91 97411 98765",
    email: "kaupbeach@gmail.com",
    amenities: "Beach Access, Lighthouse View, Seafood, AC, WiFi, Beach Sports",
    image_url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&h=400&fit=crop",
    latitude: 13.2167,
    longitude: 74.7500,
    is_active: true
  },
  {
    id: 5,
    name: "Manipal University Guest House",
    description: "Comfortable accommodation near Manipal University with modern facilities and local cuisine.",
    location: "Manipal, Udupi",
    address: "Tiger Circle Road, Manipal, Udupi, Karnataka 576104",
    price_per_night: 2000,
    rating: 4.5,
    total_reviews: 203,
    phone: "+91 98862 13579",
    email: "manipalguesthouse@yahoo.com",
    amenities: "University Access, Student Friendly, AC, WiFi, Local Tours, Restaurant",
    image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop",
    latitude: 13.3467,
    longitude: 74.7869,
    is_active: true
  }
];

export const getHomestays: RequestHandler = async (req, res) => {
  try {
    // Try database first
    try {
      const connection = await getConnection();
      const result = await connection.request().query(`
        SELECT * FROM Homestays 
        WHERE is_active = 1 
        ORDER BY rating DESC, name ASC
      `);
      
      res.json({
        success: true,
        data: result.recordset,
        count: result.recordset.length,
        source: 'database'
      });
      return;
    } catch (dbError) {
      console.log('Database not available, using fallback data');
    }
    
    // Fallback to mock data
    res.json({
      success: true,
      data: mockHomestays,
      count: mockHomestays.length,
      source: 'fallback'
    });
    
  } catch (error) {
    console.error('Error fetching homestays:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching homestays',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getHomestayById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try database first
    try {
      const connection = await getConnection();
      const result = await connection.request()
        .input('id', id)
        .query('SELECT * FROM Homestays WHERE id = @id AND is_active = 1');
      
      if (result.recordset.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Homestay not found'
        });
      }
      
      res.json({
        success: true,
        data: result.recordset[0],
        source: 'database'
      });
      return;
    } catch (dbError) {
      console.log('Database not available, using fallback data');
    }
    
    // Fallback to mock data
    const homestay = mockHomestays.find(h => h.id === parseInt(id));
    if (!homestay) {
      return res.status(404).json({
        success: false,
        message: 'Homestay not found'
      });
    }
    
    res.json({
      success: true,
      data: homestay,
      source: 'fallback'
    });
    
  } catch (error) {
    console.error('Error fetching homestay:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching homestay',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const searchHomestays: RequestHandler = async (req, res) => {
  try {
    const { location, maxPrice, minRating } = req.query;
    
    // Try database first
    try {
      const connection = await getConnection();
      
      let query = 'SELECT * FROM Homestays WHERE is_active = 1';
      const request = connection.request();
      
      if (location) {
        query += ' AND (location LIKE @location OR address LIKE @location)';
        request.input('location', `%${location}%`);
      }
      
      if (maxPrice) {
        query += ' AND price_per_night <= @maxPrice';
        request.input('maxPrice', Number(maxPrice));
      }
      
      if (minRating) {
        query += ' AND rating >= @minRating';
        request.input('minRating', Number(minRating));
      }
      
      query += ' ORDER BY rating DESC, name ASC';
      
      const result = await request.query(query);
      
      res.json({
        success: true,
        data: result.recordset,
        count: result.recordset.length,
        source: 'database'
      });
      return;
    } catch (dbError) {
      console.log('Database not available, using fallback data for search');
    }
    
    // Fallback to mock data search
    let filteredHomestays = mockHomestays.filter(h => h.is_active);
    
    if (location) {
      const locationStr = String(location).toLowerCase();
      filteredHomestays = filteredHomestays.filter(h => 
        h.location.toLowerCase().includes(locationStr) || 
        (h.address && h.address.toLowerCase().includes(locationStr))
      );
    }
    
    if (maxPrice) {
      filteredHomestays = filteredHomestays.filter(h => 
        h.price_per_night && h.price_per_night <= Number(maxPrice)
      );
    }
    
    if (minRating) {
      filteredHomestays = filteredHomestays.filter(h => 
        h.rating && h.rating >= Number(minRating)
      );
    }
    
    // Sort by rating and name
    filteredHomestays.sort((a, b) => {
      if (a.rating !== b.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      return a.name.localeCompare(b.name);
    });
    
    res.json({
      success: true,
      data: filteredHomestays,
      count: filteredHomestays.length,
      source: 'fallback'
    });
    
  } catch (error) {
    console.error('Error searching homestays:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching homestays',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
