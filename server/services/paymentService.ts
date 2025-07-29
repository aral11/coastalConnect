import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';
import { getConnection } from '../db/connection';

// Environment variables for payment gateways
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize payment gateways
let razorpay: Razorpay | null = null;
let stripe: Stripe | null = null;

if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
}

export interface PaymentRequest {
  amount: number; // Amount in smallest currency unit (paise for INR, cents for USD)
  currency: string; // 'INR', 'USD', etc.
  booking_id: string;
  user_id: number;
  user_email: string;
  user_name: string;
  user_phone?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  payment_id?: string;
  order_id?: string;
  gateway: 'razorpay' | 'stripe';
  amount: number;
  currency: string;
  status: 'created' | 'pending' | 'paid' | 'failed' | 'cancelled';
  gateway_response?: any;
  error?: string;
}

export interface PaymentVerification {
  success: boolean;
  payment_id?: string;
  order_id?: string;
  gateway: 'razorpay' | 'stripe';
  status: 'paid' | 'failed' | 'cancelled';
  amount?: number;
  currency?: string;
  error?: string;
}

export class PaymentService {
  // Create Razorpay order
  static async createRazorpayOrder(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!razorpay) {
        throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
      }

      const order = await razorpay.orders.create({
        amount: request.amount,
        currency: request.currency,
        receipt: `receipt_${request.booking_id}`,
        notes: {
          booking_id: request.booking_id,
          user_id: request.user_id.toString(),
          ...request.metadata
        }
      });

      // Save payment record to database
      await this.savePaymentRecord({
        payment_id: order.id,
        order_id: order.id,
        gateway: 'razorpay',
        booking_id: request.booking_id,
        user_id: request.user_id,
        amount: request.amount,
        currency: request.currency,
        status: 'created',
        gateway_response: order
      });

