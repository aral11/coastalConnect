import { RequestHandler } from "express";
import { BookingService } from "../services/booking";
import { PaymentService } from "../services/payments";
import { SMSService } from "../services/sms";
import { EmailService } from "../services/emailService";
import { AuthenticatedRequest } from "../middleware/auth";
import { CouponService } from "../services/couponService";

export const createHomestayBooking: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    const {
      homestay_id,
      check_in_date,
      check_out_date,
      guests,
      guest_name,
      guest_phone,
      guest_email,
      special_requests,
      coupon_code,
      original_amount
    } = req.body;

    // Get user ID from authentication middleware
    const user_id = req.user?.id;
    
    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!homestay_id || !check_in_date || !check_out_date || !guests || !guest_name || !guest_phone || !guest_email) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    let couponValidation = null;
    let finalAmount = original_amount;
    let discountAmount = 0;

    // Validate coupon if provided
    if (coupon_code && original_amount) {
      couponValidation = await CouponService.validateCoupon(
        coupon_code,
        user_id,
        original_amount,
        'homestay'
      );

      if (!couponValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: couponValidation.message || 'Invalid coupon code'
        });
      }

      finalAmount = couponValidation.finalAmount!;
      discountAmount = couponValidation.discountAmount!;
    }

    const result = await BookingService.createHomestayBooking({
      user_id,
      homestay_id: parseInt(homestay_id),
      check_in_date: new Date(check_in_date),
      check_out_date: new Date(check_out_date),
      guests: parseInt(guests),
      guest_name,
      guest_phone,
      guest_email,
      special_requests,
      final_amount: finalAmount
    });

    // Apply coupon if validation was successful
    if (couponValidation && couponValidation.isValid && couponValidation.coupon) {
      await CouponService.applyCoupon({
        couponId: couponValidation.coupon.id,
        userId: user_id,
        bookingId: result.booking.id,
        bookingType: 'homestay',
        discountAmount: discountAmount,
        originalAmount: original_amount,
        finalAmount: finalAmount
      });
    }

    // Send confirmation SMS to customer
    await SMSService.sendCustomerBookingConfirmation(guest_phone, {
      booking_reference: result.booking.booking_reference,
      type: 'homestay',
      details: `Check-in: ${new Date(check_in_date).toLocaleDateString('en-IN')}`,
      amount: result.booking.total_amount
    });

    res.status(201).json({
      success: true,
      data: {
        booking: result.booking,
        payment_intent: result.payment_intent,
        coupon: couponValidation ? {
          code: coupon_code,
          discountAmount: discountAmount,
          originalAmount: original_amount,
          finalAmount: finalAmount,
          savings: discountAmount
        } : null
      },
      message: 'Homestay booking created successfully'
    });
  } catch (error) {
    console.error('Error creating homestay booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create homestay booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createDriverBooking: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    const {
      driver_id,
      pickup_location,
      dropoff_location,
      pickup_datetime,
      passenger_name,
      passenger_phone,
      passengers_count,
      coupon_code,
      original_amount
    } = req.body;

    // Get user ID from authentication middleware
    const user_id = req.user?.id;
    
    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!driver_id || !pickup_location || !dropoff_location || !pickup_datetime || !passenger_name || !passenger_phone) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    let couponValidation = null;
    let finalAmount = original_amount;
    let discountAmount = 0;

    // Validate coupon if provided
    if (coupon_code && original_amount) {
      couponValidation = await CouponService.validateCoupon(
        coupon_code,
        user_id,
        original_amount,
        'transport'
      );

      if (!couponValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: couponValidation.message || 'Invalid coupon code'
        });
      }

      finalAmount = couponValidation.finalAmount!;
      discountAmount = couponValidation.discountAmount!;
    }

    const result = await BookingService.createDriverBooking({
      user_id,
      driver_id: parseInt(driver_id),
      pickup_location,
      dropoff_location,
      pickup_datetime: new Date(pickup_datetime),
      passenger_name,
      passenger_phone,
      passengers_count: parseInt(passengers_count) || 1,
      final_amount: finalAmount
    });

    // Apply coupon if validation was successful
    if (couponValidation && couponValidation.isValid && couponValidation.coupon) {
      await CouponService.applyCoupon({
        couponId: couponValidation.coupon.id,
        userId: user_id,
        bookingId: result.booking.id,
        bookingType: 'transport',
        discountAmount: discountAmount,
        originalAmount: original_amount,
        finalAmount: finalAmount
      });
    }

    // Get driver details for SMS
    const driverPhone = await BookingService.getDriverPhone(parseInt(driver_id));
    await SMSService.sendDriverBookingNotification(driverPhone, {
      booking_reference: result.booking.booking_reference,
      passenger_name,
      pickup_location,
      dropoff_location,
      pickup_datetime: new Date(pickup_datetime),
      trip_code: result.booking.trip_code,
      total_amount: result.booking.total_amount
    });

    // Send confirmation to customer
    await SMSService.sendCustomerBookingConfirmation(passenger_phone, {
      booking_reference: result.booking.booking_reference,
      type: 'driver',
      details: `${pickup_location} to ${dropoff_location}`,
      amount: result.booking.total_amount
    });

    res.status(201).json({
      success: true,
      data: {
        booking: result.booking,
        payment_intent: result.payment_intent,
        coupon: couponValidation ? {
          code: coupon_code,
          discountAmount: discountAmount,
          originalAmount: original_amount,
          finalAmount: finalAmount,
          savings: discountAmount
        } : null
      },
      message: 'Driver booking created successfully'
    });
  } catch (error) {
    console.error('Error creating driver booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create driver booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const confirmPayment: RequestHandler = async (req, res) => {
  try {
    const { order_id, payment_id, signature, booking_id, booking_type } = req.body;

    if (!order_id || !payment_id || !signature || !booking_id || !booking_type) {
      return res.status(400).json({
        success: false,
        message: 'Payment details are required'
      });
    }

    // Verify payment with Razorpay
    const payment = await PaymentService.confirmPayment(order_id, payment_id, signature);

    // Update booking status
    await BookingService.confirmPayment(parseInt(booking_id), booking_type);

    // Note: Booking stats are tracked separately in the database
    console.log('✅ Booking confirmed successfully');

    // Get booking details for notifications
    const bookingDetails = await BookingService.getBookingDetails(parseInt(booking_id), booking_type);

    // Send email and SMS confirmations
    if (bookingDetails) {
      try {
        // Send email confirmation
        await EmailService.sendBookingConfirmation({
          id: booking_id,
          type: booking_type,
          contactInfo: {
            name: bookingDetails.guest_name || bookingDetails.passenger_name,
            email: bookingDetails.guest_email || bookingDetails.passenger_email,
            phone: bookingDetails.guest_phone || bookingDetails.passenger_phone
          },
          item: {
            name: bookingDetails.item_name,
            location: bookingDetails.location,
            image: bookingDetails.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
          },
          bookingReference: bookingDetails.booking_reference,
          checkIn: bookingDetails.check_in_date || bookingDetails.pickup_datetime,
          checkOut: bookingDetails.check_out_date,
          guests: bookingDetails.guests || 1,
          totalAmount: bookingDetails.total_amount,
          paymentId: payment_id,
          specialRequests: bookingDetails.special_requests
        });

        // Send SMS confirmation
        await SMSService.sendBookingConfirmation(
          bookingDetails.guest_phone || bookingDetails.passenger_phone,
          {
            bookingReference: bookingDetails.booking_reference,
            itemName: bookingDetails.item_name,
            checkIn: bookingDetails.check_in_date || bookingDetails.pickup_datetime,
            totalAmount: bookingDetails.total_amount
          }
        );
      } catch (notificationError) {
        console.error('Failed to send confirmation notifications:', notificationError);
        // Don't fail the entire request if notifications fail
      }
    }

    res.json({
      success: true,
      data: { payment, booking: bookingDetails },
      message: 'Payment confirmed successfully. Confirmation email and SMS sent.'
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment confirmation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserBookings: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    // Get user ID from authentication middleware
    const user_id = req.user?.id;
    
    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const bookings = await BookingService.getUserBookings(user_id);

    res.json({
      success: true,
      data: bookings,
      message: 'Bookings retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateDriverBookingStatus: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    const { booking_id } = req.params;
    const { status, trip_code } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Verify trip code for certain status updates
    if (status === 'in_progress' && !trip_code) {
      return res.status(400).json({
        success: false,
        message: 'Trip code is required to start trip'
      });
    }

    const bookingDetails = await BookingService.updateDriverBookingStatus(parseInt(booking_id), status);

    // Send appropriate notifications based on status
    if (status === 'accepted' && bookingDetails) {
      await SMSService.sendDriverAcceptanceNotification(bookingDetails.passenger_phone, {
        name: bookingDetails.driver_name,
        phone: bookingDetails.driver_phone,
        vehicle_type: bookingDetails.vehicle_type,
        vehicle_number: bookingDetails.vehicle_number,
        trip_code: bookingDetails.trip_code
      });
    } else if (status === 'in_progress' && bookingDetails) {
      await SMSService.sendTripStartedNotification(
        bookingDetails.passenger_phone, 
        bookingDetails.driver_name, 
        bookingDetails.vehicle_number, 
        bookingDetails.estimated_duration || 60
      );
    } else if (status === 'completed' && bookingDetails) {
      await SMSService.sendTripCompletedNotification(bookingDetails.passenger_phone, {
        driver_name: bookingDetails.driver_name,
        duration: bookingDetails.actual_duration || 45,
        amount: bookingDetails.total_amount,
        booking_reference: bookingDetails.booking_reference
      });
    }

    res.json({
      success: true,
      message: `Booking status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const validateTripCode: RequestHandler = async (req, res) => {
  try {
    const { trip_code, booking_id } = req.body;

    if (!trip_code || !booking_id) {
      return res.status(400).json({
        success: false,
        message: 'Trip code and booking ID are required'
      });
    }

    const isValid = await BookingService.validateTripCode(parseInt(booking_id), trip_code);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip code'
      });
    }

    res.json({
      success: true,
      message: 'Trip code validated successfully'
    });
  } catch (error) {
    console.error('Error validating trip code:', error);
    res.status(500).json({
      success: false,
      message: 'Trip code validation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
