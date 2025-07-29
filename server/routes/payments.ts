import { RequestHandler } from "express";
import { PaymentService, PaymentRequest } from "../services/paymentService";
import { AuthService } from "../services/auth";

// Create payment order/intent
export const createPayment: RequestHandler = async (req, res) => {
  try {
    const { 
      amount, 
      currency = 'INR', 
      booking_id, 
      gateway = 'razorpay',
      description,
      metadata 
    } = req.body;

    // Validate required fields
    if (!amount || !booking_id) {
      return res.status(400).json({
        success: false,
        message: 'Amount and booking_id are required'
      });
    }

    // Get user from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let user;
    try {
      const decoded = AuthService.verifyToken(token);
      user = await AuthService.findUserById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    // Prepare payment request
    const paymentRequest: PaymentRequest = {
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: currency.toUpperCase(),
      booking_id,
      user_id: user.id,
      user_email: user.email,
      user_name: user.name,
      user_phone: user.phone,
      description: description || `Payment for booking ${booking_id}`,
      metadata
    };

    let paymentResponse;
    
    if (gateway === 'razorpay') {
      paymentResponse = await PaymentService.createRazorpayOrder(paymentRequest);
    } else if (gateway === 'stripe') {
      paymentResponse = await PaymentService.createStripePaymentIntent(paymentRequest);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported payment gateway'
      });
    }

    if (paymentResponse.success) {
      res.json({
        success: true,
        data: paymentResponse,
        message: 'Payment order created successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to create payment order',
        error: paymentResponse.error
      });
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment: RequestHandler = async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        message: 'order_id, payment_id, and signature are required'
      });
    }

    const verification = await PaymentService.verifyRazorpayPayment(
      order_id,
      payment_id,
      signature
    );

    if (verification.success) {
      // Update booking status to confirmed
      await updateBookingPaymentStatus(order_id, 'paid');
      
      res.json({
        success: true,
        data: verification,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: verification.error
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Verify Stripe payment
export const verifyStripePayment: RequestHandler = async (req, res) => {
  try {
    const { payment_intent_id } = req.body;

    if (!payment_intent_id) {
      return res.status(400).json({
        success: false,
        message: 'payment_intent_id is required'
      });
    }

    const verification = await PaymentService.verifyStripePayment(payment_intent_id);

    if (verification.success) {
      // Update booking status to confirmed
      await updateBookingPaymentStatus(payment_intent_id, 'paid');
      
      res.json({
        success: true,
        data: verification,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        error: verification.error
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Process refund
export const processRefund: RequestHandler = async (req, res) => {
  try {
    const { payment_id, amount, reason } = req.body;

    if (!payment_id) {
      return res.status(400).json({
        success: false,
        message: 'payment_id is required'
      });
    }

    // Check if user has permission (admin or booking owner)
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let user;
    try {
      const decoded = AuthService.verifyToken(token);
      user = await AuthService.findUserById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    // Only admins can process refunds for now
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const refundResult = await PaymentService.processRefund(payment_id, amount, reason);

    if (refundResult.success) {
      res.json({
        success: true,
        data: refundResult,
        message: 'Refund processed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Refund processing failed',
        error: refundResult.error
      });
    }
  } catch (error) {
    console.error('Refund processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get available payment methods
export const getPaymentMethods: RequestHandler = async (req, res) => {
  try {
    const { currency = 'INR', country = 'IN' } = req.query;
    
    const methods = PaymentService.getAvailablePaymentMethods(
      currency as string, 
      country as string
    );

    res.json({
      success: true,
      data: methods,
      message: 'Payment methods retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting payment methods:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Stripe webhook handler
export const stripeWebhook: RequestHandler = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return res.status(500).send('Webhook secret not configured');
    }

    // Verify webhook signature
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Update booking status
        await updateBookingPaymentStatus(paymentIntent.id, 'paid');
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        // Update booking status
        await updateBookingPaymentStatus(failedPayment.id, 'failed');
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
};

// Helper function to update booking payment status
async function updateBookingPaymentStatus(payment_id: string, status: string) {
  try {
    const { getConnection } = await import('../db/connection');
    const connection = await getConnection();
    
    await connection.request()
      .input('payment_id', payment_id)
      .input('status', status)
      .query(`
        UPDATE ProfessionalBookings 
        SET payment_status = @status, updated_at = GETDATE()
        WHERE payment_id = @payment_id
      `);
    
    console.log(`Updated booking payment status to ${status} for payment ${payment_id}`);
  } catch (error) {
    console.error('Failed to update booking payment status:', error);
  }
}
