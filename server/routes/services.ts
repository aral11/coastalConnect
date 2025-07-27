import { RequestHandler } from "express";

// Generate sample service listings for a category
function generateServiceListings(categoryId: string, count: number) {
  const serviceData: { [key: string]: any[] } = {
    'arts-history': [
      {
        id: 1,
        name: 'Udupi Krishna Temple Museum',
        description: 'Ancient temple museum showcasing traditional art and artifacts',
        category: 'Museum',
        location: 'Udupi',
        address: 'Krishna Temple Complex, Udupi',
        rating: 4.6,
        total_reviews: 245,
        phone: '+91 8202 523456',
        opening_hours: '6:00 AM - 9:00 PM',
        price_range: '₹50 - ₹100',
        services: 'Guided tours, Cultural shows',
        image_url: 'https://images.unsplash.com/photo-1580974928064-f0aeef70895a?w=400&h=300&fit=crop'
      },
      {
        id: 2,
        name: 'Manipal Heritage Village',
        description: 'Experience traditional coastal Karnataka culture and heritage',
        category: 'Heritage Site',
        location: 'Manipal',
        address: 'Heritage Village Road, Manipal',
        rating: 4.3,
        total_reviews: 128,
        phone: '+91 8202 923456',
        opening_hours: '9:00 AM - 6:00 PM',
        price_range: '₹100 - ₹200',
        services: 'Cultural performances, Art workshops',
        image_url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d6d4c7?w=400&h=300&fit=crop'
      }
    ],
    'beauty-wellness': [
      {
        id: 1,
        name: 'Coastal Spa & Wellness',
        description: 'Luxury spa offering traditional Ayurvedic treatments',
        category: 'Spa',
        location: 'Udupi',
        address: 'Service Road, Udupi',
        rating: 4.5,
        total_reviews: 186,
        phone: '+91 8202 234567',
        opening_hours: '9:00 AM - 8:00 PM',
        price_range: '₹1000 - ₹3000',
        services: 'Ayurvedic massage, Facials, Body treatments',
        image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop'
      },
      {
        id: 2,
        name: 'Elite Beauty Salon',
        description: 'Modern beauty salon with expert stylists',
        category: 'Salon',
        location: 'Manipal',
        address: 'Tiger Circle, Manipal',
        rating: 4.2,
        total_reviews: 94,
        phone: '+91 8202 345678',
        opening_hours: '10:00 AM - 7:00 PM',
        price_range: '₹500 - ₹2000',
        services: 'Hair styling, Makeup, Nail art',
        image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'
      }
    ],
    'nightlife': [
      {
        id: 1,
        name: 'Ocean View Lounge',
        description: 'Beachside lounge with live music and great ambiance',
        category: 'Lounge',
        location: 'Malpe',
        address: 'Malpe Beach Road',
        rating: 4.1,
        total_reviews: 156,
        phone: '+91 8202 456789',
        opening_hours: '6:00 PM - 1:00 AM',
        price_range: '₹800 - ₹2000',
        services: 'Live music, DJ nights, Cocktails',
        image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop'
      }
    ],
    'shopping': [
      {
        id: 1,
        name: 'Udupi Traditional Market',
        description: 'Local market for traditional crafts and spices',
        category: 'Market',
        location: 'Udupi',
        address: 'Market Street, Udupi',
        rating: 4.0,
        total_reviews: 78,
        phone: '+91 8202 567890',
        opening_hours: '8:00 AM - 8:00 PM',
        price_range: '₹100 - ₹1000',
        services: 'Local crafts, Spices, Traditional items',
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
      }
    ],
    'entertainment': [
      {
        id: 1,
        name: 'Adventure Sports Center',
        description: 'Water sports and adventure activities',
        category: 'Adventure',
        location: 'Malpe',
        address: 'Malpe Beach, Udupi',
        rating: 4.4,
        total_reviews: 203,
        phone: '+91 8202 678901',
        opening_hours: '8:00 AM - 6:00 PM',
        price_range: '₹500 - ₹2000',
        services: 'Jet skiing, Parasailing, Banana boat',
        image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop'
      }
    ],
    'event-management': [
      {
        id: 1,
        name: 'Coastal Events & Weddings',
        description: 'Complete event management for weddings and celebrations',
        category: 'Event Planning',
        location: 'Udupi',
        address: 'Event Plaza, Udupi',
        rating: 4.7,
        total_reviews: 67,
        phone: '+91 8202 789012',
        opening_hours: '9:00 AM - 6:00 PM',
        price_range: '₹50000 - ₹500000',
        services: 'Wedding planning, Corporate events, Catering',
        image_url: 'https://images.unsplash.com/photo-1519167758481-83f29c81c2e2?w=400&h=300&fit=crop'
      }
    ],
    'other-services': [
      {
        id: 1,
        name: 'Quick Fix Services',
        description: 'Home repair and maintenance services',
        category: 'Home Services',
        location: 'Udupi',
        address: 'Service available across Udupi',
        rating: 4.0,
        total_reviews: 45,
        phone: '+91 8202 890123',
        opening_hours: '8:00 AM - 8:00 PM',
        price_range: '₹200 - ₹1000',
        services: 'Plumbing, Electrical, Carpentry',
        image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop'
      }
    ]
  };

  // Return the services for the category, or generate generic ones if not found
  if (serviceData[categoryId]) {
    return serviceData[categoryId];
  }

  // Generate generic services if category not found in data
  return Array.from({ length: Math.min(count, 5) }, (_, i) => ({
    id: i + 1,
    name: `Service Provider ${i + 1}`,
    description: `Professional service provider in the ${categoryId} category`,
    category: categoryId,
    location: 'Udupi',
    rating: 4.0 + Math.random(),
    total_reviews: Math.floor(Math.random() * 100) + 20,
    phone: '+91 8202 000000',
    opening_hours: '9:00 AM - 6:00 PM',
    price_range: '₹500 - ₹2000',
    image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
  }));
}

