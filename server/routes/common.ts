import { RequestHandler } from 'express';

// Categories for services and creators
export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = {
      services: [
        { id: 'homestays', name: 'Homestays', icon: 'Bed', color: 'blue', description: 'Authentic local stays' },
        { id: 'eateries', name: 'Eateries', icon: 'Utensils', color: 'orange', description: 'Local food experiences' },
        { id: 'drivers', name: 'Drivers', icon: 'Car', color: 'green', description: 'Transportation services' },
        { id: 'creators', name: 'Local Creators', icon: 'Camera', color: 'purple', description: 'Content creators & influencers' },
        { id: 'beauty-wellness', name: 'Beauty & Wellness', icon: 'Sparkles', color: 'pink', description: 'Beauty and wellness services' },
        { id: 'event-management', name: 'Event Management', icon: 'Calendar', color: 'red', description: 'Event planning services' },
        { id: 'arts-history', name: 'Arts & History', icon: 'Palette', color: 'indigo', description: 'Cultural experiences' },
        { id: 'nightlife', name: 'Nightlife', icon: 'Music', color: 'violet', description: 'Entertainment venues' },
        { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'yellow', description: 'Local markets & stores' },
        { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: 'cyan', description: 'Fun activities' },
        { id: 'other-services', name: 'Other Services', icon: 'Star', color: 'gray', description: 'Miscellaneous services' }
      ],
      creators: [
        { id: 'photography', name: 'Photography', count: 15 },
        { id: 'food', name: 'Food & Dining', count: 23 },
        { id: 'travel', name: 'Travel & Adventure', count: 18 },
        { id: 'lifestyle', name: 'Lifestyle', count: 12 },
        { id: 'culture', name: 'Culture & Heritage', count: 8 },
        { id: 'fashion', name: 'Fashion', count: 10 }
      ],
      eateries: [
        { id: 'all', name: 'All Cuisines', count: 0 },
        { id: 'coastal', name: 'Coastal Karnataka', count: 24 },
        { id: 'north-indian', name: 'North Indian', count: 18 },
        { id: 'south-indian', name: 'South Indian', count: 32 },
        { id: 'chinese', name: 'Chinese', count: 12 },
        { id: 'continental', name: 'Continental', count: 8 },
        { id: 'seafood', name: 'Seafood', count: 28 },
        { id: 'vegetarian', name: 'Vegetarian', count: 22 },
        { id: 'street-food', name: 'Street Food', count: 15 },
        { id: 'desserts', name: 'Desserts & Sweets', count: 11 }
      ]
    };

    const { type } = req.query;
    if (type && categories[type as keyof typeof categories]) {
      res.json({
        success: true,
        data: categories[type as keyof typeof categories],
        type
      });
    } else {
      res.json({
        success: true,
        data: categories
      });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
};

