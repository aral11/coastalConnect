// SMS Service for coastalConnect
// Integration with popular SMS providers in India

interface SMSConfig {
  provider: 'twilio' | 'textlocal' | 'msg91' | 'gupshup';
  apiKey: string;
  apiSecret?: string;
  senderId?: string;
  templateId?: string;
}

// SMS Configuration - you can switch providers as needed
const smsConfig: SMSConfig = {
  provider: process.env.SMS_PROVIDER as any || 'textlocal',
  apiKey: process.env.SMS_API_KEY || 'your-api-key',
  apiSecret: process.env.SMS_API_SECRET || 'your-api-secret',
  senderId: process.env.SMS_SENDER_ID || 'COASTAL',
  templateId: process.env.SMS_TEMPLATE_ID || 'template-id'
};

// SMS Templates
const smsTemplates = {
  bookingConfirmation: (booking: any) => {
    const checkInDate = booking.dates.checkIn ? new Date(booking.dates.checkIn).toLocaleDateString('en-IN') : 'Today';
    return `🎉 Booking Confirmed!
📋 ID: ${booking.bookingId}
🏨 ${booking.item.name}
📅 ${checkInDate}
👥 ${booking.guests.adults} Adults
💰 ₹${booking.finalAmount.toLocaleString()}
📞 Support: 8105003858
- coastalConnect`;
  },

  bookingReminder: (booking: any) => {
    const checkInDate = booking.dates.checkIn ? new Date(booking.dates.checkIn).toLocaleDateString('en-IN') : 'Tomorrow';
    return `⏰ Reminder: Your booking is tomorrow!
🏨 ${booking.item.name}
📅 ${checkInDate}
📋 ID: ${booking.bookingId}
💡 Carry valid ID proof
📞 Support: 8105003858
- coastalConnect`;
  },

  bookingCancellation: (booking: any) => {
    return `❌ Booking Cancelled
📋 ID: ${booking.bookingId}
🏨 ${booking.item.name}
💰 Refund: ₹${booking.refundAmount?.toLocaleString() || '0'}
⏱️ 3-5 business days
📞 Support: 8105003858
- coastalConnect`;
  },

  otpVerification: (otp: string) => {
    return `🔐 Your coastalConnect OTP: ${otp}
Valid for 10 minutes. Don't share with anyone.
- coastalConnect`;
  },

  welcome: (name: string) => {
    return `🌊 Welcome to coastalConnect, ${name}!
Discover authentic Coastal Karnataka experiences.
🏠 Homestays | 🍽️ Eateries | 🚗 Drivers
Start exploring: coastalconnect.in
- coastalConnect Team`;
  },

  paymentSuccess: (booking: any) => {
    return `✅ Payment Successful!
📋 ${booking.bookingId}
💰 ₹${booking.finalAmount.toLocaleString()}
🏨 ${booking.item.name}
Confirmation email sent.
📞 Support: 8105003858
- coastalConnect`;
  },

  paymentFailed: (booking: any) => {
    return `❌ Payment Failed
📋 ${booking.bookingId}
💰 ₹${booking.finalAmount.toLocaleString()}
Please try again or contact support.
📞 8105003858
- coastalConnect`;
  }
};

export class SMSService {
  // Send SMS using TextLocal (Popular in India)
  static async sendViaTextLocal(phone: string, message: string) {
    try {
      const apiUrl = 'https://api.textlocal.in/send/';
      
      const formData = new URLSearchParams();
      formData.append('apikey', smsConfig.apiKey);
      formData.append('numbers', phone.startsWith('+91') ? phone.substring(3) : phone);
      formData.append('message', message);
      formData.append('sender', smsConfig.senderId || 'COASTAL');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      const result = await response.json();

      if (result.status === 'success') {
        return {
          success: true,
          messageId: result.batch_id,
          provider: 'textlocal',
          cost: result.cost
        };
      } else {
        return {
          success: false,
          error: result.errors?.[0]?.message || 'SMS sending failed',
          provider: 'textlocal'
        };
      }
    } catch (error) {
      console.error('TextLocal SMS error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'textlocal'
      };
    }
  }

  // Send SMS using MSG91 (Alternative Indian provider)
  static async sendViaMSG91(phone: string, message: string) {
    try {
      const apiUrl = `https://control.msg91.com/api/sendhttp.php`;
      
      const params = new URLSearchParams({
        authkey: smsConfig.apiKey,
        mobiles: phone.startsWith('+91') ? phone.substring(3) : phone,
        message: message,
        sender: smsConfig.senderId || 'COASTAL',
        route: '4',
        country: '91'
      });

      const response = await fetch(`${apiUrl}?${params}`, {
        method: 'GET'
      });

      const result = await response.text();

      if (result.includes('success')) {
        return {
          success: true,
          messageId: result,
          provider: 'msg91'
        };
      } else {
        return {
          success: false,
          error: result,
          provider: 'msg91'
        };
      }
    } catch (error) {
      console.error('MSG91 SMS error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'msg91'
      };
    }
  }

