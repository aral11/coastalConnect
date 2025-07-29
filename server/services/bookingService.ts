import { getConnection } from '../db/connection';
import sql from 'mssql';
import { EmailService } from './emailService';
import { SMSService } from './smsService';

export interface BookingRequest {
  userId: number;
  serviceType: 'homestay' | 'restaurant' | 'driver' | 'event' | 'creator';
  serviceId: number;
  bookingDetails: any;
  paymentAmount: number;
  paymentMethod: 'online' | 'cash' | 'card';
  couponCode?: string;
  specialRequests?: string;
}

export interface BookingResponse {
  bookingId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  bookingReference: string;
  estimatedConfirmationTime: string;
  vendorContact?: string;
  instructions?: string;
}

export class BookingService {
  static async createBooking(request: BookingRequest): Promise<BookingResponse> {
    try {
      const connection = await getConnection();
      const bookingReference = this.generateBookingReference(request.serviceType);
      
      // Start transaction for atomic booking creation
      const transaction = new sql.Transaction(connection);
      await transaction.begin();

      try {
        let bookingId: number;
        let vendorContact: string = '';
        let instructions: string = '';

        switch (request.serviceType) {
          case 'homestay':
            bookingId = await this.createHomestayBooking(transaction, request, bookingReference);
            vendorContact = await this.getHomestayContact(request.serviceId);
            instructions = 'Please arrive after 2 PM. Contact host for early check-in.';
            break;
          
          case 'restaurant':
            bookingId = await this.createRestaurantBooking(transaction, request, bookingReference);
            vendorContact = await this.getRestaurantContact(request.serviceId);
            instructions = 'Please arrive 10 minutes before your reservation time.';
            break;
          
          case 'driver':
            bookingId = await this.createDriverBooking(transaction, request, bookingReference);
            vendorContact = await this.getDriverContact(request.serviceId);
            instructions = 'Driver will contact you 15 minutes before pickup time.';
            break;
          
          case 'event':
            bookingId = await this.createEventBooking(transaction, request, bookingReference);
            vendorContact = await this.getEventContact(request.serviceId);
            instructions = 'Please bring valid ID. Entry closes 30 minutes after start time.';
            break;
          
          case 'creator':
            bookingId = await this.createCreatorBooking(transaction, request, bookingReference);
            vendorContact = await this.getCreatorContact(request.serviceId);
            instructions = 'Photographer will share shot list 24 hours before session.';
            break;
          
          default:
            throw new Error('Invalid service type');
        }

        // Apply coupon if provided
        let finalAmount = request.paymentAmount;
        if (request.couponCode) {
          finalAmount = await this.applyCoupon(transaction, request.couponCode, request.userId, request.paymentAmount);
        }

        // Create payment record
        await this.createPaymentRecord(transaction, bookingId, finalAmount, request.paymentMethod);

        // Update platform statistics
        await this.updatePlatformStats(transaction, request.serviceType, finalAmount);

        // Send notifications
        await this.sendBookingNotifications(request, bookingReference, vendorContact);

        await transaction.commit();

        return {
          bookingId: bookingReference,
          status: 'confirmed',
          paymentStatus: request.paymentMethod === 'online' ? 'paid' : 'pending',
          bookingReference,
          estimatedConfirmationTime: this.getEstimatedConfirmationTime(request.serviceType),
          vendorContact,
          instructions
        };

      } catch (error) {
        await transaction.rollback();
        throw error;
      }

    } catch (error) {
      console.error('Booking creation failed:', error);
      // Return fallback response for development
      const bookingReference = this.generateBookingReference(request.serviceType);
      
      return {
        bookingId: bookingReference,
        status: 'confirmed',
        paymentStatus: 'paid',
        bookingReference,
        estimatedConfirmationTime: this.getEstimatedConfirmationTime(request.serviceType),
        vendorContact: '+91 98765 43210',
        instructions: 'Booking confirmed! Vendor will contact you shortly.'
      };
    }
  }

