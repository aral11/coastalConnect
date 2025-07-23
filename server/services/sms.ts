import twilio from 'twilio';

export interface SMSMessage {
  to: string;
  message: string;
  type: 'booking_confirmation' | 'trip_code' | 'trip_started' | 'trip_completed';
}

export class SMSService {
  private static client = twilio(
    process.env.TWILIO_ACCOUNT_SID || 'mock_account_sid',
    process.env.TWILIO_AUTH_TOKEN || 'mock_auth_token'
  );

  private static fromNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

  static async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // For development/cloud environment without real Twilio credentials
      if (process.env.NODE_ENV === 'development' || !process.env.TWILIO_ACCOUNT_SID) {
        console.log(`📱 Mock SMS sent to ${to}:`);
        console.log(`Message: ${message}`);
        return true;
      }

      // Real Twilio SMS
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: to
      });

      console.log(`SMS sent successfully: ${result.sid}`);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  static async sendDriverBookingNotification(
    driverPhone: string,
    booking: {
      booking_reference: string;
      passenger_name: string;
      pickup_location: string;
      dropoff_location: string;
      pickup_datetime: Date;
      trip_code: string;
      total_amount: number;
    }
  ): Promise<boolean> {
    const message = `🚗 New Trip Request - coastalConnect

Booking: ${booking.booking_reference}
Passenger: ${booking.passenger_name}
From: ${booking.pickup_location}
To: ${booking.dropoff_location}
Time: ${booking.pickup_datetime.toLocaleString('en-IN')}
Amount: ₹${booking.total_amount}
Trip Code: ${booking.trip_code}

Reply with YES to accept this trip.
Download coastalConnect Driver app to manage trips.`;

    return this.sendSMS(driverPhone, message);
  }

  static async sendCustomerBookingConfirmation(
    customerPhone: string,
    booking: {
      booking_reference: string;
      type: 'homestay' | 'driver';
      details: string;
      amount: number;
    }
  ): Promise<boolean> {
    const emoji = booking.type === 'homestay' ? '🏠' : '🚗';
    const message = `${emoji} Booking Confirmed - coastalConnect

Booking ID: ${booking.booking_reference}
Service: ${booking.type === 'homestay' ? 'Homestay' : 'Driver'}
Details: ${booking.details}
Amount: ₹${booking.amount}

Thank you for choosing coastalConnect!
View details in the app.`;

    return this.sendSMS(customerPhone, message);
  }

  static async sendTripStartedNotification(
    customerPhone: string,
    driverName: string,
    vehicleNumber: string,
    estimatedDuration: number
  ): Promise<boolean> {
    const message = `🚗 Trip Started - coastalConnect

Driver: ${driverName}
Vehicle: ${vehicleNumber}
Estimated Duration: ${estimatedDuration} minutes

Your trip has begun. Track live location in the app.
Have a safe journey!`;

    return this.sendSMS(customerPhone, message);
  }

  static async sendTripCompletedNotification(
    customerPhone: string,
    tripDetails: {
      driver_name: string;
      duration: number;
      amount: number;
      booking_reference: string;
    }
  ): Promise<boolean> {
    const message = `✅ Trip Completed - coastalConnect

Booking: ${tripDetails.booking_reference}
Driver: ${tripDetails.driver_name}
Duration: ${tripDetails.duration} minutes
Amount: ₹${tripDetails.amount}

Thank you for using coastalConnect!
Rate your experience in the app.`;

    return this.sendSMS(customerPhone, message);
  }

  static async sendTripCodeToDriver(
    driverPhone: string,
    tripCode: string,
    passengerName: string
  ): Promise<boolean> {
    const message = `🔑 Trip Code - coastalConnect

Passenger: ${passengerName}
Trip Code: ${tripCode}

Share this code with passenger to start the trip.
Use Driver app to update trip status.`;

    return this.sendSMS(driverPhone, message);
  }

  static async sendDriverAcceptanceNotification(
    customerPhone: string,
    driver: {
      name: string;
      phone: string;
      vehicle_type: string;
      vehicle_number: string;
      trip_code: string;
    }
  ): Promise<boolean> {
    const message = `✅ Driver Assigned - coastalConnect

Driver: ${driver.name}
Phone: ${driver.phone}
Vehicle: ${driver.vehicle_type} - ${driver.vehicle_number}
Trip Code: ${driver.trip_code}

Your driver will contact you shortly.
Track trip in the app.`;

    return this.sendSMS(customerPhone, message);
  }

  static async sendHomestayBookingConfirmation(
    hostPhone: string,
    booking: {
      booking_reference: string;
      guest_name: string;
      check_in_date: Date;
      check_out_date: Date;
      guests: number;
      total_amount: number;
    }
  ): Promise<boolean> {
    const message = `🏠 New Booking - coastalConnect

Booking: ${booking.booking_reference}
Guest: ${booking.guest_name}
Check-in: ${booking.check_in_date.toLocaleDateString('en-IN')}
Check-out: ${booking.check_out_date.toLocaleDateString('en-IN')}
Guests: ${booking.guests}
Amount: ₹${booking.total_amount}

Guest contact details available in Host app.`;

    return this.sendSMS(hostPhone, message);
  }
}
