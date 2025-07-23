import { RequestHandler } from "express";
import { getConnection } from "../db/connection";

// Beauty & Wellness Services
export const getBeautyWellness: RequestHandler = async (req, res) => {
  try {
    const { category, location } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM BeautyWellness WHERE is_active = 1';
    const request = connection.request();
    
    if (category) {
      query += ' AND category = @category';
      request.input('category', category);
    }
    
    if (location) {
      query += ' AND location LIKE @location';
      request.input('location', `%${location}%`);
    }
    
    query += ' ORDER BY rating DESC, name ASC';
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback data');
    
    // Enhanced fallback data for Beauty & Wellness
    const fallbackData = [
      {
        id: 1,
        name: "Ayurveda Wellness Center Udupi",
        description: "Traditional Ayurvedic treatments and therapies in the heart of Udupi",
        category: "ayurveda",
        location: "Udupi",
        address: "Car Street, Udupi, Karnataka",
        phone: "0820-2530001",
        opening_hours: "9:00 AM - 8:00 PM",
        services: JSON.stringify(["Panchakarma", "Abhyanga", "Shirodhara", "Herbal Treatments"]),
        price_range: "₹500-2000",
        rating: 4.6,
        total_reviews: 145,
        image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop",
        website_url: "https://ayurvedaudupi.com"
      },
      {
        id: 2,
        name: "Manipal Fitness Hub",
        description: "Modern gym with state-of-the-art equipment near Manipal University",
        category: "gym",
        location: "Manipal",
        address: "Tiger Circle, Manipal, Karnataka",
        phone: "0820-2922001",
        opening_hours: "5:00 AM - 11:00 PM",
        services: JSON.stringify(["Weight Training", "Cardio", "Group Classes", "Personal Training"]),
        price_range: "₹1000-3000/month",
        rating: 4.3,
        total_reviews: 89,
        image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"
      },
      {
        id: 3,
        name: "Coastal Spa & Salon",
        description: "Premium spa and beauty services with coastal ambiance",
        category: "spa",
        location: "Malpe",
        address: "Malpe Beach Road, Karnataka",
        phone: "0820-2531002",
        opening_hours: "10:00 AM - 9:00 PM",
        services: JSON.stringify(["Deep Tissue Massage", "Facial Treatments", "Hair Styling", "Manicure/Pedicure"]),
        price_range: "₹800-3500",
        rating: 4.5,
        total_reviews: 67,
        image_url: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&h=400&fit=crop"
      }
    ];
    
    res.json({
      success: true,
      data: fallbackData,
      count: fallbackData.length,
      source: 'fallback'
    });
  }
};

// Arts & History Services
export const getArtsHistory: RequestHandler = async (req, res) => {
  try {
    const { category, location } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM ArtsHistory WHERE is_active = 1';
    const request = connection.request();
    
    if (category) {
      query += ' AND category = @category';
      request.input('category', category);
    }
    
    if (location) {
      query += ' AND location LIKE @location';
      request.input('location', `%${location}%`);
    }
    
    query += ' ORDER BY rating DESC, name ASC';
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback data');
    
    const fallbackData = [
      {
        id: 1,
        name: "Udupi Krishna Temple Heritage",
        description: "Historic Krishna temple with rich cultural heritage and Dvaita philosophy",
        category: "heritage_site",
        location: "Udupi",
        address: "Car Street, Udupi, Karnataka",
        phone: "0820-2520033",
        opening_hours: "5:30 AM - 1:00 PM, 3:00 PM - 9:00 PM",
        entry_fee: 0,
        activities: JSON.stringify(["Temple Tours", "Paryaya Festival", "Cultural Programs", "Heritage Walks"]),
        rating: 4.8,
        total_reviews: 2341,
        image_url: "https://images.unsplash.com/photo-1582632431511-26040d79dfa7?w=600&h=400&fit=crop",
        historical_significance: "Founded by Jagadguru Sri Madhvacharya in the 13th century"
      },
      {
        id: 2,
        name: "Hasta Shilpa Heritage Village",
        description: "Traditional crafts and heritage village showcasing coastal Karnataka art forms",
        category: "museum",
        location: "Manipal",
        address: "Manipal, Karnataka",
        phone: "0820-2571062",
        opening_hours: "9:00 AM - 5:30 PM",
        entry_fee: 25,
        activities: JSON.stringify(["Heritage Walks", "Craft Workshops", "Cultural Performances", "Art Exhibitions"]),
        rating: 4.4,
        total_reviews: 156,
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
      },
      {
        id: 3,
        name: "Regional Resources Centre for Folk Performing Arts",
        description: "Dedicated to preserving and promoting Yakshagana and traditional art forms",
        category: "cultural_event",
        location: "Udupi",
        address: "MGM College Campus, Udupi",
        phone: "0820-2529302",
        opening_hours: "10:00 AM - 5:00 PM",
        entry_fee: 50,
        activities: JSON.stringify(["Yakshagana Performances", "Music Concerts", "Dance Workshops", "Cultural Events"]),
        rating: 4.6,
        total_reviews: 98,
        image_url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop"
      }
    ];
    
    res.json({
      success: true,
      data: fallbackData,
      count: fallbackData.length,
      source: 'fallback'
    });
  }
};

