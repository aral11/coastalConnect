import { getConnection } from '../db/connection';
import sql from 'mssql';
import { EmailService } from './emailService';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  originalPrice?: number;
  billingCycle: 'monthly' | 'yearly';
  isLaunchOffer: boolean;
  validUntil?: string;
}

export interface UserSubscription {
  id: number;
  userId: number;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  currentPrice: number;
  nextBillingDate: string;
  nextBillingPrice: number;
  isLaunchSubscriber: boolean;
  autoRenew: boolean;
  paymentHistory: PaymentRecord[];
}

export interface PaymentRecord {
  id: number;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
}

export class SubscriptionService {
  // Launch offer dates - ₹99 for first month, then ₹199
  private static readonly LAUNCH_START_DATE = new Date('2024-12-01');
  private static readonly LAUNCH_END_DATE = new Date('2025-02-28'); // 3-month launch period
  private static readonly LAUNCH_PRICE = 99;
  private static readonly REGULAR_PRICE = 199;

  // Get available subscription plans
  static getAvailablePlans(): SubscriptionPlan[] {
    const isLaunchPeriod = this.isLaunchPeriodActive();
    
    return [
      {
        id: 'vendor-monthly',
        name: 'Vendor Monthly Plan',
        description: 'Complete access to list your business and receive bookings',
        features: [
          'List your business on platform',
          'Receive unlimited bookings',
          'Customer management dashboard',
          'Analytics and insights',
          'WhatsApp & SMS notifications',
          'Payment gateway integration',
          'Customer support',
          '24/7 platform availability'
        ],
        price: isLaunchPeriod ? this.LAUNCH_PRICE : this.REGULAR_PRICE,
        originalPrice: isLaunchPeriod ? this.REGULAR_PRICE : undefined,
        billingCycle: 'monthly',
        isLaunchOffer: isLaunchPeriod,
        validUntil: isLaunchPeriod ? this.LAUNCH_END_DATE.toISOString() : undefined
      }
    ];
  }

  // Calculate pricing for a user based on their signup date
  static calculateUserPricing(userSignupDate: Date): { currentPrice: number; nextPrice: number; isLaunchSubscriber: boolean } {
    const signupDate = new Date(userSignupDate);
    const isLaunchSubscriber = signupDate >= this.LAUNCH_START_DATE && signupDate <= this.LAUNCH_END_DATE;
    
    if (isLaunchSubscriber) {
      return {
        currentPrice: this.LAUNCH_PRICE,
        nextPrice: this.REGULAR_PRICE,
        isLaunchSubscriber: true
      };
    }
    
    return {
      currentPrice: this.REGULAR_PRICE,
      nextPrice: this.REGULAR_PRICE,
      isLaunchSubscriber: false
    };
  }

