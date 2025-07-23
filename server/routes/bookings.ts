import { RequestHandler } from "express";
import { BookingService } from "../services/booking";
import { PaymentService } from "../services/payments";
import { SMSService } from "../services/sms";

export const createHomestayBooking: RequestHandler = async (req, res) => {
  try {
    const {
      homestay_id,
      check_in_date,
      check_out_date,
      guests,
      guest_name,
      guest_phone,
      guest_email,
      special_requests
    } = req.body;

    // Get user ID from token (mock for now)
    const user_id = 1; // This should come from authentication middleware

    if (!homestay_id || !check_in_date || !check_out_date || !guests || !guest_name || !guest_phone || !guest_email) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
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
      special_requests
    });

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
        payment_intent: result.payment_intent
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

export const createDriverBooking: RequestHandler = async (req, res) => {
  try {
    const {
      driver_id,
      pickup_location,
      dropoff_location,
      pickup_datetime,
      passenger_name,
      passenger_phone,
      passengers_count
    } = req.body;

    // Get user ID from token (mock for now)
    const user_id = 1; // This should come from authentication middleware

    if (!driver_id || !pickup_location || !dropoff_location || !pickup_datetime || !passenger_name || !passenger_phone) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const result = await BookingService.createDriverBooking({
      user_id,
      driver_id: parseInt(driver_id),
      pickup_location,
      dropoff_location,
      pickup_datetime: new Date(pickup_datetime),
      passenger_name,
      passenger_phone,
      passengers_count: parseInt(passengers_count) || 1
    });

    // Send notification to driver (mock driver phone)
    const driverPhone = '+91 98456 78901'; // This should come from driver data
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
        payment_intent: result.payment_intent
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

    res.json({
      success: true,
      data: { payment },
      message: 'Payment confirmed successfully'
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

export const getUserBookings: RequestHandler = async (req, res) => {
  try {
    // Get user ID from token (mock for now)
    const user_id = 1; // This should come from authentication middleware

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

export const updateDriverBookingStatus: RequestHandler = async (req, res) => {
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

    await BookingService.updateDriverBookingStatus(parseInt(booking_id), status);

    // Send appropriate notifications based on status
    if (status === 'accepted') {
      // Notify customer that driver accepted
      const customerPhone = '+91 98765 43210'; // This should come from booking data
      await SMSService.sendDriverAcceptanceNotification(customerPhone, {
        name: 'Suresh Kumar',
        phone: '+91 98456 78901',
        vehicle_type: 'Sedan',
        vehicle_number: 'KA 20 A 1234',
        trip_code: trip_code || 'ABC123'
      });
    } else if (status === 'in_progress') {
      // Notify customer that trip started
      const customerPhone = '+91 98765 43210';
      await SMSService.sendTripStartedNotification(customerPhone, 'Suresh Kumar', 'KA 20 A 1234', 60);
    } else if (status === 'completed') {
      // Notify customer that trip completed
      const customerPhone = '+91 98765 43210';
      await SMSService.sendTripCompletedNotification(customerPhone, {
        driver_name: 'Suresh Kumar',
        duration: 45,
        amount: 300,
        booking_reference: 'CC123ABC'
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

    // In a real implementation, you would validate the trip code against the database
    // For now, we'll simulate validation
    const isValid = trip_code.length === 6; // Mock validation

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