// Nightlife Services
export const getNightlife: RequestHandler = async (req, res) => {
  try {
    const { category, location } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM Nightlife WHERE is_active = 1';
    const request = connection.request();
    
    if (category) {
      query += ' AND category = @category';
      request.input('category', category);
    }
    
    if (location) {
      query += ' AND location LIKE @location';
      request.input('location', `%${location}%`);
    }
    
    query += ' ORDER BY rating DESC, name ASC';
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback data');
    
    const fallbackData = [
      {
        id: 1,
        name: "The Deck - Malpe Beach",
        description: "Beachside lounge with stunning sunset views and live music",
        category: "lounge",
        location: "Malpe",
        address: "Malpe Beach, Karnataka",
        phone: "0820-2532001",
        opening_hours: "4:00 PM - 12:00 AM",
        music_type: "Live acoustic, DJ nights on weekends",
        dress_code: "Smart casual",
        entry_fee: 0,
        rating: 4.3,
        total_reviews: 234,
        image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop"
      },
      {
        id: 2,
        name: "Pub G - Manipal",
        description: "Popular student hangout with great food and vibrant atmosphere",
        category: "pub",
        location: "Manipal",
        address: "Lighthouse Hill Road, Manipal",
        phone: "0820-2570123",
        opening_hours: "6:00 PM - 1:00 AM",
        music_type: "Pop, Rock, EDM",
        dress_code: "Casual",
        entry_fee: 100,
        rating: 4.1,
        total_reviews: 567,
        image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop"
      }
    ];
    
    res.json({
      success: true,
      data: fallbackData,
      count: fallbackData.length,
      source: 'fallback'
    });
  }
};

// Shopping Services
export const getShopping: RequestHandler = async (req, res) => {
  try {
    const { category, location } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM Shopping WHERE is_active = 1';
    const request = connection.request();
    
    if (category) {
      query += ' AND category = @category';
      request.input('category', category);
    }
    
    if (location) {
      query += ' AND location LIKE @location';
      request.input('location', `%${location}%`);
    }
    
    query += ' ORDER BY rating DESC, name ASC';
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback data');
    
    const fallbackData = [
      {
        id: 1,
        name: "Udupi Market Complex",
        description: "Traditional market with local produce, spices, and handicrafts",
        category: "market",
        location: "Udupi",
        address: "Market Road, Udupi, Karnataka",
        phone: "0820-2520045",
        opening_hours: "6:00 AM - 9:00 PM",
        specialties: JSON.stringify(["Fresh Vegetables", "Spices", "Traditional Clothes", "Handicrafts"]),
        price_range: "Budget-friendly",
        rating: 4.2,
        total_reviews: 89,
        image_url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=400&fit=crop"
      },
      {
        id: 2,
        name: "Coastal Handicrafts Emporium",
        description: "Authentic coastal Karnataka handicrafts and souvenirs",
        category: "boutique",
        location: "Udupi",
        address: "Car Street, Udupi",
        phone: "0820-2520067",
        opening_hours: "9:00 AM - 8:00 PM",
        specialties: JSON.stringify(["Yakshagana Masks", "Wood Carvings", "Traditional Jewelry", "Textiles"]),
        price_range: "Mid-range",
        rating: 4.5,
        total_reviews: 156,
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
      },
      {
        id: 3,
        name: "Manipal Centre Mall",
        description: "Modern shopping center with international and local brands",
        category: "mall",
        location: "Manipal",
        address: "Tiger Circle, Manipal",
        phone: "0820-2570234",
        opening_hours: "10:00 AM - 10:00 PM",
        specialties: JSON.stringify(["Fashion", "Electronics", "Food Court", "Entertainment"]),
        price_range: "Mid to High-range",
        rating: 4.0,
        total_reviews: 445,
        image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
      }
    ];
    
    res.json({
      success: true,
      data: fallbackData,
      count: fallbackData.length,
      source: 'fallback'
    });
  }
};