// Locations for filters and dropdowns
export const getLocations: RequestHandler = async (req, res) => {
  try {
    const locations = [
      {
        id: 'mangalore',
        name: 'Mangalore',
        state: 'Karnataka',
        country: 'India',
        coordinates: { lat: 12.9141, lng: 74.8560 },
        popular: true,
        description: 'Major coastal city',
        nearbyPlaces: ['Panambur Beach', 'Tannirbhavi Beach', 'Sultan Battery']
      },
      {
        id: 'udupi',
        name: 'Udupi',
        state: 'Karnataka', 
        country: 'India',
        coordinates: { lat: 13.3409, lng: 74.7421 },
        popular: true,
        description: 'Temple town and culinary hub',
        nearbyPlaces: ['Malpe Beach', 'St. Mary\'s Island', 'Krishna Temple']
      },
      {
        id: 'karwar',
        name: 'Karwar',
        state: 'Karnataka',
        country: 'India',
        coordinates: { lat: 14.8142, lng: 74.1294 },
        popular: true,
        description: 'Northern coastal gem',
        nearbyPlaces: ['Devbagh Beach', 'Kurumgad Island', 'Sadashivgad Fort']
      },
      {
        id: 'gokarna',
        name: 'Gokarna',
        state: 'Karnataka',
        country: 'India',
        coordinates: { lat: 14.5492, lng: 74.3192 },
        popular: true,
        description: 'Spiritual and beach destination',
        nearbyPlaces: ['Om Beach', 'Kudle Beach', 'Half Moon Beach']
      },
      {
        id: 'manipal',
        name: 'Manipal',
        state: 'Karnataka',
        country: 'India',
        coordinates: { lat: 13.3447, lng: 74.7869 },
        popular: false,
        description: 'Educational hub',
        nearbyPlaces: ['Manipal University', 'End Point', 'Tiger Circle']
      },
      {
        id: 'kundapura',
        name: 'Kundapura',
        state: 'Karnataka',
        country: 'India',
        coordinates: { lat: 13.6267, lng: 74.6927 },
        popular: false,
        description: 'Coastal town',
        nearbyPlaces: ['Kodi Beach', 'Anegudde Temple', 'Trasi Beach']
      },
      {
        id: 'bhatkal',
        name: 'Bhatkal',
        state: 'Karnataka',
        country: 'India',
        coordinates: { lat: 13.9619, lng: 74.5626 },
        popular: false,
        description: 'Historic port town',
        nearbyPlaces: ['Bhatkal Beach', 'Jama Masjid', 'Murudeshwar']
      },
      {
        id: 'murudeshwar',
        name: 'Murudeshwar',
        state: 'Karnataka',
        country: 'India',
        coordinates: { lat: 14.0942, lng: 74.4844 },
        popular: true,
        description: 'Temple and beach destination',
        nearbyPlaces: ['Murudeshwar Temple', 'Netrani Island', 'Raja Gopura']
      }
    ];

    const { popular, search } = req.query;
    
    let filteredLocations = locations;
    
    if (popular === 'true') {
      filteredLocations = locations.filter(loc => loc.popular);
    }
    
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredLocations = filteredLocations.filter(loc => 
        loc.name.toLowerCase().includes(searchTerm) ||
        loc.description.toLowerCase().includes(searchTerm) ||
        loc.nearbyPlaces.some(place => place.toLowerCase().includes(searchTerm))
      );
    }

    res.json({
      success: true,
      data: filteredLocations,
      total: filteredLocations.length
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch locations'
    });
  }
};

// Price ranges for filters
export const getPriceRanges: RequestHandler = async (req, res) => {
  try {
    const priceRanges = {
      accommodation: [
        { id: 'budget', label: 'Budget', min: 0, max: 2000, description: '₹0 - ₹2,000' },
        { id: 'mid-range', label: 'Mid-range', min: 2000, max: 5000, description: '₹2,000 - ₹5,000' },
        { id: 'premium', label: 'Premium', min: 5000, max: 10000, description: '₹5,000 - ₹10,000' },
        { id: 'luxury', label: 'Luxury', min: 10000, max: null, description: '₹10,000+' }
      ],
      dining: [
        { id: 'budget', label: 'Budget', min: 0, max: 500, description: '₹0 - ₹500' },
        { id: 'mid-range', label: 'Mid-range', min: 500, max: 1500, description: '₹500 - ₹1,500' },
        { id: 'fine-dining', label: 'Fine Dining', min: 1500, max: null, description: '₹1,500+' }
      ],
      services: [
        { id: 'basic', label: 'Basic', min: 0, max: 1000, description: '₹0 - ₹1,000' },
        { id: 'standard', label: 'Standard', min: 1000, max: 3000, description: '₹1,000 - ₹3,000' },
        { id: 'premium', label: 'Premium', min: 3000, max: 8000, description: '₹3,000 - ₹8,000' },
        { id: 'luxury', label: 'Luxury', min: 8000, max: null, description: '₹8,000+' }
      ]
    };

    const { type } = req.query;
    if (type && priceRanges[type as keyof typeof priceRanges]) {
      res.json({
        success: true,
        data: priceRanges[type as keyof typeof priceRanges],
        type
      });
    } else {
      res.json({
        success: true,
        data: priceRanges
      });
    }
  } catch (error) {
    console.error('Error fetching price ranges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price ranges'
    });
  }
};

