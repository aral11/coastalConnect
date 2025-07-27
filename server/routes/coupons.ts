import express, { Request, Response } from 'express';
import { getConnection } from '../db/connection';
import sql from 'mssql';

const router = express.Router();

// Get all active coupons (public endpoint)
router.get('/', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const result = await connection.request().query(`
      SELECT 
        id,
        code,
        title,
        subtitle,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount_amount,
        valid_from,
        valid_until,
        category,
        usage_limit,
        usage_per_user,
        current_usage,
        is_popular,
        is_limited_time,
        gradient_class,
        text_color_class,
        icon_type,
        image_url
      FROM Coupons 
      WHERE is_active = 1 
        AND valid_from <= GETDATE() 
        AND valid_until >= GETDATE()
      ORDER BY 
        is_popular DESC,
        is_limited_time DESC,
        created_at DESC
    `);

    const coupons = result.recordset.map(coupon => ({
      id: coupon.code,
      title: coupon.title,
      subtitle: coupon.subtitle,
      description: coupon.description,
      discount: coupon.discount_type === 'percentage' 
        ? `${coupon.discount_value}% OFF`
        : `₹${coupon.discount_value} OFF`,
      type: coupon.discount_type,
      minOrder: coupon.min_order_amount,
      validUntil: coupon.valid_until,
      code: coupon.code,
      gradient: coupon.gradient_class || 'from-orange-400 to-red-500',
      textColor: coupon.text_color_class || 'text-white',
      icon: getIconComponent(coupon.icon_type),
      category: coupon.category,
      link: `/offers/${coupon.code}`,
      popular: coupon.is_popular,
      limitedTime: coupon.is_limited_time,
      usageLimit: coupon.usage_limit,
      currentUsage: coupon.current_usage,
      usagePerUser: coupon.usage_per_user,
      maxDiscount: coupon.max_discount_amount
    }));

    res.json({
      success: true,
      data: coupons,
      total: coupons.length
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

// Get personalized offers for a user
router.get('/personalized/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const connection = await getConnection();
    
    // Get user's booking history to personalize offers
    const userHistoryResult = await connection.request()
      .input('userId', sql.Int, parseInt(userId))
      .query(`
        SELECT DISTINCT 'homestay' as service_type FROM HomestayBookings WHERE user_id = @userId
        UNION
        SELECT DISTINCT 'transport' as service_type FROM DriverBookings WHERE user_id = @userId
      `);

    const userServices = userHistoryResult.recordset.map(row => row.service_type);
    
    // Get relevant coupons based on user history
    let categoryFilter = '';
    if (userServices.length > 0) {
      const categories = userServices.map(service => {
        switch(service) {
          case 'homestay': return 'Homestays';
          case 'transport': return 'Transport';
          default: return 'All Services';
        }
      });
      categoryFilter = `AND (category IN ('${categories.join("','")}') OR category = 'All Services')`;
    }

    const result = await connection.request()
      .input('userId', sql.Int, parseInt(userId))
      .query(`
        SELECT 
          c.*,
          ISNULL(cu.usage_count, 0) as user_usage_count
        FROM Coupons c
        LEFT JOIN (
          SELECT coupon_id, COUNT(*) as usage_count 
          FROM CouponUsage 
          WHERE user_id = @userId 
          GROUP BY coupon_id
        ) cu ON c.id = cu.coupon_id
        WHERE c.is_active = 1 
          AND c.valid_from <= GETDATE() 
          AND c.valid_until >= GETDATE()
          AND (c.usage_limit IS NULL OR c.current_usage < c.usage_limit)
          AND (cu.usage_count IS NULL OR cu.usage_count < c.usage_per_user)
          ${categoryFilter}
        ORDER BY 
          c.is_popular DESC,
          c.is_limited_time DESC,
          c.discount_value DESC
      `);

    const personalizedOffers = result.recordset.map(coupon => ({
      id: coupon.code,
      title: coupon.title,
      subtitle: coupon.subtitle,
      description: coupon.description,
      discount: coupon.discount_type === 'percentage' 
        ? `${coupon.discount_value}% OFF`
        : `₹${coupon.discount_value} OFF`,
      type: coupon.discount_type,
      minOrder: coupon.min_order_amount,
      validUntil: coupon.valid_until,
      code: coupon.code,
      gradient: coupon.gradient_class || 'from-orange-400 to-red-500',
      textColor: coupon.text_color_class || 'text-white',
      icon: getIconComponent(coupon.icon_type),
      category: coupon.category,
      link: `/offers/${coupon.code}`,
      popular: coupon.is_popular,
      limitedTime: coupon.is_limited_time
    }));

    res.json({
      success: true,
      data: personalizedOffers,
      total: personalizedOffers.length,
      personalized: userServices.length > 0
    });
  } catch (error) {
    console.error('Error fetching personalized offers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch personalized offers',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

// Validate a coupon code
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { code, userId, orderAmount, serviceType } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and order amount are required'
      });
    }

    const connection = await getConnection();
    
    // Check if coupon exists and is valid
    const couponResult = await connection.request()
      .input('code', sql.NVarChar, code)
      .query(`
        SELECT * FROM Coupons 
        WHERE code = @code 
          AND is_active = 1 
          AND valid_from <= GETDATE() 
          AND valid_until >= GETDATE()
      `);

    if (couponResult.recordset.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired coupon code'
      });
    }

    const coupon = couponResult.recordset[0];

    // Check usage limits
    if (coupon.usage_limit && coupon.current_usage >= coupon.usage_limit) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit exceeded'
      });
    }

    // Check minimum order amount
    if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.min_order_amount} required`
      });
    }

    // Check user usage limit
    if (userId) {
      const userUsageResult = await connection.request()
        .input('couponId', sql.Int, coupon.id)
        .input('userId', sql.Int, parseInt(userId))
        .query(`
          SELECT COUNT(*) as usage_count 
          FROM CouponUsage 
          WHERE coupon_id = @couponId AND user_id = @userId
        `);

      const userUsageCount = userUsageResult.recordset[0].usage_count;
      if (userUsageCount >= coupon.usage_per_user) {
        return res.status(400).json({
          success: false,
          message: 'You have already used this coupon'
        });
      }
    }

    // Check service type compatibility
    if (coupon.category && coupon.category !== 'All Services') {
      const serviceCategory = getServiceCategory(serviceType);
      if (serviceCategory !== coupon.category) {
        return res.status(400).json({
          success: false,
          message: `This coupon is only valid for ${coupon.category}`
        });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderAmount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    } else if (coupon.discount_type === 'amount') {
      discountAmount = Math.min(coupon.discount_value, orderAmount);
    }

    const finalAmount = Math.max(0, orderAmount - discountAmount);

    res.json({
      success: true,
      data: {
        couponId: coupon.id,
        code: coupon.code,
        title: coupon.title,
        discountAmount: discountAmount,
        originalAmount: orderAmount,
        finalAmount: finalAmount,
        savings: discountAmount
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate coupon',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

// Apply coupon to booking
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const { couponId, userId, bookingId, bookingType, discountAmount, originalAmount, finalAmount } = req.body;

    if (!couponId || !userId || !discountAmount || !originalAmount || !finalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for coupon application'
      });
    }

    const connection = await getConnection();
    
    // Begin transaction
    const transaction = new sql.Transaction(connection);
    await transaction.begin();

    try {
      // Record coupon usage
      await transaction.request()
        .input('couponId', sql.Int, couponId)
        .input('userId', sql.Int, parseInt(userId))
        .input('bookingId', sql.Int, bookingId || null)
        .input('bookingType', sql.NVarChar, bookingType || null)
        .input('discountAmount', sql.Decimal(10, 2), discountAmount)
        .input('originalAmount', sql.Decimal(10, 2), originalAmount)
        .input('finalAmount', sql.Decimal(10, 2), finalAmount)
        .query(`
          INSERT INTO CouponUsage 
          (coupon_id, user_id, booking_id, booking_type, discount_amount, original_amount, final_amount)
          VALUES (@couponId, @userId, @bookingId, @bookingType, @discountAmount, @originalAmount, @finalAmount)
        `);

      // Update coupon usage count
      await transaction.request()
        .input('couponId', sql.Int, couponId)
        .query(`
          UPDATE Coupons 
          SET current_usage = current_usage + 1, updated_at = GETDATE()
          WHERE id = @couponId
        `);

      await transaction.commit();

      res.json({
        success: true,
        message: 'Coupon applied successfully',
        data: {
          discountAmount,
          finalAmount,
          savings: discountAmount
        }
      });
    } catch (transactionError) {
      await transaction.rollback();
      throw transactionError;
    }
  } catch (error) {
    console.error('Error applying coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply coupon',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

// Analytics endpoints
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    // Get overall statistics
    const statsResult = await connection.request().query(`
      SELECT
        COUNT(*) as total_coupons,
        SUM(CASE WHEN is_active = 1 AND valid_from <= GETDATE() AND valid_until >= GETDATE() THEN 1 ELSE 0 END) as active_coupons
      FROM Coupons
    `);

    const usageStatsResult = await connection.request().query(`
      SELECT
        COUNT(*) as total_usage,
        SUM(discount_amount) as total_discount_given,
        AVG(discount_amount) as avg_discount
      FROM CouponUsage
    `);

    // Get popular coupons
    const popularResult = await connection.request().query(`
      SELECT TOP(5)
        c.code,
        c.title,
        COUNT(cu.id) as usage_count,
        SUM(cu.discount_amount) as total_discount
      FROM Coupons c
      LEFT JOIN CouponUsage cu ON c.id = cu.coupon_id
      WHERE c.is_active = 1
      GROUP BY c.id, c.code, c.title
      ORDER BY usage_count DESC
    `);

    // Get category breakdown
    const categoryResult = await connection.request().query(`
      SELECT
        COALESCE(cu.booking_type, 'unknown') as category,
        COUNT(*) as usage_count
      FROM CouponUsage cu
      GROUP BY cu.booking_type
    `);

    const stats = statsResult.recordset[0];
    const usageStats = usageStatsResult.recordset[0];
    const categoryBreakdown: { [key: string]: number } = {};

    categoryResult.recordset.forEach(row => {
      categoryBreakdown[row.category] = row.usage_count;
    });

    res.json({
      success: true,
      data: {
        totalCoupons: stats.total_coupons,
        activeCoupons: stats.active_coupons,
        totalUsage: usageStats.total_usage || 0,
        totalDiscountGiven: usageStats.total_discount_given || 0,
        avgDiscount: usageStats.avg_discount || 0,
        popularCoupons: popularResult.recordset,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

router.get('/usage/recent', async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await connection.request()
      .input('limit', sql.Int, limit)
      .query(`
        SELECT TOP(@limit)
          cu.id,
          c.code,
          u.name as userName,
          cu.discount_amount,
          cu.original_amount,
          cu.final_amount,
          cu.used_at,
          cu.booking_type
        FROM CouponUsage cu
        INNER JOIN Coupons c ON cu.coupon_id = c.id
        INNER JOIN Users u ON cu.user_id = u.id
        ORDER BY cu.used_at DESC
      `);

    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error('Error fetching recent usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent usage',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

// Admin endpoints (require authentication)
router.post('/admin/create', async (req: Request, res: Response) => {
  try {
    const {
      code,
      title,
      subtitle,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      validFrom,
      validUntil,
      category,
      usageLimit,
      usagePerUser,
      isPopular,
      isLimitedTime,
      gradientClass,
      textColorClass,
      iconType,
      createdBy
    } = req.body;

    if (!code || !title || !discountType || !discountValue || !validFrom || !validUntil) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const connection = await getConnection();
    
    // Check if coupon code already exists
    const existingCoupon = await connection.request()
      .input('code', sql.NVarChar, code.toUpperCase())
      .query(`SELECT id FROM Coupons WHERE code = @code`);

    if (existingCoupon.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    const result = await connection.request()
      .input('code', sql.NVarChar, code.toUpperCase())
      .input('title', sql.NVarChar, title)
      .input('subtitle', sql.NVarChar, subtitle || null)
      .input('description', sql.NVarChar, description || null)
      .input('discountType', sql.NVarChar, discountType)
      .input('discountValue', sql.Decimal(10, 2), discountValue)
      .input('minOrderAmount', sql.Decimal(10, 2), minOrderAmount || null)
      .input('maxDiscountAmount', sql.Decimal(10, 2), maxDiscountAmount || null)
      .input('validFrom', sql.DateTime, new Date(validFrom))
      .input('validUntil', sql.DateTime, new Date(validUntil))
      .input('category', sql.NVarChar, category || 'All Services')
      .input('usageLimit', sql.Int, usageLimit || null)
      .input('usagePerUser', sql.Int, usagePerUser || 1)
      .input('isPopular', sql.Bit, isPopular || false)
      .input('isLimitedTime', sql.Bit, isLimitedTime || false)
      .input('gradientClass', sql.NVarChar, gradientClass || 'from-orange-400 to-red-500')
      .input('textColorClass', sql.NVarChar, textColorClass || 'text-white')
      .input('iconType', sql.NVarChar, iconType || 'gift')
      .input('createdBy', sql.Int, createdBy || null)
      .query(`
        INSERT INTO Coupons 
        (code, title, subtitle, description, discount_type, discount_value, min_order_amount, max_discount_amount, 
         valid_from, valid_until, category, usage_limit, usage_per_user, is_popular, is_limited_time, 
         gradient_class, text_color_class, icon_type, created_by)
        OUTPUT INSERTED.id
        VALUES 
        (@code, @title, @subtitle, @description, @discountType, @discountValue, @minOrderAmount, @maxDiscountAmount,
         @validFrom, @validUntil, @category, @usageLimit, @usagePerUser, @isPopular, @isLimitedTime,
         @gradientClass, @textColorClass, @iconType, @createdBy)
      `);

    res.json({
      success: true,
      message: 'Coupon created successfully',
      data: {
        id: result.recordset[0].id,
        code: code.toUpperCase()
      }
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create coupon',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

// Helper functions
function getIconComponent(iconType: string): string {
  const iconMap: { [key: string]: string } = {
    'gift': '🎁',
    'percent': '💯',
    'clock': '⏰',
    'zap': '⚡',
    'star': '⭐',
    'fire': '🔥',
    'money': '💰'
  };
  return iconMap[iconType] || '🎁';
}

function getServiceCategory(serviceType: string): string {
  const categoryMap: { [key: string]: string } = {
    'homestay': 'Homestays',
    'restaurant': 'Restaurants',
    'eatery': 'Restaurants',
    'driver': 'Transport',
    'transport': 'Transport',
    'creator': 'Creators',
    'event': 'Events'
  };
  return categoryMap[serviceType] || 'All Services';
}

export default router;
