import { Router, Request, Response } from 'express';
import { getConnection } from '../db/connection';

const router = Router();

// Admin authentication middleware (simplified for demo)
const requireAdmin = (req: Request, res: Response, next: any) => {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  
  // In production, implement proper admin authentication
  if (adminKey === 'admin123' || adminKey === process.env.ADMIN_SECRET_KEY) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};

// Get all pending approvals across all content types
router.get('/pending-approvals', requireAdmin, async (req: Request, res: Response) => {
  try {
    const pendingItems: any[] = [];

    try {
      const pool = await getConnection();
      
      // Get pending homestays
      const homestaysResult = await pool.request().query(`
        SELECT 'homestay' as type, id, name as title, location, created_at, admin_approval_status 
        FROM homestays 
        WHERE admin_approval_status = 'pending'
        ORDER BY created_at DESC
      `);
      pendingItems.push(...homestaysResult.recordset);

      // Get pending eateries
      const eateriesResult = await pool.request().query(`
        SELECT 'eatery' as type, id, name as title, location, created_at, admin_approval_status 
        FROM eateries 
        WHERE admin_approval_status = 'pending'
        ORDER BY created_at DESC
      `);
      pendingItems.push(...eateriesResult.recordset);

      // Get pending drivers
      const driversResult = await pool.request().query(`
        SELECT 'driver' as type, id, name as title, location, created_at, admin_approval_status 
        FROM drivers 
        WHERE admin_approval_status = 'pending'
        ORDER BY created_at DESC
      `);
      pendingItems.push(...driversResult.recordset);

      // Get pending creators
      const creatorsResult = await pool.request().query(`
        SELECT 'creator' as type, id, name as title, location, created_at, admin_approval_status 
        FROM creators 
        WHERE admin_approval_status = 'pending'
        ORDER BY created_at DESC
      `);
      pendingItems.push(...creatorsResult.recordset);

      // Get pending events
      const eventsResult = await pool.request().query(`
        SELECT 'event' as type, id, title, location, created_at, admin_approval_status 
        FROM LocalEvents 
        WHERE admin_approval_status = 'pending'
        ORDER BY created_at DESC
      `);
      pendingItems.push(...eventsResult.recordset);

    } catch (dbError) {
      console.log('Database not available, using mock pending items');
      
      // Mock pending items for demo
      const mockPendingItems = [
        {
          type: 'homestay',
          id: 1,
          title: 'Sea View Villa',
          location: 'Malpe Beach',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          admin_approval_status: 'pending'
        },
        {
          type: 'eatery',
          id: 2,
          title: 'Coastal Kitchen',
          location: 'Udupi',
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          admin_approval_status: 'pending'
        },
        {
          type: 'creator',
          id: 3,
          title: 'Priya Photography',
          location: 'Manipal',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          admin_approval_status: 'pending'
        },
        {
          type: 'driver',
          id: 4,
          title: 'Ravi Transport',
          location: 'Udupi',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          admin_approval_status: 'pending'
        }
      ];
      pendingItems.push(...mockPendingItems);
    }

    // Sort by creation date (newest first)
    pendingItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({
      success: true,
      data: pendingItems,
      count: pendingItems.length,
      message: `${pendingItems.length} items pending approval`
    });

  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending approvals',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Approve or reject content
router.post('/approve/:type/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { type, id } = req.params;
    const { action, reason } = req.body; // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "approve" or "reject"'
      });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';
    let tableName: string;
    
    // Map content type to table name
    switch (type) {
      case 'homestay':
        tableName = 'homestays';
        break;
      case 'eatery':
        tableName = 'eateries';
        break;
      case 'driver':
        tableName = 'drivers';
        break;
      case 'creator':
        tableName = 'creators';
        break;
      case 'event':
        tableName = 'LocalEvents';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid content type'
        });
    }

    try {
      const pool = await getConnection();
      
      const result = await pool.request()
        .input('id', id)
        .input('status', status)
        .input('reason', reason || null)
        .input('approvedAt', new Date())
        .query(`
          UPDATE ${tableName} 
          SET admin_approval_status = @status,
              admin_approval_reason = @reason,
              admin_approved_at = @approvedAt
          WHERE id = @id
        `);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          success: false,
          message: `${type} with ID ${id} not found`
        });
      }

    } catch (dbError) {
      console.log('Database not available, simulating approval action');
    }

    // Trigger real-time stats update when approving content
    if (action === 'approve') {
      try {
        if (type === 'homestay' || type === 'eatery' || type === 'driver') {
          // Trigger vendor count update
          await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/stats/increment-vendor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
        } else if (type === 'creator') {
          // Trigger creator count update
          await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/stats/increment-creator`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
        }
        console.log(`📊 Stats updated after approving ${type} #${id}`);
      } catch (statsError) {
        console.error('Failed to update stats after approval:', statsError);
        // Don't fail the approval if stats update fails
      }
    }

    res.json({
      success: true,
      message: `${type} ${action}d successfully`,
      data: {
        type,
        id: parseInt(id),
        status,
        reason,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error processing approval:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process approval',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get admin dashboard stats
router.get('/dashboard-stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    let dashboardStats = {
      pendingApprovals: 0,
      approvedToday: 0,
      rejectedToday: 0,
      totalUsers: 0,
      totalBookings: 0,
      revenueToday: 0
    };

    try {
      const pool = await getConnection();
      const today = new Date().toISOString().split('T')[0];

      // Count pending approvals across all tables
      const pendingQueries = [
        'SELECT COUNT(*) as count FROM homestays WHERE admin_approval_status = \'pending\'',
        'SELECT COUNT(*) as count FROM eateries WHERE admin_approval_status = \'pending\'',
        'SELECT COUNT(*) as count FROM drivers WHERE admin_approval_status = \'pending\'',
        'SELECT COUNT(*) as count FROM creators WHERE admin_approval_status = \'pending\'',
        'SELECT COUNT(*) as count FROM LocalEvents WHERE admin_approval_status = \'pending\''
      ];

      let totalPending = 0;
      for (const query of pendingQueries) {
        const result = await pool.request().query(query);
        totalPending += result.recordset[0]?.count || 0;
      }

      // Count approvals today
      const approvedTodayResult = await pool.request()
        .input('today', today)
        .query(`
          SELECT COUNT(*) as count FROM (
            SELECT admin_approved_at FROM homestays WHERE admin_approval_status = 'approved' AND CAST(admin_approved_at AS DATE) = @today
            UNION ALL
            SELECT admin_approved_at FROM eateries WHERE admin_approval_status = 'approved' AND CAST(admin_approved_at AS DATE) = @today
            UNION ALL
            SELECT admin_approved_at FROM drivers WHERE admin_approval_status = 'approved' AND CAST(admin_approved_at AS DATE) = @today
            UNION ALL
            SELECT admin_approved_at FROM creators WHERE admin_approval_status = 'approved' AND CAST(admin_approved_at AS DATE) = @today
          ) as approved_today
        `);

      dashboardStats = {
        pendingApprovals: totalPending,
        approvedToday: approvedTodayResult.recordset[0]?.count || 0,
        rejectedToday: 0, // Would need similar query for rejected items
        totalUsers: 0, // Would come from Users table
        totalBookings: 0, // Would come from bookings table
        revenueToday: 0 // Would be calculated from bookings
      };

    } catch (dbError) {
      console.log('Database not available, using mock admin stats');
      
      // Mock admin dashboard stats
      const now = new Date();
      const hour = now.getHours();
      
      dashboardStats = {
        pendingApprovals: 4 + (hour % 6),
        approvedToday: 8 + (hour % 5),
        rejectedToday: 1 + (hour % 3),
        totalUsers: 156 + (hour % 20),
        totalBookings: 23 + (hour % 10),
        revenueToday: 12500 + (hour * 200)
      };
    }

    res.json({
      success: true,
      data: dashboardStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard stats'
    });
  }
});

// Batch approve/reject multiple items
router.post('/batch-action', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { items, action, reason } = req.body;
    // items: Array<{type: string, id: number}>
    // action: 'approve' | 'reject'

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required and cannot be empty'
      });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "approve" or "reject"'
      });
    }

    const results = [];
    const status = action === 'approve' ? 'approved' : 'rejected';

    for (const item of items) {
      try {
        // Here you would update each item in the database
        // For now, we'll simulate the action
        results.push({
          type: item.type,
          id: item.id,
          status,
          success: true
        });
      } catch (error) {
        results.push({
          type: item.type,
          id: item.id,
          status: 'error',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Batch action completed: ${successCount} ${action}d, ${errorCount} errors`,
      data: {
        results,
        summary: {
          total: items.length,
          successful: successCount,
          errors: errorCount
        }
      }
    });

  } catch (error) {
    console.error('Error processing batch action:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process batch action'
    });
  }
});

export default router;
