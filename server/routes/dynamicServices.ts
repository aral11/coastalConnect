import { Router, Request, Response } from 'express';
import { getConnection } from '../db/connection';

const router = Router();

// Get all homestays
router.get('/homestays', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    
    const result = await connection.request().query(`
      SELECT 
        id,
        name,
        description,
        location,
        address,
        price_per_night,
        rating,
        total_reviews,
        phone,
        email,
        amenities,
        image_url,
        latitude,
        longitude,
        is_active,
        created_at,
        updated_at
      FROM Homestays 
      WHERE is_active = 1
      ORDER BY rating DESC, total_reviews DESC
    `);

    res.json({
      success: true,
      data: result.recordset,
      message: 'Homestays retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching homestays:', error);
    
    // Return fallback data if database fails
    const fallbackHomestays = [
      {
        id: 1,
        name: 'Coastal Heritage Homestay',
        description: 'Experience traditional Udupi hospitality in our heritage home with authentic coastal Karnataka cuisine.',
        location: 'Malpe Beach Road, Udupi',
        address: 'Near Malpe Beach, Udupi, Karnataka 576103',
        price_per_night: 2500,
        rating: 4.8,
        total_reviews: 124,
        phone: '+91 98456 78901',
        email: 'stay@coastalheritage.com',
        amenities: 'AC Rooms, Free WiFi, Traditional Breakfast, Beach Access, Parking',
        image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
        latitude: 13.3494,
        longitude: 74.7421,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Krishna Temple View Homestay',
        description: 'Stay near the famous Krishna Temple with temple views and authentic Udupi vegetarian meals.',
        location: 'Car Street, Udupi',
        address: 'Car Street, Near Krishna Temple, Udupi, Karnataka 576101',
        price_per_night: 1800,
        rating: 4.6,
        total_reviews: 89,
        phone: '+91 94488 12345',
        email: 'info@krishnaview.com',
        amenities: 'Temple View, Vegetarian Meals, AC, Free WiFi, Cultural Tours',
        image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
        latitude: 13.3409,
        longitude: 74.7421,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    res.json({
      success: true,
      data: fallbackHomestays,
      message: 'Homestays retrieved (fallback data)'
    });
  }
});

// Get single homestay by ID
router.get('/homestays/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    
    const result = await connection.request()
      .input('id', parseInt(id))
      .query(`
        SELECT 
          id,
          name,
          description,
          location,
          address,
          price_per_night,
          rating,
          total_reviews,
          phone,
          email,
          amenities,
          image_url,
          latitude,
          longitude,
          is_active,
          created_at,
          updated_at
        FROM Homestays 
        WHERE id = @id AND is_active = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Homestay not found'
      });
    }

    res.json({
      success: true,
      data: result.recordset[0],
      message: 'Homestay details retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching homestay:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homestay details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all restaurants
router.get('/restaurants', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    
    const result = await connection.request().query(`
      SELECT 
        id,
        name,
        description,
        location,
        address,
        cuisine_type,
        rating,
        total_reviews,
        phone,
        opening_hours,
        price_range,
        image_url,
        latitude,
        longitude,
        is_active,
        created_at,
        updated_at
      FROM Restaurants 
      WHERE is_active = 1
      ORDER BY rating DESC, total_reviews DESC
    `);

    res.json({
      success: true,
      data: result.recordset,
      message: 'Restaurants retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching restaurants:', error);
    
    // Return fallback data if database fails
    const fallbackRestaurants = [
      {
        id: 1,
        name: 'Woodlands Restaurant',
        description: 'Famous for authentic Udupi vegetarian cuisine and South Indian breakfast items.',
        location: 'Car Street, Udupi',
        address: 'Car Street, Udupi, Karnataka 576101',
        cuisine_type: 'South Indian Vegetarian',
        rating: 4.7,
        total_reviews: 892,
        phone: '+91 820 252 0794',
        opening_hours: '6:00 AM - 10:30 PM',
        price_range: 250,
        image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
        latitude: 13.3409,
        longitude: 74.7421,
        is_active: true
      },
      {
        id: 2,
        name: 'Mitra Samaj Bhojanalaya',
        description: 'Historic restaurant serving traditional Udupi meals on banana leaves since 1920.',
        location: 'Car Street, Udupi',
        address: 'Car Street, Near Krishna Temple, Udupi, Karnataka 576101',
        cuisine_type: 'Traditional Udupi',
        rating: 4.8,
        total_reviews: 654,
        phone: '+91 820 252 2039',
        opening_hours: '11:00 AM - 3:00 PM, 7:00 PM - 9:30 PM',
        price_range: 300,
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
        latitude: 13.3409,
        longitude: 74.7421,
        is_active: true
      }
    ];

    res.json({
      success: true,
      data: fallbackRestaurants,
      message: 'Restaurants retrieved (fallback data)'
    });
  }
});

// Get single restaurant by ID
router.get('/restaurants/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    
    const result = await connection.request()
      .input('id', parseInt(id))
      .query(`
        SELECT 
          id,
          name,
          description,
          location,
          address,
          cuisine_type,
          rating,
          total_reviews,
          phone,
          opening_hours,
          price_range,
          image_url,
          latitude,
          longitude,
          is_active,
          created_at,
          updated_at
        FROM Restaurants 
        WHERE id = @id AND is_active = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data: result.recordset[0],
      message: 'Restaurant details retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all drivers
router.get('/drivers', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    
    const result = await connection.request().query(`
      SELECT 
        id,
        name,
        phone,
        email,
        location,
        vehicle_type,
        vehicle_number,
        license_number,
        rating,
        total_reviews,
        hourly_rate,
        experience_years,
        languages,
        is_available,
        is_active,
        created_at,
        updated_at
      FROM Drivers 
      WHERE is_active = 1 AND is_available = 1
      ORDER BY rating DESC, total_reviews DESC
    `);

    res.json({
      success: true,
      data: result.recordset,
      message: 'Drivers retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching drivers:', error);
    
    // Return fallback data if database fails
    const fallbackDrivers = [
      {
        id: 1,
        name: 'Suresh Kumar',
        phone: '+91 94488 12345',
        email: 'suresh.driver@gmail.com',
        location: 'Udupi City',
        vehicle_type: 'Sedan (Maruti Dzire)',
        vehicle_number: 'KA 20 A 1234',
        license_number: 'DL-2020123456789',
        rating: 4.8,
        total_reviews: 156,
        hourly_rate: 300,
        experience_years: 8,
        languages: 'Kannada, Hindi, English, Tulu',
        is_available: true,
        is_active: true
      },
      {
        id: 2,
        name: 'Ramesh Bhat',
        phone: '+91 98456 78901',
        email: 'ramesh.bhat.driver@yahoo.com',
        location: 'Manipal-Udupi',
        vehicle_type: 'SUV (Mahindra Scorpio)',
        vehicle_number: 'KA 20 B 5678',
        license_number: 'DL-2019987654321',
        rating: 4.9,
        total_reviews: 203,
        hourly_rate: 450,
        experience_years: 12,
        languages: 'Kannada, English, Tulu, Konkani',
        is_available: true,
        is_active: true
      }
    ];

    res.json({
      success: true,
      data: fallbackDrivers,
      message: 'Drivers retrieved (fallback data)'
    });
  }
});

// Get single driver by ID
router.get('/drivers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    
    const result = await connection.request()
      .input('id', parseInt(id))
      .query(`
        SELECT 
          id,
          name,
          phone,
          email,
          location,
          vehicle_type,
          vehicle_number,
          license_number,
          rating,
          total_reviews,
          hourly_rate,
          experience_years,
          languages,
          is_available,
          is_active,
          created_at,
          updated_at
        FROM Drivers 
        WHERE id = @id AND is_active = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      data: result.recordset[0],
      message: 'Driver details retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch driver details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