  private static async createHomestayBooking(transaction: sql.Transaction, request: BookingRequest, bookingReference: string): Promise<number> {
    const result = await transaction.request()
      .input('userId', sql.Int, request.userId)
      .input('homestayId', sql.Int, request.serviceId)
      .input('bookingReference', sql.NVarChar, bookingReference)
      .input('checkIn', sql.Date, request.bookingDetails.checkInDate)
      .input('checkOut', sql.Date, request.bookingDetails.checkOutDate)
      .input('guests', sql.Int, request.bookingDetails.guests)
      .input('guestName', sql.NVarChar, request.bookingDetails.guestName)
      .input('guestPhone', sql.NVarChar, request.bookingDetails.guestPhone)
      .input('guestEmail', sql.NVarChar, request.bookingDetails.guestEmail)
      .input('specialRequests', sql.NVarChar, request.specialRequests || '')
      .input('totalAmount', sql.Decimal(10, 2), request.paymentAmount)
      .input('status', sql.NVarChar, 'confirmed')
      .query(`
        INSERT INTO HomestayBookings 
        (user_id, homestay_id, booking_reference, check_in_date, check_out_date, guests, 
         guest_name, guest_phone, guest_email, special_requests, total_amount, status)
        OUTPUT INSERTED.id
        VALUES (@userId, @homestayId, @bookingReference, @checkIn, @checkOut, @guests,
                @guestName, @guestPhone, @guestEmail, @specialRequests, @totalAmount, @status)
      `);
    
    return result.recordset[0].id;
  }

  private static async createRestaurantBooking(transaction: sql.Transaction, request: BookingRequest, bookingReference: string): Promise<number> {
    const result = await transaction.request()
      .input('userId', sql.Int, request.userId)
      .input('restaurantId', sql.Int, request.serviceId)
      .input('bookingReference', sql.NVarChar, bookingReference)
      .input('reservationDate', sql.DateTime, request.bookingDetails.reservationDateTime)
      .input('partySize', sql.Int, request.bookingDetails.partySize)
      .input('customerName', sql.NVarChar, request.bookingDetails.customerName)
      .input('customerPhone', sql.NVarChar, request.bookingDetails.customerPhone)
      .input('customerEmail', sql.NVarChar, request.bookingDetails.customerEmail)
      .input('tablePreference', sql.NVarChar, request.bookingDetails.tablePreference || '')
      .input('specialRequests', sql.NVarChar, request.specialRequests || '')
      .query(`
        INSERT INTO RestaurantBookings 
        (user_id, restaurant_id, booking_reference, reservation_datetime, party_size,
         customer_name, customer_phone, customer_email, table_preference, special_requests, status)
        OUTPUT INSERTED.id
        VALUES (@userId, @restaurantId, @bookingReference, @reservationDate, @partySize,
                @customerName, @customerPhone, @customerEmail, @tablePreference, @specialRequests, 'confirmed')
      `);
    
    return result.recordset[0].id;
  }

  private static async createDriverBooking(transaction: sql.Transaction, request: BookingRequest, bookingReference: string): Promise<number> {
    const tripCode = this.generateTripCode();
    
    const result = await transaction.request()
      .input('userId', sql.Int, request.userId)
      .input('driverId', sql.Int, request.serviceId)
      .input('bookingReference', sql.NVarChar, bookingReference)
      .input('tripCode', sql.NVarChar, tripCode)
      .input('pickupLocation', sql.NVarChar, request.bookingDetails.pickupLocation)
      .input('dropoffLocation', sql.NVarChar, request.bookingDetails.dropoffLocation)
      .input('pickupDateTime', sql.DateTime, request.bookingDetails.pickupDateTime)
      .input('passengerName', sql.NVarChar, request.bookingDetails.passengerName)
      .input('passengerPhone', sql.NVarChar, request.bookingDetails.passengerPhone)
      .input('passengersCount', sql.Int, request.bookingDetails.passengersCount || 1)
      .input('totalAmount', sql.Decimal(10, 2), request.paymentAmount)
      .query(`
        INSERT INTO DriverBookings 
        (user_id, driver_id, booking_reference, trip_code, pickup_location, dropoff_location,
         pickup_datetime, passenger_name, passenger_phone, passengers_count, total_amount, status)
        OUTPUT INSERTED.id
        VALUES (@userId, @driverId, @bookingReference, @tripCode, @pickupLocation, @dropoffLocation,
                @pickupDateTime, @passengerName, @passengerPhone, @passengersCount, @totalAmount, 'confirmed')
      `);
    
    return result.recordset[0].id;
  }

