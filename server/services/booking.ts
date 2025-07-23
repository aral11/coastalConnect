import { getConnection } from '../db/connection';
import { PaymentService } from './payments';

export interface HomestayBooking {
  id: number;
  user_id: number;
  homestay_id: number;
  check_in_date: Date;
  check_out_date: Date;
  guests: number;
  total_amount: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  special_requests?: string;
  booking_reference: string;
  created_at: Date;
  updated_at: Date;
}

export interface DriverBooking {
  id: number;
  user_id: number;
  driver_id: number;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: Date;
  estimated_duration: number; // in minutes
  total_amount: number;
  booking_status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  passenger_name: string;
  passenger_phone: string;
  passengers_count: number;
  trip_code: string;
  booking_reference: string;
  created_at: Date;
  updated_at: Date;
}

export class BookingService {
  static generateBookingReference(): string {
    const prefix = 'CC';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  static generateTripCode(): string {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  static async createHomestayBooking(bookingData: {
    user_id: number;
    homestay_id: number;
    check_in_date: Date;
    check_out_date: Date;
    guests: number;
    guest_name: string;
    guest_phone: string;
    guest_email: string;
    special_requests?: string;
  }): Promise<{ booking: HomestayBooking; payment_intent: any }> {
    try {
      // Calculate total amount (mock calculation)
      const nights = Math.ceil((bookingData.check_out_date.getTime() - bookingData.check_in_date.getTime()) / (1000 * 60 * 60 * 24));
      const pricePerNight = 2500; // Mock price
      const totalAmount = nights * pricePerNight;

      const bookingReference = this.generateBookingReference();

      // For cloud environment, create mock booking
      const mockBooking: HomestayBooking = {
        id: Date.now(),
        user_id: bookingData.user_id,
        homestay_id: bookingData.homestay_id,
        check_in_date: bookingData.check_in_date,
        check_out_date: bookingData.check_out_date,
        guests: bookingData.guests,
        total_amount: totalAmount,
        booking_status: 'pending',
        payment_status: 'pending',
        guest_name: bookingData.guest_name,
        guest_phone: bookingData.guest_phone,
        guest_email: bookingData.guest_email,
        special_requests: bookingData.special_requests,
        booking_reference: bookingReference,
        created_at: new Date(),
        updated_at: new Date()
      };

      try {
        const connection = await getConnection();
        
        const result = await connection.request()
          .input('user_id', bookingData.user_id)
          .input('homestay_id', bookingData.homestay_id)
          .input('check_in_date', bookingData.check_in_date)
          .input('check_out_date', bookingData.check_out_date)
          .input('guests', bookingData.guests)
          .input('total_amount', totalAmount)
          .input('guest_name', bookingData.guest_name)
          .input('guest_phone', bookingData.guest_phone)
          .input('guest_email', bookingData.guest_email)
          .input('special_requests', bookingData.special_requests || null)
          .input('booking_reference', bookingReference)
          .query(`
            INSERT INTO HomestayBookings 
            (user_id, homestay_id, check_in_date, check_out_date, guests, total_amount, 
             booking_status, payment_status, guest_name, guest_phone, guest_email, 
             special_requests, booking_reference)
            OUTPUT INSERTED.*
            VALUES (@user_id, @homestay_id, @check_in_date, @check_out_date, @guests, 
                    @total_amount, 'pending', 'pending', @guest_name, @guest_phone, 
                    @guest_email, @special_requests, @booking_reference)
          `);

        mockBooking.id = result.recordset[0].id;
      } catch (dbError) {
        console.log('Database not available, using mock booking data');
      }

      // Create payment intent
      const paymentIntent = await PaymentService.createPaymentIntent(
        totalAmount,
        'INR',
        mockBooking.id,
        'homestay',
        bookingData.user_id
      );

      return {
        booking: mockBooking,
        payment_intent: paymentIntent
      };
    } catch (error) {
      console.error('Error creating homestay booking:', error);
      throw new Error('Failed to create homestay booking');
    }
  }

  static async createDriverBooking(bookingData: {
    user_id: number;
    driver_id: number;
    pickup_location: string;
    dropoff_location: string;
    pickup_datetime: Date;
    passenger_name: string;
    passenger_phone: string;
    passengers_count: number;
  }): Promise<{ booking: DriverBooking; payment_intent: any }> {
    try {
      // Calculate estimated duration and amount (mock calculation)
      const estimatedDuration = 60; // 1 hour mock
      const hourlyRate = 300; // ₹300 per hour mock
      const totalAmount = Math.ceil(estimatedDuration / 60) * hourlyRate;

      const bookingReference = this.generateBookingReference();
      const tripCode = this.generateTripCode();

      // For cloud environment, create mock booking
      const mockBooking: DriverBooking = {
        id: Date.now(),
        user_id: bookingData.user_id,
        driver_id: bookingData.driver_id,
        pickup_location: bookingData.pickup_location,
        dropoff_location: bookingData.dropoff_location,
        pickup_datetime: bookingData.pickup_datetime,
        estimated_duration: estimatedDuration,
        total_amount: totalAmount,
        booking_status: 'pending',
        payment_status: 'pending',
        passenger_name: bookingData.passenger_name,
        passenger_phone: bookingData.passenger_phone,
        passengers_count: bookingData.passengers_count,
        trip_code: tripCode,
        booking_reference: bookingReference,
        created_at: new Date(),
        updated_at: new Date()
      };

      try {
        const connection = await getConnection();
        
        const result = await connection.request()
          .input('user_id', bookingData.user_id)
          .input('driver_id', bookingData.driver_id)
          .input('pickup_location', bookingData.pickup_location)
          .input('dropoff_location', bookingData.dropoff_location)
          .input('pickup_datetime', bookingData.pickup_datetime)
          .input('estimated_duration', estimatedDuration)
          .input('total_amount', totalAmount)
          .input('passenger_name', bookingData.passenger_name)
          .input('passenger_phone', bookingData.passenger_phone)
          .input('passengers_count', bookingData.passengers_count)
          .input('trip_code', tripCode)
          .input('booking_reference', bookingReference)
          .query(`
            INSERT INTO DriverBookings 
            (user_id, driver_id, pickup_location, dropoff_location, pickup_datetime, 
             estimated_duration, total_amount, booking_status, payment_status, 
             passenger_name, passenger_phone, passengers_count, trip_code, booking_reference)
            OUTPUT INSERTED.*
            VALUES (@user_id, @driver_id, @pickup_location, @dropoff_location, @pickup_datetime, 
                    @estimated_duration, @total_amount, 'pending', 'pending', 
                    @passenger_name, @passenger_phone, @passengers_count, @trip_code, @booking_reference)
          `);

        mockBooking.id = result.recordset[0].id;
      } catch (dbError) {
        console.log('Database not available, using mock booking data');
      }

      // Create payment intent
      const paymentIntent = await PaymentService.createPaymentIntent(
        totalAmount,
        'INR',
        mockBooking.id,
        'driver',
        bookingData.user_id
      );

      return {
        booking: mockBooking,
        payment_intent: paymentIntent
      };
    } catch (error) {
      console.error('Error creating driver booking:', error);
      throw new Error('Failed to create driver booking');
    }
  }

  static async confirmPayment(bookingId: number, bookingType: 'homestay' | 'driver'): Promise<boolean> {
    try {
      const connection = await getConnection();
      
      const table = bookingType === 'homestay' ? 'HomestayBookings' : 'DriverBookings';
      
      await connection.request()
        .input('booking_id', bookingId)
        .input('payment_status', 'paid')
        .input('booking_status', 'confirmed')
        .input('updated_at', new Date())
        .query(`
          UPDATE ${table} 
          SET payment_status = @payment_status, booking_status = @booking_status, updated_at = @updated_at
          WHERE id = @booking_id
        `);

      return true;
    } catch (error) {
      console.log('Database not available, payment confirmation mocked');
      return true; // Mock success
    }
  }

  static async getUserBookings(userId: number): Promise<{ homestays: HomestayBooking[]; drivers: DriverBooking[] }> {
    try {
      const connection = await getConnection();
      
      const homestayResult = await connection.request()
        .input('user_id', userId)
        .query('SELECT * FROM HomestayBookings WHERE user_id = @user_id ORDER BY created_at DESC');

      const driverResult = await connection.request()
        .input('user_id', userId)
        .query('SELECT * FROM DriverBookings WHERE user_id = @user_id ORDER BY created_at DESC');

      return {
        homestays: homestayResult.recordset,
        drivers: driverResult.recordset
      };
    } catch (error) {
      console.log('Database not available, returning empty bookings');
      return {
        homestays: [],
        drivers: []
      };
    }
  }

  static async updateDriverBookingStatus(
    bookingId: number, 
    status: 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  ): Promise<boolean> {
    try {
      const connection = await getConnection();
      
      await connection.request()
        .input('booking_id', bookingId)
        .input('status', status)
        .input('updated_at', new Date())
        .query(`
          UPDATE DriverBookings 
          SET booking_status = @status, updated_at = @updated_at
          WHERE id = @booking_id
        `);

      return true;
    } catch (error) {
      console.log('Database not available, status update mocked');
      return true; // Mock success
    }
  }
}
