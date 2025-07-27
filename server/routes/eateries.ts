import { RequestHandler } from "express";
import { getConnection } from "../db/connection";
import { Eatery } from "../models";
import { GooglePlacesService } from "../services/googlePlaces";

// Fallback eateries data
const mockEateries: Eatery[] = [
  {
    id: 1,
    name: "Shree Krishna Boarding & Lodge",
    description: "Historic restaurant serving authentic Udupi traditional cuisine since decades.",
    location: "Udupi",
    address: "Car Street, Udupi, Karnataka 576101",
    cuisine_type: "Udupi Traditional",
    rating: 4.7,
    total_reviews: 892,
    phone: "+91 820 252 0794",
    opening_hours: "6:00 AM - 10:30 PM",
    price_range: "₹300 for two",
    image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
    is_active: true
  },
  {
    id: 2,
    name: "Mitra Samaj",
    description: "Historic restaurant serving traditional South Indian meals on banana leaves since 1920.",
    location: "Udupi",
    address: "Car Street, Near Krishna Temple, Udupi, Karnataka 576101",
    cuisine_type: "South Indian",
    rating: 4.6,
    total_reviews: 1567,
    phone: "+91 820 252 2039",
    opening_hours: "11:00 AM - 3:00 PM, 7:00 PM - 9:30 PM",
    price_range: "₹300 for two",
    image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
    is_active: true
  },
  {
    id: 3,
    name: "Woodlands Restaurant",
    description: "Famous for authentic South Indian vegetarian cuisine and breakfast items.",
    location: "Udupi",
    address: "Udupi, Karnataka 576101",
    cuisine_type: "South Indian",
    rating: 4.5,
    total_reviews: 1234,
    phone: "+91 820 252 3456",
    opening_hours: "6:00 AM - 10:30 PM",
    price_range: "₹300 for two",
    image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
    is_active: true
  },
  {
    id: 4,
    name: "Coastal Cuisine",
    description: "Authentic coastal seafood restaurant offering fresh catch and traditional preparations.",
    location: "Malpe",
    address: "Malpe Beach Road, Udupi, Karnataka 576103",
    cuisine_type: "Coastal Seafood",
    rating: 4.4,
    total_reviews: 567,
    phone: "+91 820 292 4567",
    opening_hours: "11:00 AM - 11:00 PM",
    price_range: "₹300 for two",
    image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    is_active: true
  },
  {
    id: 3,
    name: "Dollops Restaurant",
    description: "Modern restaurant offering fusion of coastal Karnataka and international cuisines.",
    location: "Manipal, Udupi",
    address: "Manipal University Road, Manipal, Karnataka 576104",
    cuisine_type: "Multi-cuisine",
    rating: 4.5,
    total_reviews: 334,
    phone: "+91 820 292 3456",
    opening_hours: "11:00 AM - 11:00 PM",
    price_range: "₹300-600 per person",
    image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
    is_active: true
  },
  {
    id: 4,
    name: "Malpe Sea Food Restaurant",
    description: "Fresh seafood restaurant with variety of coastal Karnataka fish preparations.",
    location: "Malpe, Udupi",
    address: "Malpe Beach Road, Malpe, Udupi, Karnataka 576103",
    cuisine_type: "Seafood, Coastal Karnataka",
    rating: 4.6,
    total_reviews: 445,
    phone: "+91 820 252 8901",
    opening_hours: "11:30 AM - 3:00 PM, 6:30 PM - 10:00 PM",
    price_range: "₹400-800 per person",
    image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
    is_active: true
  },
  {
    id: 5,
    name: "Hotel Janatha Deluxe",
    description: "Local favorite for traditional Udupi breakfast, dosas, and filter coffee.",
    location: "Udupi Bus Stand",
    address: "Near Bus Stand, Udupi, Karnataka 576101",
    cuisine_type: "South Indian Breakfast",
    rating: 4.4,
    total_reviews: 278,
    phone: "+91 820 252 1234",
    opening_hours: "6:30 AM - 12:00 PM, 3:00 PM - 9:00 PM",
    price_range: "₹100-250 per person",
    image_url: "https://images.unsplash.com/photo-1630409346253-6d74b5e49fd1?w=600&h=400&fit=crop",
    is_active: true
  },
  {
    id: 6,
    name: "Gokul Vegetarian",
    description: "Popular vegetarian restaurant known for North Indian and Chinese dishes.",
    location: "Service Bus Stand, Udupi",
    address: "Service Bus Stand Road, Udupi, Karnataka 576101",
    cuisine_type: "North Indian, Chinese, South Indian",
    rating: 4.3,
    total_reviews: 567,
    phone: "+91 820 252 7890",
    opening_hours: "10:00 AM - 10:30 PM",
    price_range: "₹200-450 per person",
    image_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop",
    is_active: true
  }
];

