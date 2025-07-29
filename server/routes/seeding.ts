import { Router, Request, Response } from 'express';
import { getConnection } from '../db/connection';

const router = Router();

// Seed sample data for development
router.post('/seed-sample-data', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    
    console.log('🌱 Starting database seeding...');

    // Sample Homestays
    const homestays = [
      {
        name: 'Coastal Heritage Homestay',
        description: 'Experience traditional Udupi hospitality in our heritage home with authentic coastal Karnataka cuisine and modern amenities.',
        location: 'Malpe Beach Road, Udupi',
        address: 'Near Malpe Beach, Udupi, Karnataka 576103',
        price_per_night: 2500.00,
        rating: 4.8,
        total_reviews: 124,
        phone: '+91 98456 78901',
        email: 'stay@coastalheritage.com',
        amenities: 'AC Rooms, Free WiFi, Traditional Breakfast, Beach Access, Parking, Kitchen Access',
        image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
        latitude: 13.3494,
        longitude: 74.7421,
        is_active: 1
      },
      {
        name: 'Krishna Temple View Homestay',
        description: 'Stay near the famous Krishna Temple with temple views and authentic Udupi vegetarian meals.',
        location: 'Car Street, Udupi',
        address: 'Car Street, Near Krishna Temple, Udupi, Karnataka 576101',
        price_per_night: 1800.00,
        rating: 4.6,
        total_reviews: 89,
        phone: '+91 94488 12345',
        email: 'info@krishnaview.com',
        amenities: 'Temple View, Vegetarian Meals, AC, Free WiFi, Cultural Tours, Parking',
        image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
        latitude: 13.3409,
        longitude: 74.7421,
        is_active: 1
      },
      {
        name: 'Backwater Bliss Homestay',
        description: 'Peaceful homestay surrounded by backwaters and coconut groves, perfect for nature lovers.',
        location: 'Brahmavar, Udupi',
        address: 'Brahmavar Backwaters, Udupi District, Karnataka 576213',
        price_per_night: 2200.00,
        rating: 4.7,
        total_reviews: 67,
        phone: '+91 95916 54321',
        email: 'contact@backwaterbliss.in',
        amenities: 'Backwater View, Kayaking, Traditional Food, AC, WiFi, Nature Walks',
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
        latitude: 13.3625,
        longitude: 74.7678,
        is_active: 1
      }
    ];

    // Insert homestays
    for (const homestay of homestays) {
      await connection.request()
        .input('name', homestay.name)
        .input('description', homestay.description)
        .input('location', homestay.location)
        .input('address', homestay.address)
        .input('price_per_night', homestay.price_per_night)
        .input('rating', homestay.rating)
        .input('total_reviews', homestay.total_reviews)
        .input('phone', homestay.phone)
        .input('email', homestay.email)
        .input('amenities', homestay.amenities)
        .input('image_url', homestay.image_url)
        .input('latitude', homestay.latitude)
        .input('longitude', homestay.longitude)
        .input('is_active', homestay.is_active)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Homestays WHERE name = @name)
          INSERT INTO Homestays (name, description, location, address, price_per_night, rating, total_reviews, phone, email, amenities, image_url, latitude, longitude, is_active)
          VALUES (@name, @description, @location, @address, @price_per_night, @rating, @total_reviews, @phone, @email, @amenities, @image_url, @latitude, @longitude, @is_active)
        `);
    }

    // Sample Restaurants
    const restaurants = [
      {
        name: 'Woodlands Restaurant',
        description: 'Famous for authentic Udupi vegetarian cuisine and South Indian breakfast items.',
        location: 'Car Street, Udupi',
        address: 'Car Street, Udupi, Karnataka 576101',
        cuisine_type: 'South Indian Vegetarian',
        rating: 4.7,
        total_reviews: 892,
        phone: '+91 820 252 0794',
        opening_hours: '6:00 AM - 10:30 PM',
        price_range: '250',
        image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
        latitude: 13.3409,
        longitude: 74.7421,
        is_active: 1
      },
      {
        name: 'Mitra Samaj Bhojanalaya',
        description: 'Historic restaurant serving traditional Udupi meals on banana leaves since 1920.',
        location: 'Car Street, Udupi',
        address: 'Car Street, Near Krishna Temple, Udupi, Karnataka 576101',
        cuisine_type: 'Traditional Udupi',
        rating: 4.8,
        total_reviews: 654,
        phone: '+91 820 252 2039',
        opening_hours: '11:00 AM - 3:00 PM, 7:00 PM - 9:30 PM',
        price_range: '300',
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
        latitude: 13.3409,
        longitude: 74.7421,
        is_active: 1
      },
      {
        name: 'Malpe Sea Food Restaurant',
        description: 'Fresh seafood restaurant with variety of coastal Karnataka fish preparations.',
        location: 'Malpe, Udupi',
        address: 'Malpe Beach Road, Malpe, Udupi, Karnataka 576103',
        cuisine_type: 'Seafood, Coastal Karnataka',
        rating: 4.6,
        total_reviews: 445,
        phone: '+91 820 252 8901',
        opening_hours: '11:30 AM - 3:00 PM, 6:30 PM - 10:00 PM',
        price_range: '600',
        image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop',
        latitude: 13.3494,
        longitude: 74.7421,
        is_active: 1
      }
    ];

    // Insert restaurants
    for (const restaurant of restaurants) {
      await connection.request()
        .input('name', restaurant.name)
        .input('description', restaurant.description)
        .input('location', restaurant.location)
        .input('address', restaurant.address)
        .input('cuisine_type', restaurant.cuisine_type)
        .input('rating', restaurant.rating)
        .input('total_reviews', restaurant.total_reviews)
        .input('phone', restaurant.phone)
        .input('opening_hours', restaurant.opening_hours)
        .input('price_range', restaurant.price_range)
        .input('image_url', restaurant.image_url)
        .input('latitude', restaurant.latitude)
        .input('longitude', restaurant.longitude)
        .input('is_active', restaurant.is_active)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Restaurants WHERE name = @name)
          INSERT INTO Restaurants (name, description, location, address, cuisine_type, rating, total_reviews, phone, opening_hours, price_range, image_url, latitude, longitude, is_active)
          VALUES (@name, @description, @location, @address, @cuisine_type, @rating, @total_reviews, @phone, @opening_hours, @price_range, @image_url, @latitude, @longitude, @is_active)
        `);
    }

    // Sample Drivers
    const drivers = [
      {
        name: 'Suresh Kumar',
        phone: '+91 94488 12345',
        email: 'suresh.driver@gmail.com',
        location: 'Udupi City',
        vehicle_type: 'Sedan (Maruti Dzire)',
        vehicle_number: 'KA 20 A 1234',
        license_number: 'DL-2020123456789',
        rating: 4.8,
        total_reviews: 156,
        hourly_rate: 300.00,
        experience_years: 8,
        languages: 'Kannada, Hindi, English, Tulu',
        is_available: 1,
        is_active: 1
      },
      {
        name: 'Ramesh Bhat',
        phone: '+91 98456 78901',
        email: 'ramesh.bhat.driver@yahoo.com',
        location: 'Manipal-Udupi',
        vehicle_type: 'SUV (Mahindra Scorpio)',
        vehicle_number: 'KA 20 B 5678',
        license_number: 'DL-2019987654321',
        rating: 4.9,
        total_reviews: 203,
        hourly_rate: 450.00,
        experience_years: 12,
        languages: 'Kannada, English, Tulu, Konkani',
        is_available: 1,
        is_active: 1
      },
      {
        name: 'Prakash Shetty',
        phone: '+91 95916 54321',
        email: 'prakash.shetty@gmail.com',
        location: 'Malpe-Kaup Route',
        vehicle_type: 'Hatchback (Maruti Swift)',
        vehicle_number: 'KA 20 C 9012',
        license_number: 'DL-2021456789123',
        rating: 4.6,
        total_reviews: 89,
        hourly_rate: 250.00,
        experience_years: 5,
        languages: 'Kannada, Hindi, Tulu',
        is_available: 1,
        is_active: 1
      }
    ];

    // Insert drivers
    for (const driver of drivers) {
      await connection.request()
        .input('name', driver.name)
        .input('phone', driver.phone)
        .input('email', driver.email)
        .input('location', driver.location)
        .input('vehicle_type', driver.vehicle_type)
        .input('vehicle_number', driver.vehicle_number)
        .input('license_number', driver.license_number)
        .input('rating', driver.rating)
        .input('total_reviews', driver.total_reviews)
        .input('hourly_rate', driver.hourly_rate)
        .input('experience_years', driver.experience_years)
        .input('languages', driver.languages)
        .input('is_available', driver.is_available)
        .input('is_active', driver.is_active)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM Drivers WHERE phone = @phone)
          INSERT INTO Drivers (name, phone, email, location, vehicle_type, vehicle_number, license_number, rating, total_reviews, hourly_rate, experience_years, languages, is_available, is_active)
          VALUES (@name, @phone, @email, @location, @vehicle_type, @vehicle_number, @license_number, @rating, @total_reviews, @hourly_rate, @experience_years, @languages, @is_available, @is_active)
        `);
    }

    console.log('✅ Database seeding completed successfully!');

    res.json({
      success: true,
      message: 'Sample data seeded successfully',
      data: {
        homestays: homestays.length,
        restaurants: restaurants.length,
        drivers: drivers.length
      }
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get database status and record counts
router.get('/database-status', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    
    const homestayCount = await connection.request().query('SELECT COUNT(*) as count FROM Homestays');
    const restaurantCount = await connection.request().query('SELECT COUNT(*) as count FROM Restaurants');
    const driverCount = await connection.request().query('SELECT COUNT(*) as count FROM Drivers');
    const userCount = await connection.request().query('SELECT COUNT(*) as count FROM Users');
    const bookingCount = await connection.request().query('SELECT COUNT(*) as count FROM Bookings');

    res.json({
      success: true,
      message: 'Database status retrieved',
      data: {
        connected: true,
        tables: {
          homestays: homestayCount.recordset[0]?.count || 0,
          restaurants: restaurantCount.recordset[0]?.count || 0,
          drivers: driverCount.recordset[0]?.count || 0,
          users: userCount.recordset[0]?.count || 0,
          bookings: bookingCount.recordset[0]?.count || 0
        }
      }
    });

  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      data: {
        connected: false,
        tables: {
          homestays: 0,
          restaurants: 0,
          drivers: 0,
          users: 0,
          bookings: 0
        }
      }
    });
  }
});

export default router;
