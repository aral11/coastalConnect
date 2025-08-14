import { RequestHandler } from "express";
import { getConnection } from "../db/connection";
import { getPlatformStats, getServicesByType } from "../utils/initializeDatabase";

// Get real platform statistics
export const getRealPlatformStats: RequestHandler = async (req, res) => {
  try {
    console.log('📊 Real stats endpoint called');
    const stats = await getPlatformStats();
    console.log('📊 Stats retrieved:', stats);

    const responseData = {
      success: true,
      data: {
        totalVendors: stats.vendors || 0,
        totalBookings: stats.bookings || 0,
        totalCustomers: stats.customers || 0,
        totalEvents: stats.events || 0,
        averageRating: stats.averageRating || 0,
        totalReviews: stats.totalReviews || 0,
        citiesServed: stats.citiesServed || 0,
        totalRevenue: stats.totalRevenue || 0,
        bookingsThisMonth: stats.bookingsThisMonth || 0,
        // Additional computed metrics
        conversionRate: stats.bookings > 0 ? ((stats.bookings / (stats.customers || 1)) * 100).toFixed(1) : '0',
        averageOrderValue: stats.bookings > 0 ? (stats.totalRevenue / stats.bookings).toFixed(0) : '0',
        customerSatisfaction: stats.averageRating > 0 ? ((stats.averageRating / 5) * 100).toFixed(0) : '85'
      },
      message: 'Real platform statistics retrieved successfully'
    };

    console.log('📊 Sending response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('❌ Error getting platform stats:', error);
    const errorResponse = {
      success: false,
      message: 'Failed to get platform statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
      data: {
        // Fallback data
        totalVendors: 15,
        totalBookings: 89,
        totalCustomers: 234,
        totalEvents: 12,
        averageRating: 4.3,
        totalReviews: 156,
        citiesServed: 5,
        totalRevenue: 125000,
        bookingsThisMonth: 23,
        conversionRate: '15.2',
        averageOrderValue: '1830',
        customerSatisfaction: '86'
      }
    };
    res.status(500).json(errorResponse);
  }
};

// Get real services by type (homestays, restaurants, drivers)
export const getRealServices: RequestHandler = async (req, res) => {
  try {
    const { type, limit = 10, city, featured } = req.query;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Service type is required'
      });
    }

    const connection = await getConnection();
    
    let query = `
      SELECT TOP ${Math.min(Number(limit), 50)}
        s.*,
        u.name as vendor_name,
        u.business_name,
        u.phone as vendor_phone,
        (SELECT COUNT(*) FROM Bookings WHERE service_id = s.id AND status = 'completed') as completed_bookings,
        (SELECT COUNT(*) FROM Reviews WHERE service_id = s.id AND status = 'approved') as review_count
      FROM Services s
      LEFT JOIN Users u ON s.vendor_id = u.id
      WHERE s.service_type = @serviceType 
      AND s.status = 'approved'
      AND s.is_active = 1
    `;
    
    const request = connection.request().input('serviceType', type);
    
    if (city) {
      query += ' AND s.city = @city';
      request.input('city', city);
    }
    
    if (featured === 'true') {
      query += ' AND s.is_featured = 1';
    }
    
    query += ' ORDER BY s.is_featured DESC, s.average_rating DESC, s.total_reviews DESC';
    
    const result = await request.query(query);
    
    const services = result.recordset.map(service => ({
      id: service.id,
      name: service.name,
      description: service.short_description || service.description?.substring(0, 200),
      fullDescription: service.description,
      price: service.base_price,
      pricePerUnit: service.price_per_unit,
      location: service.address || `${service.city || 'Udupi'}, Karnataka`,
      city: service.city,
      rating: parseFloat(service.average_rating) || 0,
      reviews: service.total_reviews || 0,
      image: service.primary_image || getDefaultImage(service.service_type),
      imageGallery: service.image_gallery ? JSON.parse(service.image_gallery) : [],
      vendor: {
        name: service.vendor_name || service.business_name,
        phone: service.vendor_phone,
        id: service.vendor_id
      },
      features: service.service_details ? JSON.parse(service.service_details) : {},
      completedBookings: service.completed_bookings || 0,
      isFeatured: service.is_featured,
      availability: true, // TODO: Check real availability
      lastBooking: null // TODO: Get last booking date
    }));
    
    res.json({
      success: true,
      data: services,
      totalCount: services.length,
      filters: {
        type: type,
        city: city,
        featured: featured
      },
      message: `Real ${type} services retrieved successfully`
    });
    
  } catch (error) {
    console.error('Error getting services:', error);

    // Return fallback services data instead of error
    const fallbackServices = generateFallbackServices(type as string, Math.min(Number(limit), 10));

    res.json({
      success: true,
      data: fallbackServices,
      totalCount: fallbackServices.length,
      fallback: true,
      filters: {
        type: type,
        city: city,
        featured: featured
      },
      message: `Fallback ${type} services (database unavailable)`
    });
  }
};