export const getEateries: RequestHandler = async (req, res) => {
  try {
    const { cuisine_type, location, rating } = req.query;

    // First try to get real data from Google Places API
    console.log('🍽️ Fetching restaurant data from Google Places API...');

    const locationFilter = location ? location.toString().toLowerCase() : 'all';
    const validLocations = ['udupi', 'manipal', 'all'];
    const searchLocation = validLocations.includes(locationFilter) ?
      locationFilter as 'udupi' | 'manipal' | 'all' : 'all';

    let restaurants = await GooglePlacesService.searchRestaurants(searchLocation);

    // Apply filters
    if (cuisine_type) {
      restaurants = restaurants.filter(r =>
        r.cuisine_type.toLowerCase().includes(cuisine_type.toString().toLowerCase())
      );
    }

    if (rating) {
      const minRating = parseFloat(rating as string);
      restaurants = restaurants.filter(r => r.rating >= minRating);
    }

    // Sort by rating DESC, then reviews DESC
    restaurants.sort((a, b) => {
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      return b.total_reviews - a.total_reviews;
    });

    res.json({
      success: true,
      data: restaurants,
      count: restaurants.length,
      source: 'google_places'
    });

  } catch (error) {
    console.log('Google Places API failed, trying database...');

    try {
      const { cuisine_type, location, rating } = req.query;
      const connection = await getConnection();

      let query = 'SELECT * FROM Eateries WHERE is_active = 1';
      const request = connection.request();

      if (cuisine_type) {
        query += ' AND cuisine_type LIKE @cuisine_type';
        request.input('cuisine_type', `%${cuisine_type}%`);
      }

      if (location) {
        query += ' AND location LIKE @location';
        request.input('location', `%${location}%`);
      }

      if (rating) {
        query += ' AND rating >= @rating';
        request.input('rating', parseFloat(rating as string));
      }

      query += ' ORDER BY rating DESC, total_reviews DESC';

      const result = await request.query(query);

      res.json({
        success: true,
        data: result.recordset,
        count: result.recordset.length,
        source: 'database'
      });
    } catch (dbError) {
      console.log('Database also not available, using enhanced fallback eateries data');

      let filteredEateries = [...mockEateries];

      if (req.query.cuisine_type) {
        filteredEateries = filteredEateries.filter(e =>
          e.cuisine_type.toLowerCase().includes((req.query.cuisine_type as string).toLowerCase())
        );
      }

      if (req.query.location) {
        filteredEateries = filteredEateries.filter(e =>
          e.location.toLowerCase().includes((req.query.location as string).toLowerCase())
        );
      }

      if (req.query.rating) {
        const minRating = parseFloat(req.query.rating as string);
        filteredEateries = filteredEateries.filter(e => e.rating >= minRating);
      }

      // Sort by rating DESC, then reviews DESC
      filteredEateries.sort((a, b) => {
        if (a.rating !== b.rating) {
          return b.rating - a.rating;
        }
        return b.total_reviews - a.total_reviews;
      });

      res.json({
        success: true,
        data: filteredEateries,
        count: filteredEateries.length,
        source: 'fallback'
      });
    }
  }
};

export const getEateryById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.request()
      .input('id', id)
      .query('SELECT * FROM Eateries WHERE id = @id AND is_active = 1');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Eatery not found'
      });
    }
    
    res.json({
      success: true,
      data: result.recordset[0]
    });
  } catch (error) {
    console.error('Error fetching eatery:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching eatery',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const searchEateries: RequestHandler = async (req, res) => {
  try {
    const { location, cuisine, minRating } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM Eateries WHERE is_active = 1';
    const request = connection.request();
    
    if (location) {
      query += ' AND (location LIKE @location OR address LIKE @location)';
      request.input('location', `%${location}%`);
    }
    
    if (cuisine) {
      query += ' AND cuisine_type LIKE @cuisine';
      request.input('cuisine', `%${cuisine}%`);
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
      count: result.recordset.length
    });
  } catch (error) {
    console.error('Error searching eateries:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching eateries',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
