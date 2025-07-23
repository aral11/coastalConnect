import { RequestHandler } from "express";
import { getConnection } from "../db/connection";

export interface Creator {
  id: number;
  name: string;
  title: string;
  description: string;
  instagram_handle: string;
  instagram_url: string;
  profile_image: string;
  cover_image?: string;
  followers_count?: number;
  specialty: string;
  location: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  featured_works: string[];
  is_verified: boolean;
  is_active: boolean;
  created_at?: Date;
}

// Fallback data for local creators including shutterboxfilms_official
const mockCreators: Creator[] = [
  {
    id: 1,
    name: "Shutterbox Films",
    title: "Professional Photographer & Videographer",
    description: "Capturing the essence of Coastal Karnataka through stunning visuals. Specializing in wedding photography, travel content, and coastal landscapes.",
    instagram_handle: "shutterboxfilms_official",
    instagram_url: "https://instagram.com/shutterboxfilms_official",
    profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    cover_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    followers_count: 15200,
    specialty: "Photography & Videography",
    location: "Udupi, Karnataka",
    contact_email: "hello@shutterboxfilms.com",
    contact_phone: "+91 98765 43210",
    website_url: "https://shutterboxfilms.com",
    featured_works: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop"
    ],
    is_verified: true,
    is_active: true
  },
  {
    id: 2,
    name: "Priya Coastal Arts",
    title: "Traditional Art & Handicrafts",
    description: "Preserving and promoting traditional Udupi art forms including Yakshagana masks, temple art, and coastal handicrafts.",
    instagram_handle: "priya_coastal_arts",
    instagram_url: "https://instagram.com/priya_coastal_arts",
    profile_image: "https://images.unsplash.com/photo-1494790108755-2616b612b131?w=300&h=300&fit=crop&crop=face",
    cover_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    followers_count: 8750,
    specialty: "Traditional Arts & Crafts",
    location: "Udupi, Karnataka",
    contact_email: "priya@coastalarts.in",
    featured_works: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop"
    ],
    is_verified: true,
    is_active: true
  },
  {
    id: 3,
    name: "Coastal Flavor Stories",
    title: "Food Blogger & Culinary Explorer",
    description: "Documenting authentic Udupi cuisine and coastal Karnataka food culture. From temple prasadam to street food gems.",
    instagram_handle: "coastal_flavor_stories",
    instagram_url: "https://instagram.com/coastal_flavor_stories",
    profile_image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    cover_image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop",
    followers_count: 12500,
    specialty: "Food & Culinary Content",
    location: "Manipal, Udupi",
    contact_email: "hello@coastalflavorstories.com",
    featured_works: [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop"
    ],
    is_verified: true,
    is_active: true
  },
  {
    id: 4,
    name: "Beach Vibes Karnataka",
    title: "Travel Content Creator",
    description: "Showcasing hidden gems and must-visit spots across coastal Karnataka. Your guide to unexplored beaches and local experiences.",
    instagram_handle: "beach_vibes_karnataka",
    instagram_url: "https://instagram.com/beach_vibes_karnataka",
    profile_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    cover_image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=400&fit=crop",
    followers_count: 18700,
    specialty: "Travel & Lifestyle",
    location: "Malpe, Udupi",
    contact_email: "info@beachvibeskarnataka.com",
    website_url: "https://beachvibeskarnataka.com",
    featured_works: [
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop"
    ],
    is_verified: true,
    is_active: true
  },
  {
    id: 5,
    name: "Udupi Traditions",
    title: "Cultural Heritage Documenter",
    description: "Preserving and sharing the rich cultural heritage of Udupi through photography and storytelling. Temple festivals, traditions, and local customs.",
    instagram_handle: "udupi_traditions",
    instagram_url: "https://instagram.com/udupi_traditions",
    profile_image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop&crop=face",
    cover_image: "https://images.unsplash.com/photo-1588678401-c846c6021369?w=800&h=400&fit=crop",
    followers_count: 9200,
    specialty: "Cultural Heritage & Traditions",
    location: "Udupi Temple Area",
    contact_email: "heritage@udupitraditions.org",
    featured_works: [
      "https://images.unsplash.com/photo-1588678401-c846c6021369?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1582632431511-26040d79dfa7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1580488142642-40af9b3dca64?w=400&h=300&fit=crop"
    ],
    is_verified: false,
    is_active: true
  }
];

export const getCreators: RequestHandler = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.request().query(`
      SELECT * FROM Creators 
      WHERE is_active = 1 
      ORDER BY followers_count DESC, name ASC
    `);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback creators data');
    res.json({
      success: true,
      data: mockCreators,
      count: mockCreators.length,
      source: 'fallback'
    });
  }
};

export const getCreatorById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const result = await connection.request()
      .input('id', id)
      .query('SELECT * FROM Creators WHERE id = @id AND is_active = 1');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found'
      });
    }
    
    res.json({
      success: true,
      data: result.recordset[0],
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback creator data');
    const creator = mockCreators.find(c => c.id === parseInt(id));
    
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found'
      });
    }
    
    res.json({
      success: true,
      data: creator,
      source: 'fallback'
    });
  }
};

export const searchCreators: RequestHandler = async (req, res) => {
  try {
    const { specialty, location, verified } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM Creators WHERE is_active = 1';
    const request = connection.request();
    
    if (specialty) {
      query += ' AND specialty LIKE @specialty';
      request.input('specialty', `%${specialty}%`);
    }
    
    if (location) {
      query += ' AND location LIKE @location';
      request.input('location', `%${location}%`);
    }
    
    if (verified === 'true') {
      query += ' AND is_verified = 1';
    }
    
    query += ' ORDER BY followers_count DESC, name ASC';
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback search');
    let filteredCreators = [...mockCreators];
    
    if (specialty) {
      filteredCreators = filteredCreators.filter(c => 
        c.specialty.toLowerCase().includes((specialty as string).toLowerCase())
      );
    }
    
    if (location) {
      filteredCreators = filteredCreators.filter(c => 
        c.location.toLowerCase().includes((location as string).toLowerCase())
      );
    }
    
    if (verified === 'true') {
      filteredCreators = filteredCreators.filter(c => c.is_verified);
    }
    
    // Sort by followers DESC, then name ASC
    filteredCreators.sort((a, b) => {
      if (a.followers_count !== b.followers_count) {
        return (b.followers_count || 0) - (a.followers_count || 0);
      }
      return a.name.localeCompare(b.name);
    });
    
    res.json({
      success: true,
      data: filteredCreators,
      count: filteredCreators.length,
      source: 'fallback'
    });
  }
};
