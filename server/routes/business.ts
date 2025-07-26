import { RequestHandler } from 'express';

interface BusinessMetrics {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  activeListings: number;
  pendingBookings: number;
  thisMonthBookings: number;
  thisMonthRevenue: number;
  lastMonthBookings: number;
  lastMonthRevenue: number;
}

interface RecentBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  service: string;
  date: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
}

export const getBusinessMetrics: RequestHandler = async (req, res) => {
  try {
    // In a real application, this would query the database
    // For now, we'll provide realistic sample data
    
    const currentDate = new Date();
    const thisMonth = currentDate.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    
    const metrics: BusinessMetrics = {
      totalBookings: 127,
      totalRevenue: 45600,
      averageRating: 4.6,
      totalReviews: 89,
      activeListings: 8,
      pendingBookings: 5,
      thisMonthBookings: 23,
      thisMonthRevenue: 12400,
      lastMonthBookings: 19,
      lastMonthRevenue: 10200
    };

    // Calculate growth percentages
    const bookingGrowth = metrics.lastMonthBookings > 0 
      ? ((metrics.thisMonthBookings - metrics.lastMonthBookings) / metrics.lastMonthBookings * 100).toFixed(1)
      : '0.0';
    
    const revenueGrowth = metrics.lastMonthRevenue > 0
      ? ((metrics.thisMonthRevenue - metrics.lastMonthRevenue) / metrics.lastMonthRevenue * 100).toFixed(1)
      : '0.0';

    res.json({
      success: true,
      data: {
        ...metrics,
        growth: {
          bookings: parseFloat(bookingGrowth),
          revenue: parseFloat(revenueGrowth)
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching business metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch business metrics'
    });
  }
};

export const getRecentBookings: RequestHandler = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    // Sample recent bookings data
    const allBookings: RecentBooking[] = [
      {
        id: 'BK001',
        customerName: 'Priya Sharma',
        customerEmail: 'priya.sharma@email.com',
        service: 'Beach Resort Stay - 2 Nights',
        date: '2024-01-15',
        amount: 6500,
        status: 'confirmed',
        paymentMethod: 'UPI',
        notes: 'Anniversary celebration'
      },
      {
        id: 'BK002', 
        customerName: 'Rajesh Kumar',
        customerEmail: 'rajesh.kumar@email.com',
        service: 'Local Tour Guide - Full Day',
        date: '2024-01-14',
        amount: 2200,
        status: 'completed',
        paymentMethod: 'Credit Card'
      },
      {
        id: 'BK003',
        customerName: 'Anita Desai',
        customerEmail: 'anita.desai@email.com', 
        service: 'Coastal Photography Session',
        date: '2024-01-13',
        amount: 4800,
        status: 'pending',
        paymentMethod: 'Net Banking',
        notes: 'Wedding photoshoot'
      },
      {
        id: 'BK004',
        customerName: 'Vikram Rao',
        customerEmail: 'vikram.rao@email.com',
        service: 'Traditional Cooking Class',
        date: '2024-01-12',
        amount: 1500,
        status: 'completed',
        paymentMethod: 'Debit Card'
      },
      {
        id: 'BK005',
        customerName: 'Meera Nair',
        customerEmail: 'meera.nair@email.com',
        service: 'Homestay - 3 Nights',
        date: '2024-01-11',
        amount: 8200,
        status: 'confirmed',
        paymentMethod: 'UPI',
        notes: 'Family vacation'
      },
      {
        id: 'BK006',
        customerName: 'Arjun Patel',
        customerEmail: 'arjun.patel@email.com',
        service: 'Boat Trip to St. Mary\'s Island',
        date: '2024-01-10',
        amount: 3200,
        status: 'completed',
        paymentMethod: 'Cash'
      },
      {
        id: 'BK007',
        customerName: 'Deepika Singh',
        customerEmail: 'deepika.singh@email.com',
        service: 'Scuba Diving Experience',
        date: '2024-01-09',
        amount: 5500,
        status: 'cancelled',
        paymentMethod: 'Credit Card',
        notes: 'Weather conditions'
      },
      {
        id: 'BK008',
        customerName: 'Suresh Bhat',
        customerEmail: 'suresh.bhat@email.com',
        service: 'Heritage Walk - Mangalore',
        date: '2024-01-08',
        amount: 1800,
        status: 'completed',
        paymentMethod: 'UPI'
      }
    ];

    const paginatedBookings = allBookings.slice(offset, offset + limit);

    res.json({
      success: true,
      data: paginatedBookings,
      total: allBookings.length,
      limit,
      offset,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent bookings'
    });
  }
};

export const getBookingDetails: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Sample booking details - in real app, query from database
    const bookingDetails = {
      id: bookingId,
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@email.com',
      customerPhone: '+91 9876543210',
      service: 'Beach Resort Stay - 2 Nights',
      serviceDetails: {
        checkIn: '2024-01-15',
        checkOut: '2024-01-17',
        guests: 2,
        roomType: 'Deluxe Sea View'
      },
      amount: 6500,
      status: 'confirmed',
      paymentMethod: 'UPI',
      paymentId: 'UPI_123456789',
      bookingDate: '2024-01-10',
      notes: 'Anniversary celebration',
      specialRequests: 'Late checkout, flower decoration'
    };

    res.json({
      success: true,
      data: bookingDetails,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking details'
    });
  }
};

export const updateBookingStatus: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes } = req.body;

    // Validate status
    const validStatuses = ['confirmed', 'pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking status'
      });
    }

    // In real app, update database
    console.log(`Updating booking ${bookingId} to status: ${status}`);
    if (notes) {
      console.log(`Adding notes: ${notes}`);
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        bookingId,
        newStatus: status,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking status'
    });
  }
};

export const getBusinessAnalytics: RequestHandler = async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Sample analytics data
    const analytics = {
      revenue: {
        current: 12400,
        previous: 10200,
        growth: 21.6,
        trend: 'up'
      },
      bookings: {
        current: 23,
        previous: 19,
        growth: 21.1,
        trend: 'up'
      },
      conversionRate: {
        current: 3.2,
        previous: 2.8,
        growth: 14.3,
        trend: 'up'
      },
      averageOrderValue: {
        current: 3800,
        previous: 3600,
        growth: 5.6,
        trend: 'up'
      },
      topServices: [
        { name: 'Beach Resort Stays', bookings: 8, revenue: 24600 },
        { name: 'Coastal Photography', bookings: 5, revenue: 12500 },
        { name: 'Local Tour Guides', bookings: 6, revenue: 8200 },
        { name: 'Traditional Experiences', bookings: 4, revenue: 4800 }
      ],
      customerSegments: [
        { segment: 'Families', percentage: 45, revenue: 18500 },
        { segment: 'Couples', percentage: 35, revenue: 14200 },
        { segment: 'Solo Travelers', percentage: 15, revenue: 6800 },
        { segment: 'Groups', percentage: 5, revenue: 2900 }
      ]
    };

    res.json({
      success: true,
      data: analytics,
      period,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching business analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch business analytics'
    });
  }
};