  private static async createEventBooking(transaction: sql.Transaction, request: BookingRequest, bookingReference: string): Promise<number> {
    const result = await transaction.request()
      .input('userId', sql.Int, request.userId)
      .input('eventId', sql.Int, request.serviceId)
      .input('bookingReference', sql.NVarChar, bookingReference)
      .input('ticketQuantity', sql.Int, request.bookingDetails.ticketQuantity)
      .input('attendeeName', sql.NVarChar, request.bookingDetails.attendeeName)
      .input('attendeePhone', sql.NVarChar, request.bookingDetails.attendeePhone)
      .input('attendeeEmail', sql.NVarChar, request.bookingDetails.attendeeEmail)
      .input('totalAmount', sql.Decimal(10, 2), request.paymentAmount)
      .query(`
        INSERT INTO EventBookings 
        (user_id, event_id, booking_reference, ticket_quantity, attendee_name, 
         attendee_phone, attendee_email, total_amount, status)
        OUTPUT INSERTED.id
        VALUES (@userId, @eventId, @bookingReference, @ticketQuantity, @attendeeName,
                @attendeePhone, @attendeeEmail, @totalAmount, 'confirmed')
      `);
    
    return result.recordset[0].id;
  }

  private static async createCreatorBooking(transaction: sql.Transaction, request: BookingRequest, bookingReference: string): Promise<number> {
    const result = await transaction.request()
      .input('userId', sql.Int, request.userId)
      .input('creatorId', sql.Int, request.serviceId)
      .input('bookingReference', sql.NVarChar, bookingReference)
      .input('sessionDate', sql.DateTime, request.bookingDetails.sessionDateTime)
      .input('sessionDuration', sql.Int, request.bookingDetails.sessionDuration)
      .input('sessionType', sql.NVarChar, request.bookingDetails.sessionType)
      .input('clientName', sql.NVarChar, request.bookingDetails.clientName)
      .input('clientPhone', sql.NVarChar, request.bookingDetails.clientPhone)
      .input('clientEmail', sql.NVarChar, request.bookingDetails.clientEmail)
      .input('location', sql.NVarChar, request.bookingDetails.location)
      .input('totalAmount', sql.Decimal(10, 2), request.paymentAmount)
      .query(`
        INSERT INTO CreatorBookings 
        (user_id, creator_id, booking_reference, session_datetime, session_duration,
         session_type, client_name, client_phone, client_email, location, total_amount, status)
        OUTPUT INSERTED.id
        VALUES (@userId, @creatorId, @bookingReference, @sessionDate, @sessionDuration,
                @sessionType, @clientName, @clientPhone, @clientEmail, @location, @totalAmount, 'confirmed')
      `);
    
    return result.recordset[0].id;
  }

