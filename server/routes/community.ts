import { RequestHandler } from "express";
import { getConnection } from "../db/connection";

// Local Events API
export const getLocalEvents: RequestHandler = async (req, res) => {
  try {
    const { category, date, featured } = req.query;
    const connection = await getConnection();

    // Updated query to show published and approved events, including organizer info
    let query = `
      SELECT le.*, eo.organization_name, eo.contact_person
      FROM LocalEvents le
      LEFT JOIN EventOrganizers eo ON le.organizer_id = eo.id
      WHERE le.status IN ('published', 'approved')
      AND le.admin_approval_status = 'approved'
      AND le.event_date >= CAST(GETDATE() AS DATE)
    `;
    const request = connection.request();

    if (category) {
      query += ' AND le.category = @category';
      request.input('category', category);
    }

    if (date) {
      query += ' AND le.event_date >= @date';
      request.input('date', date);
    }

    if (featured === 'true') {
      query += ' AND le.is_featured = 1';
    }

    query += ' ORDER BY le.event_date ASC, le.start_time ASC';

    const result = await request.query(query);

    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback events data');
    
    // Enhanced fallback data with real-style events - dates dynamically generated
    const today = new Date();
    const getEventDate = (daysFromNow: number) => {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + daysFromNow);
      return eventDate.toISOString().split('T')[0];
    };

    const fallbackData = [
      {
        id: 1,
        title: "Kambala Festival 2024",
        description: "Traditional buffalo race celebrating the rich heritage of coastal Karnataka. Experience the thrill of this centuries-old tradition with cultural performances and local delicacies.",
        category: "kambala",
        location: "Udupi",
        address: "Kambala Ground, Udupi, Karnataka",
        event_date: getEventDate(3),
        start_time: "14:00",
        end_time: "20:00",
        organizer: "Udupi Kambala Committee",
        contact_phone: "0820-2520099",
        contact_email: "info@udupikambala.org",
        entry_fee: 100,
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
        website_url: "https://udupikambala.org",
        capacity: 5000,
        registered_count: 1234,
        is_featured: true,
        status: "upcoming"
      },
      {
        id: 2,
        title: "Malpe Beach Festival",
        description: "Annual beach festival featuring water sports, cultural programs, local food stalls, and live music performances. Perfect for families and adventure enthusiasts.",
        category: "festival",
        location: "Malpe",
        address: "Malpe Beach, Karnataka",
        event_date: "2024-02-10",
        start_time: "16:00",
        end_time: "22:00",
        organizer: "Malpe Tourism Board",
        contact_phone: "0820-2532045",
        contact_email: "events@malpebeach.com",
        entry_fee: 50,
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        capacity: 3000,
        registered_count: 567,
        is_featured: true,
        status: "upcoming"
      },
      {
        id: 3,
        title: "Yakshagana Performance - Ramayana",
        description: "Traditional Yakshagana night performance depicting episodes from Ramayana. Experience this UNESCO recognized art form with elaborate costumes and dramatic storytelling.",
        category: "cultural",
        location: "Udupi",
        address: "MGM College Auditorium, Udupi",
        event_date: "2024-01-20",
        start_time: "19:30",
        end_time: "23:30",
        organizer: "Yakshagana Kendra",
        contact_phone: "0820-2529456",
        contact_email: "info@yakshagana-udupi.org",
        entry_fee: 150,
        image_url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop",
        capacity: 800,
        registered_count: 234,
        is_featured: false,
        status: "upcoming"
      },
      {
        id: 4,
        title: "Paryaya Festival 2024",
        description: "Biennial religious festival where the administration of Sri Krishna Temple changes hands. Witness grand processions, cultural programs, and spiritual celebrations.",
        category: "religious",
        location: "Udupi",
        address: "Sri Krishna Temple, Car Street, Udupi",
        event_date: "2024-01-18",
        start_time: "06:00",
        end_time: "22:00",
        organizer: "Sri Krishna Temple Committee",
        contact_phone: "0820-2520033",
        contact_email: "temple@udupikrishna.org",
        entry_fee: 0,
        image_url: "https://images.unsplash.com/photo-1582632431511-26040d79dfa7?w=600&h=400&fit=crop",
        capacity: 10000,
        registered_count: 0,
        is_featured: true,
        status: "upcoming"
      },
      {
        id: 5,
        title: "Manipal Food Festival",
        description: "Celebrating the diverse culinary heritage of coastal Karnataka with food stalls, cooking competitions, and chef demonstrations.",
        category: "festival",
        location: "Manipal",
        address: "Manipal University Campus, Karnataka",
        event_date: "2024-02-25",
        start_time: "11:00",
        end_time: "21:00",
        organizer: "Manipal Food Association",
        contact_phone: "0820-2570234",
        contact_email: "food@manipalfest.com",
        entry_fee: 75,
        image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
        capacity: 2000,
        registered_count: 456,
        is_featured: false,
        status: "upcoming"
      },
      {
        id: 6,
        title: "Coastal Sports Championship",
        description: "Annual sports meet featuring traditional games, beach volleyball, and water sports. Open for all age groups with prizes and certificates.",
        category: "sports",
        location: "Malpe",
        address: "Malpe Beach Sports Complex",
        event_date: "2024-03-05",
        start_time: "08:00",
        end_time: "18:00",
        organizer: "Coastal Sports Association",
        contact_phone: "0820-2532067",
        contact_email: "sports@coastalkarnataka.com",
        entry_fee: 200,
        image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
        capacity: 1500,
        registered_count: 789,
        is_featured: false,
        status: "upcoming"
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

// Religious Services API
export const getReligiousServices: RequestHandler = async (req, res) => {
  try {
    const { religion, category, location } = req.query;
    const connection = await getConnection();
    
    let query = 'SELECT * FROM ReligiousServices WHERE is_active = 1';
    const request = connection.request();
    
    if (religion) {
      query += ' AND religion = @religion';
      request.input('religion', religion);
    }
    
    if (category) {
      query += ' AND category = @category';
      request.input('category', category);
    }
    
    if (location) {
      query += ' AND location LIKE @location';
      request.input('location', `%${location}%`);
    }
    
    query += ' ORDER BY location ASC, name ASC';
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using fallback religious services data');
    
    const fallbackData = [
      {
        id: 1,
        name: "Sri Krishna Temple",
        description: "Historic temple dedicated to Lord Krishna, famous for Paryaya festival and Dvaita philosophy",
        religion: "hindu",
        category: "temple",
        location: "Udupi",
        address: "Car Street, Udupi, Karnataka 576101",
        phone: "0820-2520033",
        email: "temple@srikrishna-udupi.org",
        morning_timings: "5:30 AM - 1:00 PM",
        evening_timings: "3:00 PM - 9:00 PM",
        special_timings: JSON.stringify({
          "Paryaya Festival": "Extended hours during festival",
          "Ekadashi": "Special poojas at 4:00 AM",
          "Janmashtami": "24 hours open"
        }),
        services: JSON.stringify(["Daily Poojas", "Annadana", "Abhisheka", "Special Darshan", "Wedding Ceremonies", "Sacred Thread Ceremonies"]),
        languages: "Kannada, Tulu, Sanskrit, Hindi, English",
        priest_contact: "Pujari: 9845123456",
        image_url: "https://images.unsplash.com/photo-1582632431511-26040d79dfa7?w=600&h=400&fit=crop",
        website_url: "https://srikrishna-udupi.org"
      },
      {
        id: 2,
        name: "Anantheshwara Temple",
        description: "Ancient Shiva temple with rich history and beautiful architecture",
        religion: "hindu",
        category: "temple",
        location: "Udupi",
        address: "Temple Street, Udupi, Karnataka",
        phone: "0820-2520045",
        morning_timings: "6:00 AM - 12:00 PM",
        evening_timings: "4:00 PM - 8:30 PM",
        special_timings: JSON.stringify({
          "Maha Shivaratri": "All night vigil",
          "Mondays": "Special Abhisheka at 6:00 AM"
        }),
        services: JSON.stringify(["Abhisheka", "Archana", "Pradakshina", "Special Poojas"]),
        languages: "Kannada, Tulu, Sanskrit",
        priest_contact: "Pujari: 9876543210",
        image_url: "https://images.unsplash.com/photo-1588678401-c846c6021369?w=600&h=400&fit=crop"
      },
      {
        id: 3,
        name: "St. Lawrence Church",
        description: "Historic Catholic church serving the Christian community of Udupi",
        religion: "christian",
        category: "church",
        location: "Udupi",
        address: "Church Street, Udupi, Karnataka",
        phone: "0820-2520067",
        email: "stlawrence.udupi@gmail.com",
        morning_timings: "6:00 AM Mass (Weekdays), 7:00 AM & 9:00 AM (Sundays)",
        evening_timings: "6:00 PM Mass (Saturdays), 6:30 PM (Weekdays)",
        special_timings: JSON.stringify({
          "Christmas": "Midnight Mass at 11:30 PM",
          "Easter": "Special services from Good Friday",
          "Feast of St. Lawrence": "Special celebrations in August"
        }),
        services: JSON.stringify(["Daily Mass", "Confession", "Baptism", "Wedding Ceremonies", "Funeral Services", "Youth Ministry"]),
        languages: "English, Kannada, Konkani",
        priest_contact: "Fr. Joseph: 9845678901",
        image_url: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600&h=400&fit=crop",
        website_url: "https://stlawrenceudupi.org"
      },
      {
        id: 4,
        name: "Juma Masjid Udupi",
        description: "Central mosque serving the Muslim community with regular prayers and Islamic education",
        religion: "islam",
        category: "mosque",
        location: "Udupi",
        address: "Mosque Road, Udupi, Karnataka",
        phone: "0820-2520089",
        email: "jumamasjid.udupi@gmail.com",
        morning_timings: "Fajr: 5:30 AM, Dhuhr: 12:30 PM",
        evening_timings: "Asr: 4:30 PM, Maghrib: 6:30 PM, Isha: 7:45 PM",
        special_timings: JSON.stringify({
          "Ramadan": "Iftar at sunset, Tarawih prayers after Isha",
          "Eid": "Special Eid prayers at 8:00 AM",
          "Jumma": "Friday prayers at 1:00 PM"
        }),
        services: JSON.stringify(["Five Daily Prayers", "Jumma Prayers", "Islamic Education", "Nikah Ceremonies", "Janaza Services", "Quran Classes"]),
        languages: "Arabic, Urdu, Kannada, English",
        priest_contact: "Imam: 9876501234",
        image_url: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&h=400&fit=crop"
      },
      {
        id: 5,
        name: "Holy Rosary Church",
        description: "Beautiful church in Manipal serving students and local community",
        religion: "christian",
        category: "church",
        location: "Manipal",
        address: "Manipal, Karnataka",
        phone: "0820-2570123",
        email: "holyrosary.manipal@gmail.com",
        morning_timings: "6:30 AM Mass (Weekdays), 8:00 AM & 9:30 AM (Sundays)",
        evening_timings: "6:00 PM Mass (Saturdays)",
        special_timings: JSON.stringify({
          "Student Masses": "Sunday 7:00 PM for students",
          "Holy Week": "Special services during Easter week"
        }),
        services: JSON.stringify(["Daily Mass", "Student Ministry", "Confession", "Wedding Ceremonies", "Community Events"]),
        languages: "English, Kannada, Hindi",
        priest_contact: "Fr. Michael: 9845987654",
        image_url: "https://images.unsplash.com/photo-1520637836862-4d197d17c0a6?w=600&h=400&fit=crop"
      },
      {
        id: 6,
        name: "Chandramouleshwara Temple",
        description: "Ancient temple dedicated to Lord Shiva with beautiful stone carvings",
        religion: "hindu",
        category: "temple",
        location: "Manipal",
        address: "Manipal, Karnataka",
        phone: "0820-2570089",
        morning_timings: "6:00 AM - 12:00 PM",
        evening_timings: "5:00 PM - 8:00 PM",
        special_timings: JSON.stringify({
          "Shivaratri": "All night prayers",
          "Kartik Mondays": "Special Abhisheka"
        }),
        services: JSON.stringify(["Daily Poojas", "Abhisheka", "Archana", "Pradakshina"]),
        languages: "Kannada, Tulu, Sanskrit",
        priest_contact: "Pujari: 9876123450",
        image_url: "https://images.unsplash.com/photo-1596430464985-0f80a0618fcc?w=600&h=400&fit=crop"
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

// Get Featured Events (for homepage)
export const getFeaturedEvents: RequestHandler = async (req, res) => {
  try {
    const connection = await getConnection();
    
    const query = `
      SELECT TOP 3 * FROM LocalEvents 
      WHERE status = 'upcoming' AND is_featured = 1 
      ORDER BY event_date ASC
    `;
    
    const result = await connection.request().query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      source: 'database'
    });
  } catch (error) {
    console.log('Database not available, using featured events fallback');
    
    // Get first 3 featured events from fallback data
    const allEvents = [
      {
        id: 1,
        title: "Kambala Festival 2024",
        description: "Traditional buffalo race celebrating coastal heritage",
        category: "kambala",
        location: "Udupi",
        event_date: "2024-01-15",
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
        is_featured: true
      },
      {
        id: 2,
        title: "Malpe Beach Festival",
        description: "Annual beach festival with cultural programs",
        category: "festival",
        location: "Malpe",
        event_date: "2024-02-10",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        is_featured: true
      },
      {
        id: 4,
        title: "Paryaya Festival 2024",
        description: "Biennial religious festival at Sri Krishna Temple",
        category: "religious",
        location: "Udupi",
        event_date: "2024-01-18",
        image_url: "https://images.unsplash.com/photo-1582632431511-26040d79dfa7?w=600&h=400&fit=crop",
        is_featured: true
      }
    ];
    
    res.json({
      success: true,
      data: allEvents,
      source: 'fallback'
    });
  }
};

// Search Events
export const searchEvents: RequestHandler = async (req, res) => {
  try {
    const { q, category, location } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const connection = await getConnection();
    
    let query = `
      SELECT * FROM LocalEvents 
      WHERE status = 'upcoming' 
      AND (title LIKE @search OR description LIKE @search OR location LIKE @search)
    `;
    
    const request = connection.request();
    request.input('search', `%${q}%`);
    
    if (category) {
      query += ' AND category = @category';
      request.input('category', category);
    }
    
    if (location) {
      query += ' AND location LIKE @location';
      request.input('location', `%${location}%`);
    }
    
    query += ' ORDER BY event_date ASC';
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      source: 'database'
    });
  } catch (error) {
    console.log('Database search failed, using fallback');
    res.json({
      success: false,
      message: 'Search temporarily unavailable',
      source: 'fallback'
    });
  }
};
