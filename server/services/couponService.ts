import { getConnection } from '../db/connection';
import sql from 'mssql';

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: any;
  discountAmount?: number;
  finalAmount?: number;
  message?: string;
}

export interface CouponApplicationData {
  couponId: number;
  userId: number;
  bookingId?: number;
  bookingType?: string;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
}

export class CouponService {
  static async validateCoupon(
    code: string,
    userId: number | null,
    orderAmount: number,
    serviceType?: string
  ): Promise<CouponValidationResult> {
    try {
      const connection = await getConnection();
      
      // Get coupon details
      const couponResult = await connection.request()
        .input('code', sql.NVarChar, code.toUpperCase())
        .query(`
          SELECT * FROM Coupons 
          WHERE code = @code 
            AND is_active = 1 
            AND valid_from <= GETDATE() 
            AND valid_until >= GETDATE()
        `);

      if (couponResult.recordset.length === 0) {
        return {
          isValid: false,
          message: 'Invalid or expired coupon code'
        };
      }

      const coupon = couponResult.recordset[0];

      // Check usage limits
      if (coupon.usage_limit && coupon.current_usage >= coupon.usage_limit) {
        return {
          isValid: false,
          message: 'Coupon usage limit exceeded'
        };
      }

      // Check minimum order amount
      if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
        return {
          isValid: false,
          message: `Minimum order amount of ₹${coupon.min_order_amount} required`
        };
      }

      // Check user usage limit if user is provided
      if (userId) {
        const userUsageResult = await connection.request()
          .input('couponId', sql.Int, coupon.id)
          .input('userId', sql.Int, userId)
          .query(`
            SELECT COUNT(*) as usage_count 
            FROM CouponUsage 
            WHERE coupon_id = @couponId AND user_id = @userId
          `);

        const userUsageCount = userUsageResult.recordset[0].usage_count;
        if (userUsageCount >= coupon.usage_per_user) {
          return {
            isValid: false,
            message: 'You have already used this coupon'
          };
        }
      }

      // Check service type compatibility
      if (coupon.category && coupon.category !== 'All Services' && serviceType) {
        const serviceCategory = this.getServiceCategory(serviceType);
        if (serviceCategory !== coupon.category) {
          return {
            isValid: false,
            message: `This coupon is only valid for ${coupon.category}`
          };
        }
      }

      // Calculate discount
      const discountAmount = this.calculateDiscount(coupon, orderAmount);
      const finalAmount = Math.max(0, orderAmount - discountAmount);

      return {
        isValid: true,
        coupon,
        discountAmount,
        finalAmount,
        message: 'Coupon is valid'
      };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return {
        isValid: false,
        message: 'Error validating coupon'
      };
    }
  }

  static async applyCoupon(data: CouponApplicationData): Promise<boolean> {
    try {
      const connection = await getConnection();
      
      // Begin transaction
      const transaction = new sql.Transaction(connection);
      await transaction.begin();

      try {
        // Record coupon usage
        await transaction.request()
          .input('couponId', sql.Int, data.couponId)
          .input('userId', sql.Int, data.userId)
          .input('bookingId', sql.Int, data.bookingId || null)
          .input('bookingType', sql.NVarChar, data.bookingType || null)
          .input('discountAmount', sql.Decimal(10, 2), data.discountAmount)
          .input('originalAmount', sql.Decimal(10, 2), data.originalAmount)
          .input('finalAmount', sql.Decimal(10, 2), data.finalAmount)
          .query(`
            INSERT INTO CouponUsage 
            (coupon_id, user_id, booking_id, booking_type, discount_amount, original_amount, final_amount)
            VALUES (@couponId, @userId, @bookingId, @bookingType, @discountAmount, @originalAmount, @finalAmount)
          `);

        // Update coupon usage count
        await transaction.request()
          .input('couponId', sql.Int, data.couponId)
          .query(`
            UPDATE Coupons 
            SET current_usage = current_usage + 1, updated_at = GETDATE()
            WHERE id = @couponId
          `);

        await transaction.commit();
        return true;
      } catch (transactionError) {
        await transaction.rollback();
        throw transactionError;
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      return false;
    }
  }

  static calculateDiscount(coupon: any, orderAmount: number): number {
    let discountAmount = 0;
    
    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderAmount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    } else if (coupon.discount_type === 'amount') {
      discountAmount = Math.min(coupon.discount_value, orderAmount);
    } else if (coupon.discount_type === 'bogo') {
      // Buy One Get One logic - for future implementation
      discountAmount = orderAmount * 0.5; // Simplified example
    } else if (coupon.discount_type === 'free') {
      // Free shipping or service - for future implementation
      discountAmount = coupon.discount_value;
    }

    return Math.round(discountAmount * 100) / 100; // Round to 2 decimal places
  }

  static getServiceCategory(serviceType: string): string {
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

  static async getUserCouponUsage(userId: number, couponId: number): Promise<number> {
    try {
      const connection = await getConnection();
      const result = await connection.request()
        .input('userId', sql.Int, userId)
        .input('couponId', sql.Int, couponId)
        .query(`
          SELECT COUNT(*) as usage_count 
          FROM CouponUsage 
          WHERE user_id = @userId AND coupon_id = @couponId
        `);

      return result.recordset[0].usage_count;
    } catch (error) {
      console.error('Error getting user coupon usage:', error);
      return 0;
    }
  }

  static async getActiveCoupons(userId?: number): Promise<any[]> {
    try {
      const connection = await getConnection();
      
      let query = `
        SELECT 
          c.*,
          ${userId ? `ISNULL(cu.usage_count, 0) as user_usage_count` : '0 as user_usage_count'}
        FROM Coupons c
        ${userId ? `
        LEFT JOIN (
          SELECT coupon_id, COUNT(*) as usage_count 
          FROM CouponUsage 
          WHERE user_id = @userId 
          GROUP BY coupon_id
        ) cu ON c.id = cu.coupon_id
        ` : ''}
        WHERE c.is_active = 1 
          AND c.valid_from <= GETDATE() 
          AND c.valid_until >= GETDATE()
          AND (c.usage_limit IS NULL OR c.current_usage < c.usage_limit)
          ${userId ? 'AND (cu.usage_count IS NULL OR cu.usage_count < c.usage_per_user)' : ''}
        ORDER BY 
          c.is_popular DESC,
          c.is_limited_time DESC,
          c.discount_value DESC
      `;

      const request = connection.request();
      if (userId) {
        request.input('userId', sql.Int, userId);
      }
      
      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error('Error getting active coupons:', error);
      return [];
    }
  }

  static async getCouponByCode(code: string): Promise<any | null> {
    try {
      const connection = await getConnection();
      const result = await connection.request()
        .input('code', sql.NVarChar, code.toUpperCase())
        .query(`
          SELECT * FROM Coupons 
          WHERE code = @code AND is_active = 1
        `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error('Error getting coupon by code:', error);
      return null;
    }
  }

  static async getCouponAnalytics(couponId: number) {
    try {
      const connection = await getConnection();
      const result = await connection.request()
        .input('couponId', sql.Int, couponId)
        .query(`
          SELECT 
            COUNT(*) as total_uses,
            SUM(discount_amount) as total_discount_given,
            AVG(discount_amount) as avg_discount,
            COUNT(DISTINCT user_id) as unique_users,
            MIN(used_at) as first_used,
            MAX(used_at) as last_used
          FROM CouponUsage 
          WHERE coupon_id = @couponId
        `);

      return result.recordset[0];
    } catch (error) {
      console.error('Error getting coupon analytics:', error);
      return null;
    }
  }

  static async getPopularCoupons(limit: number = 6): Promise<any[]> {
    try {
      const connection = await getConnection();
      const result = await connection.request()
        .input('limit', sql.Int, limit)
        .query(`
          SELECT TOP(@limit)
            c.*,
            ISNULL(cu.usage_count, 0) as total_usage
          FROM Coupons c
          LEFT JOIN (
            SELECT coupon_id, COUNT(*) as usage_count 
            FROM CouponUsage 
            GROUP BY coupon_id
          ) cu ON c.id = cu.coupon_id
          WHERE c.is_active = 1 
            AND c.valid_from <= GETDATE() 
            AND c.valid_until >= GETDATE()
          ORDER BY 
            c.is_popular DESC,
            cu.usage_count DESC,
            c.discount_value DESC
        `);

      return result.recordset;
    } catch (error) {
      console.error('Error getting popular coupons:', error);
      return [];
    }
  }
}

export default CouponService;
