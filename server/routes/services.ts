import { RequestHandler } from "express";

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
        count: 15
      },
      {
        id: 'eateries',
        title: 'EATERIES',
        description: 'LOCAL CUISINE & DINING',
        icon: 'ChefHat',
        link: '/eateries',
        color: 'from-green-500 to-green-600',
        offer: 'UPTO 50% OFF',
        active: true,
        order: 2,
        count: 23
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
        count: 12
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
        title: 'Eateries',
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
      }
    ];

    const category = serviceCategories.find(cat => cat.id === categoryId);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Service category not found'
      });
    }

    res.json({
      success: true,
      data: category,
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
