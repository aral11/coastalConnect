import express, { Request, Response } from 'express';
import { BookingService, BookingRequest } from '../services/bookingService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Create a new booking (protected route)
router.post('/create', authenticateToken, async (req: Request, res: Response) => {
  try {
    const {
      serviceType,
      serviceId,
      bookingDetails,
      paymentAmount,
      paymentMethod,
      couponCode,
      specialRequests
    } = req.body;

    // Validate required fields
    if (!serviceType || !serviceId || !bookingDetails || !paymentAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking information'
      });
    }

    // Get user ID from authenticated request
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const bookingRequest: BookingRequest = {
      userId,
      serviceType,
      serviceId: parseInt(serviceId),
      bookingDetails,
      paymentAmount: parseFloat(paymentAmount),
      paymentMethod: paymentMethod || 'online',
      couponCode,
      specialRequests
    };

    const bookingResponse = await BookingService.createBooking(bookingRequest);

    res.json({
      success: true,
      data: bookingResponse,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

// Get user's bookings (protected route)
router.get('/my-bookings', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const bookings = await BookingService.getUserBookings(userId);

    res.json({
      success: true,
      data: bookings,
      total: bookings.length
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

// Get booking details by reference
router.get('/details/:bookingReference', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { bookingReference } = req.params;
    const userId = (req as any).user?.id;

    if (!bookingReference) {
      return res.status(400).json({
        success: false,
        message: 'Booking reference is required'
      });
    }

    // In a real implementation, fetch from database
    // For now, return mock data
    const mockBooking = {
      bookingReference,
      status: 'confirmed',
      paymentStatus: 'paid',
      serviceType: 'homestay',
      serviceDetails: {
        name: 'Coastal Heritage Homestay',
        location: 'Malpe Beach Road, Udupi',
        contact: '+91 98765 43210'
      },
      bookingDetails: {
        checkInDate: '2024-12-25',
        checkOutDate: '2024-12-27',
        guests: 2,
        totalAmount: 2500
      },
      instructions: 'Please arrive after 2 PM. Contact host for early check-in.',
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: mockBooking
    });

  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details'
    });
  }
});

// Cancel booking
router.post('/cancel/:bookingReference', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { bookingReference } = req.params;
    const { reason } = req.body;
    const userId = (req as any).user?.id;

    if (!bookingReference) {
      return res.status(400).json({
        success: false,
        message: 'Booking reference is required'
      });
    }

    // In a real implementation, update booking status in database
    // Send cancellation notifications
    // Process refunds if applicable

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        bookingReference,
        status: 'cancelled',
        cancellationReason: reason,
        refundStatus: 'processing',
        refundAmount: 2500,
        refundEta: '3-5 business days'
      }
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
});

// Vendor endpoints for managing bookings
router.get('/vendor/bookings', authenticateToken, async (req: Request, res: Response) => {
  try {
    const vendorId = (req as any).user?.id;
    const { serviceType } = req.query;

    // Mock vendor bookings
    const mockVendorBookings = [
      {
        id: 1,
        bookingReference: 'HO123456',
        customerName: 'John Doe',
        customerPhone: '+91 98765 11111',
        checkInDate: '2024-12-25',
        checkOutDate: '2024-12-27',
        guests: 2,
        totalAmount: 2500,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: '2024-12-20T10:30:00Z'
      },
      {
        id: 2,
        bookingReference: 'HO789012',
        customerName: 'Jane Smith',
        customerPhone: '+91 98765 22222',
        checkInDate: '2024-12-28',
        checkOutDate: '2024-12-30',
        guests: 4,
        totalAmount: 5000,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: '2024-12-21T15:45:00Z'
      }
    ];

    res.json({
      success: true,
      data: mockVendorBookings,
      total: mockVendorBookings.length
    });

  } catch (error) {
    console.error('Error fetching vendor bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor bookings'
    });
  }
});

// Update booking status (for vendors)
router.put('/vendor/update-status/:bookingReference', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { bookingReference } = req.params;
    const { status, notes } = req.body;
    
    const validStatuses = ['confirmed', 'checked-in', 'completed', 'cancelled', 'no-show'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
      });
    }

    // In real implementation, update database and send notifications

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      data: {
        bookingReference,
        status,
        notes,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
});

export default router;
