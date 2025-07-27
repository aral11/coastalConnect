import { Router, Request, Response } from 'express';
import { getConnection } from '../db/connection';

const router = Router();

// Get platform statistics for homepage
router.get('/platform', async (req: Request, res: Response) => {
  try {
    let connection;
    try {
      connection = await getConnection();
    } catch (dbError) {
      console.log('Database connection failed for stats, returning zeros');
      return res.json({
        success: true,
        data: {
          vendors: 0,
          orders: 0,
          rating: 0,
          cities: 0
        },
        message: 'Platform statistics retrieved (database unavailable)'
      });
    }
    
    // Get vendor counts from different tables
    const vendorQueries = [
      'SELECT COUNT(*) as count FROM Homestays WHERE admin_approval_status = \'approved\' AND is_active = 1',
      'SELECT COUNT(*) as count FROM Eateries WHERE admin_approval_status = \'approved\' AND is_active = 1', 
      'SELECT COUNT(*) as count FROM Drivers WHERE admin_approval_status = \'approved\' AND is_active = 1',
      'SELECT COUNT(*) as count FROM Creators WHERE is_active = 1',
      'SELECT COUNT(*) as count FROM BeautyWellness WHERE is_active = 1',
      'SELECT COUNT(*) as count FROM Entertainment WHERE is_active = 1',
      'SELECT COUNT(*) as count FROM EventManagement WHERE is_active = 1',
      'SELECT COUNT(*) as count FROM OtherServices WHERE is_active = 1'
    ];

    const vendorResults = await Promise.all(
      vendorQueries.map(query => connection.request().query(query))
    );

    const totalVendors = vendorResults.reduce((sum, result) => 
      sum + (result.recordset[0]?.count || 0), 0
    );

    // Get total bookings
    const bookingQueries = [
      'SELECT COUNT(*) as count FROM HomestayBookings',
      'SELECT COUNT(*) as count FROM DriverBookings'
    ];

    const bookingResults = await Promise.all(
      bookingQueries.map(query => connection.request().query(query))
    );

    const totalOrders = bookingResults.reduce((sum, result) => 
      sum + (result.recordset[0]?.count || 0), 0
    );

    // Calculate average rating across all vendor types
    const ratingQueries = [
      'SELECT AVG(CAST(rating as FLOAT)) as avg_rating FROM Homestays WHERE admin_approval_status = \'approved\' AND is_active = 1 AND rating > 0',
      'SELECT AVG(CAST(rating as FLOAT)) as avg_rating FROM Eateries WHERE admin_approval_status = \'approved\' AND is_active = 1 AND rating > 0',
      'SELECT AVG(CAST(rating as FLOAT)) as avg_rating FROM Drivers WHERE admin_approval_status = \'approved\' AND is_active = 1 AND rating > 0'
    ];

    const ratingResults = await Promise.all(
      ratingQueries.map(query => connection.request().query(query))
    );

    const validRatings = ratingResults
      .map(result => result.recordset[0]?.avg_rating)
      .filter(rating => rating !== null && rating !== undefined);

    const averageRating = validRatings.length > 0 
      ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
      : 0;

    // Count active cities (simplified - just count distinct locations)
    const cityQuery = `
      SELECT COUNT(DISTINCT location) as cities FROM (
        SELECT location FROM Homestays WHERE admin_approval_status = 'approved' AND is_active = 1
        UNION
        SELECT location FROM Eateries WHERE admin_approval_status = 'approved' AND is_active = 1
        UNION  
        SELECT location FROM Drivers WHERE admin_approval_status = 'approved' AND is_active = 1
      ) as all_locations
    `;

    const cityResult = await connection.request().query(cityQuery);
    const totalCities = cityResult.recordset[0]?.cities || 0;

    const stats = {
      vendors: totalVendors,
      orders: totalOrders,
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      cities: totalCities
    };

    res.json({
      success: true,
      data: stats,
      message: 'Platform statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching platform stats:', error);
    
    // Return zeros instead of mock data for production
    res.json({
      success: true,
      data: {
        vendors: 0,
        orders: 0,
        rating: 0,
        cities: 0
      },
      message: 'Platform statistics retrieved (database unavailable)'
    });
  }
});

// Get detailed analytics for admin dashboard
router.get('/admin', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    
    // Get pending approvals count
    const pendingQuery = `
      SELECT COUNT(*) as pending FROM (
        SELECT id FROM Homestays WHERE admin_approval_status = 'pending'
        UNION ALL
        SELECT id FROM Eateries WHERE admin_approval_status = 'pending'
        UNION ALL
        SELECT id FROM Drivers WHERE admin_approval_status = 'pending'
      ) as pending_items
    `;

    const pendingResult = await connection.request().query(pendingQuery);
    const pendingApprovals = pendingResult.recordset[0]?.pending || 0;

    // Get today's approvals
    const todayQuery = `
      SELECT COUNT(*) as approved_today FROM (
        SELECT admin_approved_at FROM Homestays WHERE admin_approval_status = 'approved' AND CAST(admin_approved_at as DATE) = CAST(GETDATE() as DATE)
        UNION ALL
        SELECT admin_approved_at FROM Eateries WHERE admin_approval_status = 'approved' AND CAST(admin_approved_at as DATE) = CAST(GETDATE() as DATE)
        UNION ALL
        SELECT admin_approved_at FROM Drivers WHERE admin_approval_status = 'approved' AND CAST(admin_approved_at as DATE) = CAST(GETDATE() as DATE)
      ) as approved_today
    `;

    const todayResult = await connection.request().query(todayQuery);
    const approvedToday = todayResult.recordset[0]?.approved_today || 0;

    // Get total users
    const userResult = await connection.request().query('SELECT COUNT(*) as total_users FROM Users');
    const totalUsers = userResult.recordset[0]?.total_users || 0;

    // Get total bookings
    const bookingResult = await connection.request().query(`
      SELECT COUNT(*) as total_bookings FROM (
        SELECT id FROM HomestayBookings
        UNION ALL
        SELECT id FROM DriverBookings
      ) as all_bookings
    `);
    const totalBookings = bookingResult.recordset[0]?.total_bookings || 0;

    const adminStats = {
      pendingApprovals,
      approvedToday,
      rejectedToday: 0, // Would need to track rejection dates
      totalUsers,
      totalBookings,
      revenueToday: 0 // Would need to implement revenue tracking
    };

    res.json({
      success: true,
      data: adminStats,
      message: 'Admin statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