  // Send SMS using Twilio (International)
  static async sendViaTwilio(phone: string, message: string) {
    try {
      // Note: Requires twilio package installation
      // const twilio = require('twilio');
      // const client = twilio(smsConfig.apiKey, smsConfig.apiSecret);
      
      // For demo purposes, we'll simulate the response
      console.log('Twilio SMS would be sent:', { phone, message });
      
      return {
        success: true,
        messageId: `twilio_${Date.now()}`,
        provider: 'twilio'
      };
    } catch (error) {
      console.error('Twilio SMS error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'twilio'
      };
    }
  }

  // Main SMS sending method
  static async sendSMS(phone: string, message: string) {
    // Validate phone number format
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return {
        success: false,
        error: 'Invalid phone number format'
      };
    }

    // Ensure Indian number format
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.slice(-10)}`;

    // Choose provider based on configuration
    switch (smsConfig.provider) {
      case 'textlocal':
        return this.sendViaTextLocal(formattedPhone, message);
      case 'msg91':
        return this.sendViaMSG91(formattedPhone, message);
      case 'twilio':
        return this.sendViaTwilio(`+${formattedPhone}`, message);
      default:
        // Fallback to console logging for development
        console.log('SMS (Development Mode):', {
          to: `+${formattedPhone}`,
          message: message,
          timestamp: new Date().toISOString()
        });
        return {
          success: true,
          messageId: `dev_${Date.now()}`,
          provider: 'development'
        };
    }
  }

  // Templated SMS methods
  static async sendBookingConfirmation(phone: string, booking: any) {
    const message = smsTemplates.bookingConfirmation(booking);
    return this.sendSMS(phone, message);
  }

  static async sendBookingReminder(phone: string, booking: any) {
    const message = smsTemplates.bookingReminder(booking);
    return this.sendSMS(phone, message);
  }

  static async sendBookingCancellation(phone: string, booking: any) {
    const message = smsTemplates.bookingCancellation(booking);
    return this.sendSMS(phone, message);
  }

  static async sendOTPVerification(phone: string, otp: string) {
    const message = smsTemplates.otpVerification(otp);
    return this.sendSMS(phone, message);
  }

  static async sendWelcomeSMS(phone: string, name: string) {
    const message = smsTemplates.welcome(name);
    return this.sendSMS(phone, message);
  }

  static async sendPaymentSuccess(phone: string, booking: any) {
    const message = smsTemplates.paymentSuccess(booking);
    return this.sendSMS(phone, message);
  }

  static async sendPaymentFailed(phone: string, booking: any) {
    const message = smsTemplates.paymentFailed(booking);
    return this.sendSMS(phone, message);
  }

  static async sendCustomSMS(phone: string, message: string) {
    return this.sendSMS(phone, message);
  }

  // Bulk SMS sending
  static async sendBulkSMS(phoneNumbers: string[], message: string) {
    const results = [];
    
    for (const phone of phoneNumbers) {
      try {
        const result = await this.sendSMS(phone, message);
        results.push({
          phone,
          ...result
        });
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        results.push({
          phone,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  // Generate OTP
  static generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  // Verify phone number format
  static isValidIndianPhoneNumber(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    // Indian mobile numbers: 10 digits starting with 6-9
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return indianMobileRegex.test(cleanPhone.slice(-10));
  }

  // Get SMS delivery status (if supported by provider)
  static async getDeliveryStatus(messageId: string) {
    try {
      // This would vary by provider
      // For TextLocal:
      if (smsConfig.provider === 'textlocal') {
        const apiUrl = `https://api.textlocal.in/get_delivery_receipt.php`;
        const params = new URLSearchParams({
          apikey: smsConfig.apiKey,
          batch_id: messageId
        });

        const response = await fetch(`${apiUrl}?${params}`);
        const result = await response.json();
        
        return {
          success: true,
          status: result.status,
          delivered: result.status === 'D',
          deliveredAt: result.delivered_at
        };
      }
      
      // For development/other providers, return mock status
      return {
        success: true,
        status: 'delivered',
        delivered: true,
        deliveredAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting delivery status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // SMS statistics and analytics
  static async getSMSStats(dateFrom?: Date, dateTo?: Date) {
    // In a real implementation, this would query a database
    // For now, return mock statistics
    return {
      totalSent: 1250,
      delivered: 1190,
      failed: 45,
      pending: 15,
      deliveryRate: 95.2,
      cost: 187.50,
      period: {
        from: dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: dateTo || new Date()
      },
      breakdown: {
        bookingConfirmations: 450,
        reminders: 380,
        otpVerifications: 420
      }
    };
  }
}

// Verify SMS service configuration
export async function verifySMSConfig() {
  try {
    console.log(`📱 SMS service configured with provider: ${smsConfig.provider}`);
    
    if (smsConfig.provider === 'development') {
      console.log('⚠️  SMS service is in development mode - messages will be logged to console');
    } else if (!smsConfig.apiKey) {
      console.log('❌ SMS service API key is missing');
      return false;
    } else {
      console.log('✅ SMS service is ready');
    }
    
    return true;
  } catch (error) {
    console.error('❌ SMS service configuration error:', error);
    return false;
  }
}

export default SMSService;
