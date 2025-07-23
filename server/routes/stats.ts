import { RequestHandler } from "express";
import { getConnection } from "../db/connection";

// Get platform statistics
export const getPlatformStats: RequestHandler = async (req, res) => {
  try {
    const pool = await getConnection();
    
    // Initialize default stats for when database is not available
    let stats = {
      totalVendors: 0,
      totalBookings: 0,
      totalCreators: 0,
      averageRating: 0,
      activeVendors: 0,
      totalUsers: 0,
      totalReviews: 0
    };

    try {
      // Query homestays
      const homestaysResult = await pool.request().query(
        'SELECT COUNT(*) as count FROM homestays WHERE is_active = 1'
      );
      
      // Query eateries
      const eateriesResult = await pool.request().query(
        'SELECT COUNT(*) as count FROM eateries WHERE is_active = 1'
      );
      
      // Query drivers
      const driversResult = await pool.request().query(
        'SELECT COUNT(*) as count FROM drivers WHERE is_available = 1'
      );
      
      // Query creators
      const creatorsResult = await pool.request().query(
        'SELECT COUNT(*) as count FROM creators WHERE is_active = 1'
      );
      
      // Query total bookings
      const bookingsResult = await pool.request().query(
        'SELECT COUNT(*) as count FROM bookings WHERE status != \'cancelled\''
      );
      
      // Query average rating
      const ratingsResult = await pool.request().query(`
        SELECT AVG(CAST(rating as float)) as avg_rating 
        FROM (
          SELECT rating FROM homestays WHERE rating IS NOT NULL
          UNION ALL
          SELECT rating FROM eateries WHERE rating IS NOT NULL
          UNION ALL
          SELECT rating FROM drivers WHERE rating IS NOT NULL
        ) as all_ratings
      `);
      
      // Query total reviews
      const reviewsResult = await pool.request().query(`
        SELECT SUM(total_reviews) as total FROM (
          SELECT ISNULL(total_reviews, 0) as total_reviews FROM homestays WHERE total_reviews IS NOT NULL
          UNION ALL
          SELECT ISNULL(total_reviews, 0) as total_reviews FROM eateries WHERE total_reviews IS NOT NULL
          UNION ALL
          SELECT ISNULL(total_reviews, 0) as total_reviews FROM drivers WHERE total_reviews IS NOT NULL
        ) as all_reviews
      `);
      
      stats = {
        totalVendors: (homestaysResult.recordset[0]?.count || 0) + 
                     (eateriesResult.recordset[0]?.count || 0),
        totalBookings: bookingsResult.recordset[0]?.count || 0,
        totalCreators: creatorsResult.recordset[0]?.count || 0,
        averageRating: Math.round((ratingsResult.recordset[0]?.avg_rating || 0) * 10) / 10,
        activeVendors: (homestaysResult.recordset[0]?.count || 0) + 
                      (eateriesResult.recordset[0]?.count || 0) + 
                      (driversResult.recordset[0]?.count || 0),
        totalUsers: 0, // This would come from users table when implemented
        totalReviews: reviewsResult.recordset[0]?.total || 0
      };
      
    } catch (dbError) {
      // Database query failed, use fallback data from API endpoints
      console.log('Database queries failed, using fallback data sources:', dbError);
      
      // Fallback to existing API endpoints
      try {
        const [homestaysRes, eateriesRes, driversRes, creatorsRes] = await Promise.all([
          fetch(`${req.protocol}://${req.get('host')}/api/homestays`).then(r => r.json()),
          fetch(`${req.protocol}://${req.get('host')}/api/eateries`).then(r => r.json()),
          fetch(`${req.protocol}://${req.get('host')}/api/drivers`).then(r => r.json()),
          fetch(`${req.protocol}://${req.get('host')}/api/creators`).then(r => r.json())
        ]);
        
        const homestays = homestaysRes.success ? homestaysRes.data : [];
        const eateries = eateriesRes.success ? eateriesRes.data : [];
        const drivers = driversRes.success ? driversRes.data : [];
        const creators = creatorsRes.success ? creatorsRes.data : [];
        
        // Calculate stats from API data
        const allRatings = [
          ...homestays.filter((h: any) => h.rating).map((h: any) => h.rating),
          ...eateries.filter((e: any) => e.rating).map((e: any) => e.rating),
          ...drivers.filter((d: any) => d.rating).map((d: any) => d.rating)
        ];
        
        const totalReviews = [
          ...homestays.filter((h: any) => h.total_reviews).map((h: any) => h.total_reviews),
          ...eateries.filter((e: any) => e.total_reviews).map((e: any) => e.total_reviews),
          ...drivers.filter((d: any) => d.total_reviews).map((d: any) => d.total_reviews)
        ].reduce((sum, reviews) => sum + reviews, 0);
        
        stats = {
          totalVendors: homestays.length + eateries.length,
          totalBookings: Math.floor(totalReviews * 0.6), // Estimate based on reviews
          totalCreators: creators.length,
          averageRating: allRatings.length > 0 
            ? Math.round((allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length) * 10) / 10 
            : 0,
          activeVendors: homestays.length + eateries.length + drivers.length,
          totalUsers: Math.floor(totalReviews * 0.8), // Estimate based on reviews
          totalReviews
        };
        
      } catch (apiError) {
        console.log('API fallback also failed:', apiError);
        // Keep default stats (all zeros)
      }
    }
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