// Get service categories
export const getServiceCategories: RequestHandler = async (req, res) => {
  try {
    // In a production app, this would come from a database
    const serviceCategories = [
      {
        id: 'homestays',
        title: 'HOMESTAYS',
        description: 'AUTHENTIC LOCAL STAYS',
        icon: 'Bed',
        link: '/homestays',
        color: 'from-blue-500 to-blue-600',
        offer: 'UPTO 40% OFF',
        active: true,
        order: 1,
        count: 15,
        serviceCount: 15,
        averageRating: 4.6,
        priceRange: '₹1500-3000',
        topServices: ['Heritage Homes', 'Beachside Stay', 'Traditional Experience']
      },
      {
        id: 'eateries',
        title: 'RESTAURANTS',
        description: 'LOCAL DINING & CUISINE',
        icon: 'ChefHat',
        link: '/eateries',
        color: 'from-green-500 to-green-600',
        offer: 'UPTO 50% OFF',
        active: true,
        order: 2,
        count: 23,
        serviceCount: 23,
        averageRating: 4.5,
        priceRange: '₹200-500',
        topServices: ['Udupi Cuisine', 'South Indian', 'Coastal Seafood']
      },
      {
        id: 'drivers',
        title: 'TRANSPORT',
        description: 'LOCAL DRIVERS & RIDES',
        icon: 'Car',
        link: '/drivers',
        color: 'from-purple-500 to-purple-600',
        offer: 'UPTO 30% OFF',
        active: true,
        order: 3,
        count: 12,
        serviceCount: 12,
        averageRating: 4.7,
        priceRange: '₹300-800',
        topServices: ['Local Tours', 'Airport Transfer', 'City Rides']
      },
      {
        id: 'creators',
        title: 'CREATORS',
        description: 'LOCAL CONTENT & GUIDES',
        icon: 'Camera',
        link: '/creators',
        color: 'from-pink-500 to-pink-600',
        offer: 'EXPLORE NOW',
        active: true,
        order: 4,
        count: 8
      },
      {
        id: 'events',
        title: 'EVENTS',
        description: 'LOCAL EVENTS & ACTIVITIES',
        icon: 'Calendar',
        link: '/events',
        color: 'from-indigo-500 to-indigo-600',
        offer: 'BOOK NOW',
        active: true,
        order: 5,
        count: 5
      },
      {
        id: 'services',
        title: 'SERVICES',
        description: 'LOCAL BUSINESS SERVICES',
        icon: 'Store',
        link: '/services',
        color: 'from-teal-500 to-teal-600',
        offer: 'DISCOVER',
        active: true,
        order: 6,
        count: 18
      }
    ];

    // Filter only active categories and sort by order
    const activeCategories = serviceCategories
      .filter(category => category.active)
      .sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: activeCategories,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching service categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get specific service category
export const getServiceCategory: RequestHandler = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // This would come from database in production
    const serviceCategories = [
      {
        id: 'homestays',
        title: 'Homestays',
        description: 'Experience authentic Udupi hospitality in traditional family homes',
        icon: 'Bed',
        features: ['Home-cooked meals', 'Family atmosphere', 'Local experiences', 'Authentic hospitality'],
        totalCount: 15,
        averagePrice: 2500,
        averageRating: 4.5
      },
      {
        id: 'eateries',
        title: 'Restaurants',
        description: 'Discover authentic local cuisine with traditional Udupi flavors',
        icon: 'ChefHat',
        features: ['Traditional recipes', 'Fresh ingredients', 'Local specialties', 'Authentic taste'],
        totalCount: 23,
        averagePrice: 450,
        averageRating: 4.3
      },
      {
        id: 'drivers',
        title: 'Local Drivers',
        description: 'Professional local drivers who know coastal Karnataka',
        icon: 'Car',
        features: ['Local knowledge', 'Verified drivers', 'Reasonable rates', 'Safe travel'],
        totalCount: 12,
        averagePrice: 350,
        averageRating: 4.6
      },
      {
        id: 'creators',
        title: 'Content Creators',
        description: 'Talented local creators showcasing coastal Karnataka',
        icon: 'Camera',
        features: ['Local insights', 'Creative content', 'Cultural stories', 'Hidden gems'],
        totalCount: 8,
        averagePrice: 0,
        averageRating: 4.7
      },
      {
        id: 'arts-history',
        title: 'Arts & History',
        description: 'Museums, Heritage Sites, Cultural Events & Traditional Art Forms',
        icon: 'Palette',
        features: ['Cultural heritage', 'Traditional art forms', 'Historical sites', 'Local museums'],
        totalCount: 10,
        averagePrice: 150,
        averageRating: 4.4
      },
      {
        id: 'beauty-wellness',
        title: 'Beauty & Wellness',
        description: 'Salons, Spas, Gyms & Ayurvedic Centers',
        icon: 'Sparkles',
        features: ['Professional services', 'Ayurvedic treatments', 'Modern facilities', 'Expert staff'],
        totalCount: 18,
        averagePrice: 800,
        averageRating: 4.2
      },
      {
        id: 'nightlife',
        title: 'Nightlife',
        description: 'Bars, Pubs, Clubs & Entertainment Venues',
        icon: 'Music',
        features: ['Live music', 'Good ambiance', 'Quality drinks', 'Entertainment'],
        totalCount: 6,
        averagePrice: 1200,
        averageRating: 4.0
      },
      {
        id: 'shopping',
        title: 'Shopping',
        description: 'Markets, Stores, Boutiques & Local Crafts',
        icon: 'ShoppingBag',
        features: ['Local crafts', 'Traditional items', 'Modern stores', 'Good variety'],
        totalCount: 25,
        averagePrice: 500,
        averageRating: 4.1
      },
      {
        id: 'entertainment',
        title: 'Entertainment',
        description: 'Cinemas, Festivals, Activities & Outdoor Adventures',
        icon: 'Camera',
        features: ['Outdoor activities', 'Cultural events', 'Adventure sports', 'Entertainment'],
        totalCount: 14,
        averagePrice: 300,
        averageRating: 4.3
      },
      {
        id: 'event-management',
        title: 'Event Management',
        description: 'Weddings, Parties, Corporate Events & Celebrations',
        icon: 'PartyPopper',
        features: ['Professional planning', 'Full-service events', 'Custom packages', 'Expert coordination'],
        totalCount: 8,
        averagePrice: 15000,
        averageRating: 4.6
      },
      {
        id: 'other-services',
        title: 'Other Services',
        description: 'Caterers, Plumbers, Electricians & Essential Services',
        icon: 'Wrench',
        features: ['Essential services', 'Professional work', 'Reliable providers', 'Quick response'],
        totalCount: 20,
        averagePrice: 400,
        averageRating: 4.0
      }
    ];

    const category = serviceCategories.find(cat => cat.id === categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found'
      });
    }

    // Generate sample service listings for the category
    const serviceListings = generateServiceListings(categoryId, category.totalCount);

    res.json({
      success: true,
      data: {
        category: category,
        services: serviceListings,
        total: serviceListings.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching service category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