      return {
        success: true,
        payment_id: order.id,
        order_id: order.id,
        gateway: 'razorpay',
        amount: request.amount,
        currency: request.currency,
        status: 'created',
        gateway_response: order
      };
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      return {
        success: false,
        gateway: 'razorpay',
        amount: request.amount,
        currency: request.currency,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Create Stripe Payment Intent
  static async createStripePaymentIntent(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!stripe) {
        throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: request.amount,
        currency: request.currency.toLowerCase(),
        customer_email: request.user_email,
        description: request.description,
        metadata: {
          booking_id: request.booking_id,
          user_id: request.user_id.toString(),
          ...request.metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Save payment record to database
      await this.savePaymentRecord({
        payment_id: paymentIntent.id,
        order_id: paymentIntent.id,
        gateway: 'stripe',
        booking_id: request.booking_id,
        user_id: request.user_id,
        amount: request.amount,
        currency: request.currency,
        status: 'created',
        gateway_response: paymentIntent
      });

      return {
        success: true,
        payment_id: paymentIntent.id,
        order_id: paymentIntent.id,
        gateway: 'stripe',
        amount: request.amount,
        currency: request.currency,
        status: 'created',
        gateway_response: {
          client_secret: paymentIntent.client_secret,
          id: paymentIntent.id
        }
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      return {
        success: false,
        gateway: 'stripe',
        amount: request.amount,
        currency: request.currency,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Verify Razorpay payment
  static async verifyRazorpayPayment(
    order_id: string,
    payment_id: string,
    signature: string
  ): Promise<PaymentVerification> {
    try {
      if (!razorpay || !RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay not configured');
      }

      // Verify signature
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(order_id + '|' + payment_id)
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new Error('Invalid payment signature');
      }

      // Fetch payment details from Razorpay
      const payment = await razorpay.payments.fetch(payment_id);
      
      if (payment.status === 'captured') {
        // Update payment record in database
        await this.updatePaymentRecord(order_id, {
          status: 'paid',
          payment_id: payment_id,
          gateway_response: payment
        });

        return {
          success: true,
          payment_id: payment_id,
          order_id: order_id,
          gateway: 'razorpay',
          status: 'paid',
          amount: payment.amount,
          currency: payment.currency
        };
      } else {
        await this.updatePaymentRecord(order_id, {
          status: 'failed',
          gateway_response: payment
        });

        return {
          success: false,
          payment_id: payment_id,
          order_id: order_id,
          gateway: 'razorpay',
          status: 'failed',
          error: `Payment status: ${payment.status}`
        };
      }
    } catch (error) {
      console.error('Razorpay payment verification failed:', error);
      return {
        success: false,
        order_id: order_id,
        gateway: 'razorpay',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Verify Stripe payment
  static async verifyStripePayment(payment_intent_id: string): Promise<PaymentVerification> {
    try {
      if (!stripe) {
        throw new Error('Stripe not configured');
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
      
      if (paymentIntent.status === 'succeeded') {
        // Update payment record in database
        await this.updatePaymentRecord(payment_intent_id, {
          status: 'paid',
          gateway_response: paymentIntent
        });

        return {
          success: true,
          payment_id: payment_intent_id,
          order_id: payment_intent_id,
          gateway: 'stripe',
          status: 'paid',
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        };
      } else {
        await this.updatePaymentRecord(payment_intent_id, {
          status: 'failed',
          gateway_response: paymentIntent
        });

        return {
          success: false,
          payment_id: payment_intent_id,
          order_id: payment_intent_id,
          gateway: 'stripe',
          status: 'failed',
          error: `Payment status: ${paymentIntent.status}`
        };
      }
    } catch (error) {
      console.error('Stripe payment verification failed:', error);
      return {
        success: false,
        order_id: payment_intent_id,
        gateway: 'stripe',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Process refund
  static async processRefund(
    payment_id: string,
    amount?: number,
    reason?: string
  ): Promise<{ success: boolean; refund_id?: string; error?: string }> {
    try {
      // Get payment record from database
      const paymentRecord = await this.getPaymentRecord(payment_id);
      if (!paymentRecord) {
        throw new Error('Payment record not found');
      }

      let refund;
      if (paymentRecord.gateway === 'razorpay' && razorpay) {
        refund = await razorpay.payments.refund(payment_id, {
          amount: amount || paymentRecord.amount,
          notes: { reason: reason || 'Customer requested refund' }
        });
      } else if (paymentRecord.gateway === 'stripe' && stripe) {
        refund = await stripe.refunds.create({
          payment_intent: payment_id,
          amount: amount || paymentRecord.amount,
          reason: 'requested_by_customer'
        });
      } else {
        throw new Error('Payment gateway not available for refund');
      }

      // Update payment record
      await this.updatePaymentRecord(payment_id, {
        status: 'refunded',
        refund_id: refund.id,
        gateway_response: refund
      });

      return {
        success: true,
        refund_id: refund.id
      };
    } catch (error) {
      console.error('Refund processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Save payment record to database
  private static async savePaymentRecord(record: {
    payment_id: string;
    order_id: string;
    gateway: 'razorpay' | 'stripe';
    booking_id: string;
    user_id: number;
    amount: number;
    currency: string;
    status: string;
    gateway_response: any;
  }): Promise<void> {
    try {
      const connection = await getConnection();
      
      await connection.request()
        .input('payment_id', record.payment_id)
        .input('order_id', record.order_id)
        .input('gateway', record.gateway)
        .input('booking_id', record.booking_id)
        .input('user_id', record.user_id)
        .input('amount', record.amount)
        .input('currency', record.currency)
        .input('status', record.status)
        .input('gateway_response', JSON.stringify(record.gateway_response))
        .query(`
          INSERT INTO Payments (payment_id, order_id, gateway, booking_id, user_id, amount, currency, status, gateway_response, created_at)
          VALUES (@payment_id, @order_id, @gateway, @booking_id, @user_id, @amount, @currency, @status, @gateway_response, GETDATE())
        `);
    } catch (error) {
      console.error('Failed to save payment record:', error);
      // Don't throw error, as payment might still succeed
    }
  }

  // Update payment record in database
  private static async updatePaymentRecord(
    payment_id: string, 
    updates: {
      status?: string;
      payment_id?: string;
      refund_id?: string;
      gateway_response?: any;
    }
  ): Promise<void> {
    try {
      const connection = await getConnection();
      
      const updateFields = [];
      const request = connection.request().input('payment_id', payment_id);
      
      if (updates.status) {
        updateFields.push('status = @status');
        request.input('status', updates.status);
      }
      
      if (updates.refund_id) {
        updateFields.push('refund_id = @refund_id');
        request.input('refund_id', updates.refund_id);
      }
      
      if (updates.gateway_response) {
        updateFields.push('gateway_response = @gateway_response');
        request.input('gateway_response', JSON.stringify(updates.gateway_response));
      }
      
      updateFields.push('updated_at = GETDATE()');
      
      await request.query(`
        UPDATE Payments 
        SET ${updateFields.join(', ')}
        WHERE payment_id = @payment_id OR order_id = @payment_id
      `);
    } catch (error) {
      console.error('Failed to update payment record:', error);
    }
  }

  // Get payment record from database
  private static async getPaymentRecord(payment_id: string): Promise<any> {
    try {
      const connection = await getConnection();
      
      const result = await connection.request()
        .input('payment_id', payment_id)
        .query(`
          SELECT * FROM Payments 
          WHERE payment_id = @payment_id OR order_id = @payment_id
        `);
      
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Failed to get payment record:', error);
      return null;
    }
  }

  // Get available payment methods based on currency and country
  static getAvailablePaymentMethods(currency: string = 'INR', country: string = 'IN') {
    const methods = [];
    
    if (currency === 'INR' && razorpay) {
      methods.push({
        gateway: 'razorpay',
        methods: ['upi', 'card', 'netbanking', 'wallet', 'emi'],
        currency: 'INR',
        name: 'Razorpay',
        description: 'UPI, Cards, Net Banking, Wallets'
      });
    }
    
    if (stripe) {
      methods.push({
        gateway: 'stripe',
        methods: ['card', 'apple_pay', 'google_pay'],
        currency: currency.toUpperCase(),
        name: 'Stripe',
        description: 'International Cards, Apple Pay, Google Pay'
      });
    }
    
    return methods;
  }
}