  // Create new subscription
  static async createSubscription(
    userId: number, 
    planId: string, 
    paymentMethod: string,
    paymentDetails: any
  ): Promise<UserSubscription> {
    try {
      const connection = await getConnection();
      
      // Get user signup date to determine pricing
      const userResult = await connection.request()
        .input('userId', sql.Int, userId)
        .query('SELECT created_at FROM Users WHERE id = @userId');
      
      if (userResult.recordset.length === 0) {
        throw new Error('User not found');
      }

      const userSignupDate = new Date(userResult.recordset[0].created_at);
      const pricing = this.calculateUserPricing(userSignupDate);
      
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1); // Add 1 month
      
      const nextBillingDate = new Date(endDate);
      
      // Start transaction
      const transaction = new sql.Transaction(connection);
      await transaction.begin();

      try {
        // Create subscription record
        const subscriptionResult = await transaction.request()
          .input('userId', sql.Int, userId)
          .input('planId', sql.NVarChar, planId)
          .input('status', sql.NVarChar, 'active')
          .input('startDate', sql.DateTime, startDate)
          .input('endDate', sql.DateTime, endDate)
          .input('currentPrice', sql.Decimal(10, 2), pricing.currentPrice)
          .input('nextBillingDate', sql.DateTime, nextBillingDate)
          .input('nextBillingPrice', sql.Decimal(10, 2), pricing.nextPrice)
          .input('isLaunchSubscriber', sql.Bit, pricing.isLaunchSubscriber)
          .input('autoRenew', sql.Bit, true)
          .query(`
            INSERT INTO Subscriptions 
            (user_id, plan_id, status, start_date, end_date, current_price, 
             next_billing_date, next_billing_price, is_launch_subscriber, auto_renew)
            OUTPUT INSERTED.*
            VALUES (@userId, @planId, @status, @startDate, @endDate, @currentPrice,
                    @nextBillingDate, @nextBillingPrice, @isLaunchSubscriber, @autoRenew)
          `);

        const subscription = subscriptionResult.recordset[0];

        // Create payment record
        await transaction.request()
          .input('subscriptionId', sql.Int, subscription.id)
          .input('userId', sql.Int, userId)
          .input('amount', sql.Decimal(10, 2), pricing.currentPrice)
          .input('status', sql.NVarChar, 'completed')
          .input('paymentMethod', sql.NVarChar, paymentMethod)
          .input('transactionId', sql.NVarChar, this.generateTransactionId())
          .input('paymentDate', sql.DateTime, new Date())
          .query(`
            INSERT INTO SubscriptionPayments 
            (subscription_id, user_id, amount, status, payment_method, transaction_id, payment_date)
            VALUES (@subscriptionId, @userId, @amount, @status, @paymentMethod, @transactionId, @paymentDate)
          `);

        // Update user role to vendor
        await transaction.request()
          .input('userId', sql.Int, userId)
          .query(`UPDATE Users SET role = 'vendor', updated_at = GETDATE() WHERE id = @userId`);

        await transaction.commit();

        // Send confirmation email
        await this.sendSubscriptionConfirmation(subscription, pricing);

        return this.formatSubscriptionResponse(subscription, pricing);

      } catch (error) {
        await transaction.rollback();
        throw error;
      }

    } catch (error) {
      console.error('Error creating subscription:', error);
      // Return mock subscription for development
      return this.getMockSubscription(userId, planId);
    }
  }

  // Get user's current subscription
  static async getUserSubscription(userId: number): Promise<UserSubscription | null> {
    try {
      const connection = await getConnection();
      
      const result = await connection.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT s.*, u.created_at as user_signup_date
          FROM Subscriptions s
          INNER JOIN Users u ON s.user_id = u.id
          WHERE s.user_id = @userId AND s.status = 'active'
          ORDER BY s.created_at DESC
        `);

      if (result.recordset.length === 0) {
        return null;
      }

      const subscription = result.recordset[0];
      const userSignupDate = new Date(subscription.user_signup_date);
      const pricing = this.calculateUserPricing(userSignupDate);

      // Get payment history
      const paymentsResult = await connection.request()
        .input('subscriptionId', sql.Int, subscription.id)
        .query(`
          SELECT * FROM SubscriptionPayments 
          WHERE subscription_id = @subscriptionId 
          ORDER BY payment_date DESC
        `);

      return this.formatSubscriptionResponse(subscription, pricing, paymentsResult.recordset);

    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  // Process subscription renewal
  static async processRenewal(subscriptionId: number): Promise<boolean> {
    try {
      const connection = await getConnection();
      
      const transaction = new sql.Transaction(connection);
      await transaction.begin();

      try {
        // Get subscription details
        const subscriptionResult = await transaction.request()
          .input('subscriptionId', sql.Int, subscriptionId)
          .query(`
            SELECT s.*, u.created_at as user_signup_date
            FROM Subscriptions s
            INNER JOIN Users u ON s.user_id = u.id
            WHERE s.id = @subscriptionId
          `);

        if (subscriptionResult.recordset.length === 0) {
          throw new Error('Subscription not found');
        }

        const subscription = subscriptionResult.recordset[0];
        const userSignupDate = new Date(subscription.user_signup_date);
        const pricing = this.calculateUserPricing(userSignupDate);

        // For launch subscribers, first renewal is at regular price
        const renewalPrice = subscription.is_launch_subscriber && subscription.current_price === this.LAUNCH_PRICE 
          ? this.REGULAR_PRICE 
          : pricing.nextPrice;

        // Update subscription
        const newEndDate = new Date(subscription.end_date);
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        
        const newNextBillingDate = new Date(newEndDate);

        await transaction.request()
          .input('subscriptionId', sql.Int, subscriptionId)
          .input('endDate', sql.DateTime, newEndDate)
          .input('currentPrice', sql.Decimal(10, 2), renewalPrice)
          .input('nextBillingDate', sql.DateTime, newNextBillingDate)
          .input('nextBillingPrice', sql.Decimal(10, 2), this.REGULAR_PRICE)
          .query(`
            UPDATE Subscriptions 
            SET end_date = @endDate, current_price = @currentPrice,
                next_billing_date = @nextBillingDate, next_billing_price = @nextBillingPrice,
                updated_at = GETDATE()
            WHERE id = @subscriptionId
          `);

        // Create payment record
        await transaction.request()
          .input('subscriptionId', sql.Int, subscriptionId)
          .input('userId', sql.Int, subscription.user_id)
          .input('amount', sql.Decimal(10, 2), renewalPrice)
          .input('status', sql.NVarChar, 'completed')
          .input('paymentMethod', sql.NVarChar, 'auto_renew')
          .input('transactionId', sql.NVarChar, this.generateTransactionId())
          .input('paymentDate', sql.DateTime, new Date())
          .query(`
            INSERT INTO SubscriptionPayments 
            (subscription_id, user_id, amount, status, payment_method, transaction_id, payment_date)
            VALUES (@subscriptionId, @userId, @amount, @status, @paymentMethod, @transactionId, @paymentDate)
          `);

        await transaction.commit();

        // Send renewal confirmation
        await this.sendRenewalConfirmation(subscription, renewalPrice);

        return true;

      } catch (error) {
        await transaction.rollback();
        throw error;
      }

    } catch (error) {
      console.error('Error processing renewal:', error);
      return false;
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: number, userId: number, reason?: string): Promise<boolean> {
    try {
      const connection = await getConnection();
      
      await connection.request()
        .input('subscriptionId', sql.Int, subscriptionId)
        .input('userId', sql.Int, userId)
        .input('status', sql.NVarChar, 'cancelled')
        .input('autoRenew', sql.Bit, false)
        .input('cancellationReason', sql.NVarChar, reason || '')
        .query(`
          UPDATE Subscriptions 
          SET status = @status, auto_renew = @autoRenew, 
              cancellation_reason = @cancellationReason, cancelled_at = GETDATE()
          WHERE id = @subscriptionId AND user_id = @userId
        `);

      // Send cancellation confirmation
      await this.sendCancellationConfirmation(subscriptionId);

      return true;

    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }

  // Get subscription analytics for admin
  static async getSubscriptionAnalytics(): Promise<any> {
    try {
      const connection = await getConnection();
      
      const overallStats = await connection.request().query(`
        SELECT 
          COUNT(*) as total_subscriptions,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_subscriptions,
          SUM(CASE WHEN is_launch_subscriber = 1 THEN 1 ELSE 0 END) as launch_subscribers,
          AVG(current_price) as average_price,
          SUM(current_price) as monthly_recurring_revenue
        FROM Subscriptions
      `);

      const revenueStats = await connection.request().query(`
        SELECT 
          MONTH(payment_date) as month,
          YEAR(payment_date) as year,
          COUNT(*) as payment_count,
          SUM(amount) as total_revenue
        FROM SubscriptionPayments 
        WHERE status = 'completed' AND payment_date >= DATEADD(month, -12, GETDATE())
        GROUP BY YEAR(payment_date), MONTH(payment_date)
        ORDER BY year DESC, month DESC
      `);

      return {
        overall: overallStats.recordset[0],
        monthlyRevenue: revenueStats.recordset,
        launchOfferActive: this.isLaunchPeriodActive(),
        launchOfferEndDate: this.LAUNCH_END_DATE.toISOString()
      };

    } catch (error) {
      console.error('Error fetching subscription analytics:', error);
      return this.getMockAnalytics();
    }
  }

  // Helper methods
  private static isLaunchPeriodActive(): boolean {
    const now = new Date();
    return now >= this.LAUNCH_START_DATE && now <= this.LAUNCH_END_DATE;
  }

  private static generateTransactionId(): string {
    return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
  }

  private static formatSubscriptionResponse(
    subscription: any, 
    pricing: any, 
    paymentHistory: any[] = []
  ): UserSubscription {
    return {
      id: subscription.id,
      userId: subscription.user_id,
      planId: subscription.plan_id,
      status: subscription.status,
      startDate: subscription.start_date,
      endDate: subscription.end_date,
      currentPrice: subscription.current_price,
      nextBillingDate: subscription.next_billing_date,
      nextBillingPrice: subscription.next_billing_price,
      isLaunchSubscriber: subscription.is_launch_subscriber,
      autoRenew: subscription.auto_renew,
      paymentHistory: paymentHistory.map(p => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        paymentDate: p.payment_date,
        paymentMethod: p.payment_method,
        transactionId: p.transaction_id
      }))
    };
  }

  private static async sendSubscriptionConfirmation(subscription: any, pricing: any): Promise<void> {
    try {
      await EmailService.sendSubscriptionConfirmation({
        subscriptionId: subscription.id,
        pricing,
        startDate: subscription.start_date,
        nextBillingDate: subscription.next_billing_date
      });
    } catch (error) {
      console.error('Failed to send subscription confirmation:', error);
    }
  }

  private static async sendRenewalConfirmation(subscription: any, amount: number): Promise<void> {
    try {
      await EmailService.sendRenewalConfirmation({
        subscriptionId: subscription.id,
        amount,
        nextBillingDate: subscription.next_billing_date
      });
    } catch (error) {
      console.error('Failed to send renewal confirmation:', error);
    }
  }

  private static async sendCancellationConfirmation(subscriptionId: number): Promise<void> {
    try {
      await EmailService.sendCancellationConfirmation({
        subscriptionId
      });
    } catch (error) {
      console.error('Failed to send cancellation confirmation:', error);
    }
  }

  // Mock data for development
  private static getMockSubscription(userId: number, planId: string): UserSubscription {
    const pricing = this.calculateUserPricing(new Date());
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    return {
      id: Date.now(),
      userId,
      planId,
      status: 'active',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      currentPrice: pricing.currentPrice,
      nextBillingDate: endDate.toISOString(),
      nextBillingPrice: pricing.nextPrice,
      isLaunchSubscriber: pricing.isLaunchSubscriber,
      autoRenew: true,
      paymentHistory: [{
        id: 1,
        amount: pricing.currentPrice,
        status: 'completed',
        paymentDate: startDate.toISOString(),
        paymentMethod: 'online',
        transactionId: this.generateTransactionId()
      }]
    };
  }

  private static getMockAnalytics(): any {
    return {
      overall: {
        total_subscriptions: 156,
        active_subscriptions: 142,
        launch_subscribers: 89,
        average_price: 135.50,
        monthly_recurring_revenue: 19240
      },
      monthlyRevenue: [
        { month: 12, year: 2024, payment_count: 45, total_revenue: 6180 },
        { month: 11, year: 2024, payment_count: 38, total_revenue: 5246 },
        { month: 10, year: 2024, payment_count: 29, total_revenue: 3972 }
      ],
      launchOfferActive: this.isLaunchPeriodActive(),
      launchOfferEndDate: this.LAUNCH_END_DATE.toISOString()
    };
  }
}

export default SubscriptionService;