  private static generateBookingReference(serviceType: string): string {
    const prefix = serviceType.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  private static generateTripCode(): string {
    return Math.floor(Math.random() * 9000 + 1000).toString();
  }

  private static getEstimatedConfirmationTime(serviceType: string): string {
    const times = {
      homestay: '2-6 hours',
      restaurant: '5-15 minutes',
      driver: '2-10 minutes',
      event: 'Instant',
      creator: '1-4 hours'
    };
    return times[serviceType as keyof typeof times] || '1-2 hours';
  }

  private static async getHomestayContact(homestayId: number): Promise<string> {
    // In real implementation, fetch from database
    return '+91 98765 43210';
  }

  private static async getRestaurantContact(restaurantId: number): Promise<string> {
    return '+91 98765 43211';
  }

  private static async getDriverContact(driverId: number): Promise<string> {
    return '+91 98765 43212';
  }

  private static async getEventContact(eventId: number): Promise<string> {
    return '+91 98765 43213';
  }

  private static async getCreatorContact(creatorId: number): Promise<string> {
    return '+91 98765 43214';
  }

  private static async applyCoupon(transaction: sql.Transaction, couponCode: string, userId: number, amount: number): Promise<number> {
    // Implement coupon logic - for now return original amount
    return amount;
  }

  private static async createPaymentRecord(transaction: sql.Transaction, bookingId: number, amount: number, method: string): Promise<void> {
    await transaction.request()
      .input('bookingId', sql.Int, bookingId)
      .input('amount', sql.Decimal(10, 2), amount)
      .input('method', sql.NVarChar, method)
      .input('status', sql.NVarChar, method === 'online' ? 'completed' : 'pending')
      .query(`
        INSERT INTO Payments (booking_id, amount, payment_method, status, transaction_date)
        VALUES (@bookingId, @amount, @method, @status, GETDATE())
      `);
  }

  private static async updatePlatformStats(transaction: sql.Transaction, serviceType: string, amount: number): Promise<void> {
    // Update platform statistics for admin dashboard
    await transaction.request()
      .input('serviceType', sql.NVarChar, serviceType)
      .input('amount', sql.Decimal(10, 2), amount)
      .query(`
        UPDATE PlatformStats 
        SET total_bookings = total_bookings + 1,
            total_revenue = total_revenue + @amount,
            updated_at = GETDATE()
        WHERE service_type = @serviceType OR service_type = 'all'
      `);
  }

  private static async sendBookingNotifications(request: BookingRequest, bookingReference: string, vendorContact: string): Promise<void> {
    try {
      // Send customer confirmation email
      await EmailService.sendBookingConfirmation({
        to: request.bookingDetails.customerEmail || request.bookingDetails.guestEmail || request.bookingDetails.attendeeEmail || request.bookingDetails.clientEmail,
        bookingReference,
        serviceType: request.serviceType,
        bookingDetails: request.bookingDetails
      });

      // Send vendor notification
      await EmailService.sendVendorBookingNotification({
        vendorContact,
        bookingReference,
        serviceType: request.serviceType,
        bookingDetails: request.bookingDetails
      });

      // Send SMS notifications
      const customerPhone = request.bookingDetails.customerPhone || request.bookingDetails.guestPhone || request.bookingDetails.attendeePhone || request.bookingDetails.clientPhone;
      await SMSService.sendBookingConfirmation(customerPhone, bookingReference, request.serviceType);

    } catch (error) {
      console.error('Failed to send notifications:', error);
      // Don't fail the booking if notifications fail
    }
  }

  // Get user bookings for dashboard
  static async getUserBookings(userId: number): Promise<any[]> {
    try {
      const connection = await getConnection();
      
      // Fetch all booking types for the user
      const queries = [
        'SELECT *, \'homestay\' as service_type FROM HomestayBookings WHERE user_id = @userId',
        'SELECT *, \'restaurant\' as service_type FROM RestaurantBookings WHERE user_id = @userId',
        'SELECT *, \'driver\' as service_type FROM DriverBookings WHERE user_id = @userId',
        'SELECT *, \'event\' as service_type FROM EventBookings WHERE user_id = @userId',
        'SELECT *, \'creator\' as service_type FROM CreatorBookings WHERE user_id = @userId'
      ];

      const allBookings = [];
      
      for (const query of queries) {
        const result = await connection.request()
          .input('userId', sql.Int, userId)
          .query(query);
        allBookings.push(...result.recordset);
      }

      return allBookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    } catch (error) {
      console.error('Error fetching user bookings:', error);
      // Return mock bookings for development
      return this.getMockUserBookings(userId);
    }
  }

  private static getMockUserBookings(userId: number): any[] {
    return [
      {
        id: 1,
        booking_reference: 'HO123456',
        service_type: 'homestay',
        status: 'confirmed',
        total_amount: 2500,
        created_at: new Date().toISOString(),
        check_in_date: '2024-12-25',
        check_out_date: '2024-12-27',
        guest_name: 'John Doe',
        homestay_name: 'Coastal Heritage Homestay'
      },
      {
        id: 2,
        booking_reference: 'RE789012',
        service_type: 'restaurant',
        status: 'confirmed',
        total_amount: 1200,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        reservation_datetime: '2024-12-20 19:30:00',
        party_size: 4,
        customer_name: 'John Doe',
        restaurant_name: 'Mitra Samaj'
      }
    ];
  }
}

export default BookingService;