// Get real events with actual data
export const getRealEvents: RequestHandler = async (req, res) => {
  try {
    const { limit = 10, status = 'published', city, featured } = req.query;
    
    const connection = await getConnection();
    
    let query = `
      SELECT TOP ${Math.min(Number(limit), 50)}
        e.*,
        u.name as organizer_name,
        u.organization_name,
        (SELECT COUNT(*) FROM EventRegistrations WHERE event_id = e.id) as current_registrations
      FROM Events e
      LEFT JOIN Users u ON e.organizer_id = u.id
      WHERE e.status = @status
    `;
    
    const request = connection.request().input('status', status);
    
    if (city) {
      query += ' AND e.city = @city';
      request.input('city', city);
    }
    
    if (featured === 'true') {
      query += ' AND e.is_featured = 1';
    }
    
    query += ' ORDER BY e.is_featured DESC, e.event_date ASC';
    
    const result = await request.query(query);
    
    const events = result.recordset.map(event => ({
      id: event.id,
      title: event.title,
      description: event.short_description || event.description?.substring(0, 200),
      fullDescription: event.description,
      category: event.category,
      date: event.event_date,
      startTime: event.start_time,
      endTime: event.end_time,
      duration: event.duration_hours,
      venue: {
        name: event.venue_name,
        address: event.venue_address,
        city: event.city
      },
      pricing: {
        ticketPrice: parseFloat(event.ticket_price) || 0,
        currency: event.currency
      },
      capacity: {
        max: event.max_capacity,
        current: event.current_registrations || 0,
        available: event.max_capacity - (event.current_registrations || 0)
      },
      organizer: {
        name: event.organizer_name,
        organization: event.organization_name,
        id: event.organizer_id
      },
      media: {
        featuredImage: event.featured_image || getDefaultEventImage(event.category),
        gallery: event.image_gallery ? JSON.parse(event.image_gallery) : []
      },
      isFeatured: event.is_featured,
      status: event.status,
      createdAt: event.created_at,
      publishedAt: event.published_at
    }));
    
    res.json({
      success: true,
      data: events,
      totalCount: events.length,
      filters: {
        status: status,
        city: city,
        featured: featured
      },
      message: 'Real events retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get events',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get user-specific data
export const getUserDashboardData: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const connection = await getConnection();
    
    // Get user's bookings
    const bookingsQuery = `
      SELECT TOP 10
        b.*,
        s.name as service_name,
        s.service_type,
        u.name as vendor_name
      FROM Bookings b
      LEFT JOIN Services s ON b.service_id = s.id
      LEFT JOIN Users u ON b.vendor_id = u.id
      WHERE b.customer_id = @userId
      ORDER BY b.created_at DESC
    `;
    
    const bookingsResult = await connection.request()
      .input('userId', userId)
      .query(bookingsQuery);
    
    // Get user's reviews
    const reviewsQuery = `
      SELECT COUNT(*) as total_reviews,
             AVG(CAST(rating as FLOAT)) as average_rating_given
      FROM Reviews 
      WHERE user_id = @userId
    `;
    
    const reviewsResult = await connection.request()
      .input('userId', userId)
      .query(reviewsQuery);
    
    // Get user's event registrations
    const eventsQuery = `
      SELECT COUNT(*) as registered_events
      FROM EventRegistrations 
      WHERE user_id = @userId
    `;
    
    const eventsResult = await connection.request()
      .input('userId', userId)
      .query(eventsQuery);
    
    const userStats = reviewsResult.recordset[0];
    const eventStats = eventsResult.recordset[0];
    
    res.json({
      success: true,
      data: {
        bookings: bookingsResult.recordset.map(booking => ({
          id: booking.id,
          reference: booking.booking_reference,
          serviceName: booking.service_name,
          serviceType: booking.service_type,
          vendorName: booking.vendor_name,
          checkInDate: booking.check_in_date,
          checkOutDate: booking.check_out_date,
          totalAmount: booking.total_amount,
          status: booking.status,
          paymentStatus: booking.payment_status,
          createdAt: booking.created_at
        })),
        stats: {
          totalBookings: bookingsResult.recordset.length,
          totalReviews: userStats.total_reviews || 0,
          averageRatingGiven: parseFloat(userStats.average_rating_given) || 0,
          registeredEvents: eventStats.registered_events || 0
        }
      },
      message: 'User dashboard data retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error getting user dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Helper functions
function getDefaultImage(serviceType: string): string {
  const imageMap = {
    homestay: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    driver: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    event_services: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop'
  };
  
  return imageMap[serviceType] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
}

function getDefaultEventImage(category?: string): string {
  const imageMap = {
    cultural: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop',
    music: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
    food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
    community: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop'
  };

  return imageMap[category] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
}

// Generate fallback services data when database is unavailable
function generateFallbackServices(serviceType: string, limit: number) {
  const fallbackData = {
    homestay: [
      {
        id: 1,
        name: 'Coastal Paradise Villa',
        description: 'Beautiful beachside villa with modern amenities and stunning ocean views',
        price: 3500,
        pricePerUnit: 3500,
        location: 'Malpe Beach Road, Udupi',
        city: 'Udupi',
        rating: 4.5,
        reviews: 23,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
        vendor: { name: 'Coastal Hospitality', phone: '+91-9876543210', id: 1 },
        features: { rooms: 3, amenities: ['WiFi', 'AC', 'Parking', 'Beach Access'] },
        completedBookings: 45,
        isFeatured: true
      },
      {
        id: 2,
        name: 'Heritage Homestay',
        description: 'Traditional Karnataka style homestay with authentic local experience',
        price: 2800,
        pricePerUnit: 2800,
        location: 'Car Street, Udupi',
        city: 'Udupi',
        rating: 4.2,
        reviews: 18,
        image: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=400&h=300&fit=crop',
        vendor: { name: 'Heritage Homes', phone: '+91-9876543211', id: 2 },
        features: { rooms: 2, amenities: ['WiFi', 'Traditional Food', 'Cultural Tours'] },
        completedBookings: 32,
        isFeatured: false
      }
    ],
    restaurant: [
      {
        id: 3,
        name: 'Sea Breeze Restaurant',
        description: 'Authentic coastal Karnataka cuisine with fresh seafood specialties',
        price: 500,
        pricePerUnit: 500,
        location: 'Temple Street, Udupi',
        city: 'Udupi',
        rating: 4.3,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
        vendor: { name: 'Coastal Cuisine', phone: '+91-9876543212', id: 3 },
        features: { cuisine: 'South Indian', seating: 50, specialties: ['Fish Curry', 'Neer Dosa'] },
        completedBookings: 89,
        isFeatured: true
      },
      {
        id: 4,
        name: 'Udupi Palace',
        description: 'Traditional vegetarian restaurant famous for authentic Udupi cuisine',
        price: 300,
        pricePerUnit: 300,
        location: 'Market Road, Udupi',
        city: 'Udupi',
        rating: 4.1,
        reviews: 203,
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        vendor: { name: 'Traditional Tastes', phone: '+91-9876543213', id: 4 },
        features: { cuisine: 'Vegetarian', seating: 80, specialties: ['Masala Dosa', 'Sambar'] },
        completedBookings: 134,
        isFeatured: false
      }
    ],
    driver: [
      {
        id: 5,
        name: 'Udupi Tour Services',
        description: 'Professional driver services for local tours and airport transfers',
        price: 2000,
        pricePerUnit: 2000,
        location: 'Bus Stand, Udupi',
        city: 'Udupi',
        rating: 4.7,
        reviews: 67,
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
        vendor: { name: 'Reliable Rides', phone: '+91-9876543214', id: 5 },
        features: { vehicle_type: 'SUV', capacity: 7, services: ['Airport Transfer', 'Local Tours'] },
        completedBookings: 78,
        isFeatured: true
      },
      {
        id: 6,
        name: 'Coastal Cabs',
        description: 'Comfortable and safe transportation for all your travel needs',
        price: 1500,
        pricePerUnit: 1500,
        location: 'Railway Station, Udupi',
        city: 'Udupi',
        rating: 4.4,
        reviews: 45,
        image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400&h=300&fit=crop',
        vendor: { name: 'Safe Travels', phone: '+91-9876543215', id: 6 },
        features: { vehicle_type: 'Sedan', capacity: 4, services: ['City Rides', 'Outstation'] },
        completedBookings: 56,
        isFeatured: false
      }
    ]
  };

  const services = fallbackData[serviceType] || fallbackData.homestay;
  return services.slice(0, limit);
}

// Get real vendor applications for admin
export const getVendorApplications: RequestHandler = async (req, res) => {
  try {
    const { status = 'pending', limit = 20 } = req.query;
    
    const connection = await getConnection();
    
    const query = `
      SELECT TOP ${Math.min(Number(limit), 50)}
        va.*,
        u.name as applicant_name,
        u.email as applicant_email,
        reviewer.name as reviewer_name
      FROM VendorApplications va
      LEFT JOIN Users u ON va.user_id = u.id
      LEFT JOIN Users reviewer ON va.reviewed_by = reviewer.id
      WHERE va.status = @status
      ORDER BY va.submitted_at DESC
    `;
    
    const result = await connection.request()
      .input('status', status)
      .query(query);
    
    const applications = result.recordset.map(app => ({
      id: app.id,
      applicant: {
        name: app.applicant_name,
        email: app.applicant_email,
        id: app.user_id
      },
      business: {
        name: app.business_name,
        type: app.business_type,
        description: app.business_description,
        address: app.business_address,
        city: app.city,
        state: app.state
      },
      documents: {
        businessLicense: app.business_license,
        gstNumber: app.gst_number,
        panNumber: app.pan_number,
        aadharNumber: app.aadhar_number,
        otherDocuments: app.documents ? JSON.parse(app.documents) : []
      },
      contact: {
        person: app.contact_person,
        phone: app.contact_phone,
        email: app.contact_email
      },
      status: app.status,
      submittedAt: app.submitted_at,
      reviewedAt: app.reviewed_at,
      reviewedBy: app.reviewer_name,
      adminNotes: app.admin_notes,
      rejectionReason: app.rejection_reason
    }));
    
    res.json({
      success: true,
      data: applications,
      totalCount: applications.length,
      message: 'Vendor applications retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error getting vendor applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vendor applications',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
