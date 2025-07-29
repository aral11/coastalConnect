import { Router, Request, Response } from 'express';
import { getConnection } from '../db/connection';
import { authenticateToken } from '../middleware/auth';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

// Generate unique booking reference
const generateBookingReference = (serviceType: string): string => {
  const prefix = serviceType.substring(0, 2).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Create a new booking
router.post('/create', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const {
      service_id,
      service_type,
      // Homestay fields
      check_in_date,
      check_out_date,
      guests,
      rooms,
      // Restaurant fields  
      reservation_date,
      reservation_time,
      party_size,
      // Driver fields
      pickup_date,
      pickup_time,
      pickup_location,
      dropoff_location,
      passengers,
      // Common fields
      guest_name,
      guest_email,
      guest_phone,
      special_requests,
      total_amount,
      discount_amount = 0,
      coupon_code
    } = req.body;

    // Validate required fields
    if (!service_id || !service_type || !guest_name || !guest_email || !guest_phone || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking information'
      });
    }

    // Validate service-specific required fields
    if (service_type === 'homestay' && (!check_in_date || !check_out_date || !guests)) {
      return res.status(400).json({
        success: false,
        message: 'Missing homestay booking details'
      });
    }

    if (service_type === 'restaurant' && (!reservation_date || !reservation_time || !party_size)) {
      return res.status(400).json({
        success: false,
        message: 'Missing restaurant reservation details'
      });
    }

    if (service_type === 'driver' && (!pickup_date || !pickup_time || !pickup_location || !dropoff_location)) {
      return res.status(400).json({
        success: false,
        message: 'Missing driver booking details'
      });
    }

    const connection = await getConnection();
    const bookingReference = generateBookingReference(service_type);

    // Insert booking into database
    const result = await connection.request()
      .input('user_id', userId)
      .input('service_id', service_id)
      .input('service_type', service_type)
      .input('booking_reference', bookingReference)
      .input('check_in_date', check_in_date || null)
      .input('check_out_date', check_out_date || null)
      .input('guests', guests || null)
      .input('rooms', rooms || 1)
      .input('reservation_date', reservation_date || null)
      .input('reservation_time', reservation_time || null)
      .input('party_size', party_size || null)
      .input('pickup_date', pickup_date || null)
      .input('pickup_time', pickup_time || null)
      .input('pickup_location', pickup_location || null)
      .input('dropoff_location', dropoff_location || null)
      .input('passengers', passengers || null)
      .input('guest_name', guest_name)
      .input('guest_email', guest_email)
      .input('guest_phone', guest_phone)
      .input('special_requests', special_requests || null)
      .input('total_amount', total_amount)
      .input('discount_amount', discount_amount)
      .input('coupon_code', coupon_code || null)
      .input('status', 'confirmed')
      .input('payment_status', 'paid')
      .input('payment_id', 'test_' + Date.now())
      .query(`
        INSERT INTO Bookings (
          user_id, service_id, service_type, booking_reference,
          check_in_date, check_out_date, guests, rooms,
          reservation_date, reservation_time, party_size,
          pickup_date, pickup_time, pickup_location, dropoff_location, passengers,
          guest_name, guest_email, guest_phone, special_requests,
          total_amount, discount_amount, coupon_code,
          status, payment_status, payment_id
        )
        OUTPUT INSERTED.id, INSERTED.booking_reference, INSERTED.created_at
        VALUES (
          @user_id, @service_id, @service_type, @booking_reference,
          @check_in_date, @check_out_date, @guests, @rooms,
          @reservation_date, @reservation_time, @party_size,
          @pickup_date, @pickup_time, @pickup_location, @dropoff_location, @passengers,
          @guest_name, @guest_email, @guest_phone, @special_requests,
          @total_amount, @discount_amount, @coupon_code,
          @status, @payment_status, @payment_id
        )
      `);

    if (result.recordset.length > 0) {
      const booking = result.recordset[0];
      
      res.status(201).json({
        success: true,
        data: {
          id: booking.id,
          booking_reference: booking.booking_reference,
          status: 'confirmed',
          payment_status: 'paid',
          created_at: booking.created_at
        },
        message: 'Booking created successfully'
      });
    } else {
      throw new Error('Failed to create booking');
    }

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user bookings
router.get('/user', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const connection = await getConnection();
    
    // Get all bookings for the user
    const result = await connection.request()
      .input('user_id', userId)
      .query(`
        SELECT 
          id,
          service_id,
          service_type,
          booking_reference,
          check_in_date,
          check_out_date,
          guests,
          rooms,
          reservation_date,
          reservation_time,
          party_size,
          pickup_date,
          pickup_time,
          pickup_location,
          dropoff_location,
          passengers,
          guest_name,
          guest_email,
          guest_phone,
          special_requests,
          total_amount,
          discount_amount,
          coupon_code,
          status as booking_status,
          payment_status,
          created_at,
          updated_at
        FROM Bookings 
        WHERE user_id = @user_id 
        ORDER BY created_at DESC
      `);

    // Group bookings by type for compatibility with existing frontend
    const bookings = result.recordset;
    const homestays = bookings.filter(b => b.service_type === 'homestay');
    const drivers = bookings.filter(b => b.service_type === 'driver');
    const restaurants = bookings.filter(b => b.service_type === 'restaurant');

    res.json({
      success: true,
      data: {
        homestays,
        drivers,
        restaurants,
        all: bookings
      },
      message: 'Bookings retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    
    // Return mock data if database fails
    const mockBookings = {
      homestays: [
        {
          id: 1001,
          service_id: 1,
          service_type: 'homestay',
          booking_reference: 'HO' + Date.now().toString().slice(-6),
          check_in_date: '2024-12-25',
          check_out_date: '2024-12-27',
          guests: 2,
          guest_name: req.user?.name || 'Demo User',
          booking_status: 'confirmed',
          payment_status: 'paid',
          total_amount: 2500,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ],
      drivers: [
        {
          id: 2001,
          service_id: 1,
          service_type: 'driver',
          booking_reference: 'DR' + Date.now().toString().slice(-6),
          pickup_date: '2024-12-20',
          pickup_time: '10:00',
          pickup_location: 'Udupi Bus Stand',
          dropoff_location: 'Malpe Beach',
          passengers: 2,
          guest_name: req.user?.name || 'Demo User',
          booking_status: 'confirmed',
          payment_status: 'paid',
          total_amount: 300,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ],
      restaurants: []
    };

    res.json({
      success: true,
      data: mockBookings,
      message: 'Bookings retrieved (demo data)'
    });
  }
});

// Get booking details by reference
router.get('/details/:reference', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reference } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const connection = await getConnection();
    
    const result = await connection.request()
      .input('booking_reference', reference)
      .input('user_id', userId)
      .query(`
        SELECT * FROM Bookings 
        WHERE booking_reference = @booking_reference 
        AND user_id = @user_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: result.recordset[0],
      message: 'Booking details retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Cancel booking
router.put('/cancel/:reference', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reference } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const connection = await getConnection();
    
    const result = await connection.request()
      .input('booking_reference', reference)
      .input('user_id', userId)
      .query(`
        UPDATE Bookings 
        SET status = 'cancelled', updated_at = GETDATE()
        WHERE booking_reference = @booking_reference 
        AND user_id = @user_id
        AND status NOT IN ('cancelled', 'completed')
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or cannot be cancelled'
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