// Entertainment Services
export const getEntertainment: RequestHandler = async (req, res) => {
  try {
    const { category, location } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM Entertainment WHERE is_active = 1';
    const request = connection.request();
    
    if (category) {
      query += ' AND category = @category';
      request.input('category', category);
    }
    
    if (location) {
      query += ' AND location LIKE @location';
      request.input('location', `%${location}%`);
    }
    
    query += ' ORDER BY rating DESC, name ASC';
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback data');
    
    const fallbackData = [
      {
        id: 1,
        name: "Inox Cinemas - Manipal",
        description: "Latest movies with premium viewing experience",
        category: "cinema",
        location: "Manipal",
        address: "Manipal Centre Mall, Tiger Circle",
        phone: "0820-2570345",
        opening_hours: "9:00 AM - 12:00 AM",
        activities: JSON.stringify(["Latest Movies", "IMAX Experience", "Dolby Atmos", "Recliners"]),
        ticket_price: 150,
        age_group: "All ages",
        rating: 4.2,
        total_reviews: 678,
        image_url: "https://images.unsplash.com/photo-1489185078254-c3365d6e359f?w=600&h=400&fit=crop"
      },
      {
        id: 2,
        name: "Malpe Beach Water Sports",
        description: "Adventure water sports and beach activities",
        category: "outdoor_activity",
        location: "Malpe",
        address: "Malpe Beach, Karnataka",
        phone: "0820-2532023",
        opening_hours: "8:00 AM - 6:00 PM",
        activities: JSON.stringify(["Jet Ski", "Parasailing", "Banana Boat", "Speed Boat"]),
        ticket_price: 500,
        age_group: "12+ years",
        rating: 4.4,
        total_reviews: 234,
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
      },
      {
        id: 3,
        name: "Kaup Lighthouse Trek",
        description: "Historical lighthouse with panoramic coastal views",
        category: "outdoor_activity",
        location: "Kaup",
        address: "Kaup Beach, Karnataka",
        phone: "0820-2533001",
        opening_hours: "6:00 AM - 6:00 PM",
        activities: JSON.stringify(["Lighthouse Climb", "Beach Walk", "Photography", "Sunset Views"]),
        ticket_price: 25,
        age_group: "All ages",
        rating: 4.6,
        total_reviews: 445,
        image_url: "https://images.unsplash.com/photo-1471919743851-c4df8b6ee130?w=600&h=400&fit=crop"
      }
    ];
    
    res.json({
      success: true,
      data: fallbackData,
      count: fallbackData.length,
      source: 'fallback'
    });
  }
};

// Event Management Services
export const getEventManagement: RequestHandler = async (req, res) => {
  try {
    const { category, location } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM EventManagement WHERE is_active = 1';
    const request = connection.request();
    
    if (category) {
      query += ' AND category = @category';
      request.input('category', category);
    }
    
    if (location) {
      query += ' AND location LIKE @location';
      request.input('location', `%${location}%`);
    }
    
    query += ' ORDER BY rating DESC, name ASC';
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback data');
    
    const fallbackData = [
      {
        id: 1,
        name: "Coastal Weddings & Events",
        description: "Traditional coastal Karnataka wedding specialists",
        category: "wedding",
        location: "Udupi",
        phone: "0820-2520089",
        email: "info@coastalweddings.com",
        services: JSON.stringify(["Traditional Ceremonies", "Catering", "Decoration", "Photography", "Venue Management"]),
        package_details: "Complete wedding packages from ₹2L to ₹10L",
        price_range: "₹200,000 - ₹1,000,000",
        rating: 4.7,
        total_reviews: 89,
        experience_years: 12,
        capacity_range: "50-1000 guests"
      },
      {
        id: 2,
        name: "Corporate Events Udupi",
        description: "Professional corporate event management services",
        category: "corporate",
        location: "Manipal",
        phone: "0820-2570456",
        email: "events@corporateudupi.com",
        services: JSON.stringify(["Conference Management", "Team Building", "Product Launches", "Annual Functions"]),
        package_details: "Customized corporate packages",
        price_range: "₹50,000 - ₹500,000",
        rating: 4.3,
        total_reviews: 67,
        experience_years: 8,
        capacity_range: "20-500 guests"
      }
    ];
    
    res.json({
      success: true,
      data: fallbackData,
      count: fallbackData.length,
      source: 'fallback'
    });
  }
};

// Other Services
export const getOtherServices: RequestHandler = async (req, res) => {
  try {
    const { category, location } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM OtherServices WHERE is_active = 1';
    const request = connection.request();
    
    if (category) {
      query += ' AND category = @category';
      request.input('category', category);
    }
    
    if (location) {
      query += ' AND location LIKE @location';
      request.input('location', `%${location}%`);
    }
    
    query += ' ORDER BY rating DESC, name ASC';
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback data');
    
    const fallbackData = [
      {
        id: 1,
        name: "Udupi Catering Services",
        description: "Traditional South Indian catering for all occasions",
        category: "catering",
        location: "Udupi",
        phone: "9845123456",
        email: "caterudupi@gmail.com",
        services: JSON.stringify(["Traditional Meals", "Wedding Catering", "Corporate Lunch", "Event Catering"]),
        availability: "24/7 with advance booking",
        hourly_rate: 500,
        fixed_rate: 150,
        rating: 4.5,
        total_reviews: 234,
        experience_years: 15,
        emergency_available: false
      },
      {
        id: 2,
        name: "Quick Fix Electricians",
        description: "Professional electrical services across Udupi-Manipal",
        category: "electrician",
        location: "Udupi-Manipal",
        phone: "9876543210",
        services: JSON.stringify(["Wiring", "Appliance Repair", "Installation", "Emergency Services"]),
        availability: "24/7 Emergency Available",
        hourly_rate: 300,
        rating: 4.2,
        total_reviews: 156,
        experience_years: 10,
        certifications: JSON.stringify(["Licensed Electrician", "Safety Certified"]),
        emergency_available: true
      }
    ];
    
    res.json({
      success: true,
      data: fallbackData,
      count: fallbackData.length,
      source: 'fallback'
    });
  }
};
