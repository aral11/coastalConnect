import { Router, Request, Response } from 'express';

const router = Router();

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  price?: string;
  image?: string;
  link: string;
}

// Mock data for search results
const mockData: SearchResult[] = [
  // Homestays
  {
    id: 'hs-1',
    title: 'Sea View Homestay',
    description: 'Beautiful homestay with ocean views and traditional coastal cuisine. Family-run property with authentic local experience.',
    category: 'homestays',
    location: 'Malpe Beach, Udupi',
    rating: 4.5,
    reviewCount: 28,
    price: '₹2,500/night',
    link: '/homestays'
  },
  {
    id: 'hs-2',
    title: 'Coconut Grove Homestay',
    description: 'Peaceful homestay surrounded by coconut palms, offering traditional Udupi breakfast and dinner.',
    category: 'homestays',
    location: 'Karkala, Udupi',
    rating: 4.3,
    reviewCount: 15,
    price: '₹2,000/night',
    link: '/homestays'
  },
  {
    id: 'hs-3',
    title: 'Heritage Villa Homestay',
    description: 'Traditional Mangalorean architecture with modern amenities, close to Manipal University.',
    category: 'homestays',
    location: 'Manipal',
    rating: 4.7,
    reviewCount: 42,
    price: '₹3,200/night',
    link: '/homestays'
  },
  
  // Eateries
  {
    id: 'eat-1',
    title: 'Coastal Kitchen Restaurant',
    description: 'Authentic Udupi cuisine and fresh seafood specialties. Famous for ghee roast and fish curry.',
    category: 'eateries',
    location: 'Car Street, Udupi',
    rating: 4.7,
    reviewCount: 156,
    price: '₹300 for two',
    link: '/eateries'
  },
  {
    id: 'eat-2',
    title: 'Malpe Fish Market Restaurant',
    description: 'Fresh catch of the day prepared in traditional coastal style. Must-try prawns masala.',
    category: 'eateries',
    location: 'Malpe Port, Udupi',
    rating: 4.4,
    reviewCount: 89,
    price: '₹450 for two',
    link: '/eateries'
  },
  {
    id: 'eat-3',
    title: 'Woodlands Restaurant',
    description: 'Pure vegetarian restaurant serving authentic South Indian breakfast and meals.',
    category: 'eateries',
    location: 'Manipal',
    rating: 4.2,
    reviewCount: 203,
    price: '₹200 for two',
    link: '/eateries'
  },
  
  // Drivers
  {
    id: 'dr-1',
    title: 'Ravi - Local Driver',
    description: 'Experienced driver with AC car, knows all tourist spots. Available for day trips and airport transfers.',
    category: 'drivers',
    location: 'Udupi',
    rating: 4.8,
    reviewCount: 42,
    price: '₹15/km',
    link: '/drivers'
  },
  {
    id: 'dr-2',
    title: 'Suresh - Tourist Guide Driver',
    description: 'Professional driver cum guide with 10+ years experience. Speaks English, Hindi, Kannada.',
    category: 'drivers',
    location: 'Manipal',
    rating: 4.6,
    reviewCount: 67,
    price: '₹12/km',
    link: '/drivers'
  },
  
  // Creators
  {
    id: 'cr-1',
    title: 'Priya - Wedding Photographer',
    description: 'Professional wedding and event photographer specializing in coastal destinations.',
    category: 'creators',
    location: 'Udupi',
    rating: 4.9,
    reviewCount: 24,
    price: '₹25,000/event',
    link: '/creators'
  },
  {
    id: 'cr-2',
    title: 'Arjun - Content Creator',
    description: 'Social media content creator and travel vlogger. Creates promotional videos for businesses.',
    category: 'creators',
    location: 'Manipal',
    rating: 4.5,
    reviewCount: 18,
    price: '₹5,000/day',
    link: '/creators'
  },
  
  // Services
  {
    id: 'sv-1',
    title: 'Coastal Spa & Wellness',
    description: 'Ayurvedic treatments and massages using traditional coastal herbs and oils.',
    category: 'services',
    location: 'Malpe',
    rating: 4.4,
    reviewCount: 35,
    price: '₹1,500/session',
    link: '/beauty-wellness'
  },
  {
    id: 'sv-2',
    title: 'Beach Adventure Sports',
    description: 'Water sports, parasailing, jet skiing, and banana boat rides at Malpe beach.',
    category: 'services',
    location: 'Malpe Beach',
    rating: 4.6,
    reviewCount: 78,
    price: '₹500/activity',
    link: '/entertainment'
  }
];

// Search endpoint
router.get('/', (req: Request, res: Response) => {
  try {
    const { q, location, category } = req.query;
    const query = (q as string)?.toLowerCase() || '';
    const selectedLocation = (location as string) || '';
    const selectedCategory = (category as string) || 'all';

    let results = mockData;

    // Filter by search query
    if (query) {
      results = results.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      results = results.filter(item => item.category === selectedCategory);
    }

    // Filter by location (loose matching)
    if (selectedLocation) {
      const locationTerms = selectedLocation.toLowerCase().split(',').map(term => term.trim());
      results = results.filter(item => 
        locationTerms.some(term => 
          item.location.toLowerCase().includes(term)
        )
      );
    }

    // Sort by rating (highest first)
    results.sort((a, b) => b.rating - a.rating);

    res.json({
      success: true,
      query,
      location: selectedLocation,
      category: selectedCategory,
      count: results.length,
      results
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      results: []
    });
  }
});

export default router;