// Feature filters
export const getFeatures: RequestHandler = async (req, res) => {
  try {
    const features = {
      accommodation: [
        { id: 'wifi', name: 'Free WiFi', icon: 'Wifi' },
        { id: 'parking', name: 'Free Parking', icon: 'Car' },
        { id: 'breakfast', name: 'Breakfast Included', icon: 'Coffee' },
        { id: 'ac', name: 'Air Conditioning', icon: 'Snowflake' },
        { id: 'pool', name: 'Swimming Pool', icon: 'Waves' },
        { id: 'beach-access', name: 'Beach Access', icon: 'Umbrella' },
        { id: 'restaurant', name: 'Restaurant', icon: 'Utensils' },
        { id: 'spa', name: 'Spa Services', icon: 'Sparkles' },
        { id: 'gym', name: 'Fitness Center', icon: 'Dumbbell' },
        { id: 'pet-friendly', name: 'Pet Friendly', icon: 'Heart' }
      ],
      dining: [
        { id: 'veg', name: 'Vegetarian Options', icon: 'Leaf' },
        { id: 'vegan', name: 'Vegan Options', icon: 'Sprout' },
        { id: 'halal', name: 'Halal Food', icon: 'Check' },
        { id: 'outdoor-seating', name: 'Outdoor Seating', icon: 'Trees' },
        { id: 'delivery', name: 'Home Delivery', icon: 'Truck' },
        { id: 'takeaway', name: 'Takeaway', icon: 'ShoppingBag' },
        { id: 'live-music', name: 'Live Music', icon: 'Music' },
        { id: 'bar', name: 'Bar/Drinks', icon: 'Wine' },
        { id: 'family-friendly', name: 'Family Friendly', icon: 'Users' },
        { id: 'romantic', name: 'Romantic Setting', icon: 'Heart' }
      ],
      services: [
        { id: 'instant-booking', name: 'Instant Booking', icon: 'Zap' },
        { id: 'cancellation', name: 'Free Cancellation', icon: 'RotateCcw' },
        { id: 'pickup', name: 'Pickup Service', icon: 'MapPin' },
        { id: 'group-booking', name: 'Group Bookings', icon: 'Users' },
        { id: 'equipment', name: 'Equipment Provided', icon: 'Package' },
        { id: 'guide', name: 'Guide Included', icon: 'User' },
        { id: 'insurance', name: 'Insurance Covered', icon: 'Shield' },
        { id: 'photos', name: 'Photos Included', icon: 'Camera' }
      ]
    };

    const { type } = req.query;
    if (type && features[type as keyof typeof features]) {
      res.json({
        success: true,
        data: features[type as keyof typeof features],
        type
      });
    } else {
      res.json({
        success: true,
        data: features
      });
    }
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch features'
    });
  }
};

// Application configuration and settings
export const getAppConfig: RequestHandler = async (req, res) => {
  try {
    const config = {
      app: {
        name: 'Coastal Connect',
        tagline: 'Discover Coastal Karnataka',
        description: 'Your gateway to authentic coastal experiences',
        version: '2.0.0',
        supportEmail: 'hello@coastalconnect.in',
        supportPhone: '+91 9876543210'
      },
      business: {
        hours: {
          weekdays: '9:00 AM - 6:00 PM',
          saturday: '10:00 AM - 4:00 PM', 
          sunday: 'Closed'
        },
        address: 'Near Light House Hill Road, Mangalore - 575001',
        gst: 'GST123456789'
      },
      features: {
        multiLanguage: true,
        paymentGateway: true,
        notifications: true,
        reviews: true,
        bookingEngine: true,
        gpsTracking: true
      },
      social: {
        facebook: 'https://facebook.com/coastalconnect',
        instagram: 'https://instagram.com/coastalconnect',
        twitter: 'https://twitter.com/coastalconnect',
        youtube: 'https://youtube.com/coastalconnect'
      },
      payment: {
        methods: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'],
        currency: 'INR',
        gateway: 'Razorpay'
      }
    };

    res.json({
      success: true,
      data: config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching app config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch app configuration'
    });
  }
};
