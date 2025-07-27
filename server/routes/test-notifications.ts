import { Router, Request, Response } from 'express';
import { EmailService } from '../services/emailService';
import { SMSService } from '../services/smsService';

const router = Router();

// Test email functionality
router.post('/test-email', async (req: Request, res: Response) => {
  try {
    const { to, type = 'booking' } = req.body;
    
    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    let result;
    
    if (type === 'vendor-registration') {
      result = await EmailService.sendVendorRegistrationConfirmation({
        vendorEmail: to,
        businessName: 'Test Business',
        ownerName: 'Test Owner',
        registrationRef: 'VR123456',
        category: 'homestays',
        submissionDate: new Date().toISOString()
      });
    } else {
      // Test booking confirmation
      result = await EmailService.sendBookingConfirmation({
        bookingId: 'TEST123',
        item: {
          name: 'Test Homestay',
          location: 'Udupi, Karnataka',
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
        },
        contactInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: to,
          phone: '+91 9876543210'
        },
        dates: {
          checkIn: new Date().toISOString(),
          checkOut: new Date(Date.now() + 86400000).toISOString()
        },
        guests: {
          adults: 2,
          children: 0
        },
        finalAmount: 2500,
        paymentMethod: 'Razorpay'
      });
    }

    res.json({
      success: true,
      message: 'Test email sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test SMS functionality
router.post('/test-sms', async (req: Request, res: Response) => {
  try {
    const { phone, type = 'booking' } = req.body;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    let result;
    
    if (type === 'vendor-registration') {
      result = await SMSService.sendVendorRegistrationConfirmation(phone, {
        businessName: 'Test Business',
        registrationRef: 'VR123456',
        category: 'homestays'
      });
    } else {
      // Test booking confirmation
      result = await SMSService.sendBookingConfirmation(phone, {
        bookingId: 'TEST123',
        item: {
          name: 'Test Homestay',
          location: 'Udupi'
        },
        dates: {
          checkIn: new Date().toISOString()
        },
        guests: {
          adults: 2
        },
        finalAmount: 2500
      });
    }

    res.json({
      success: true,
      message: 'Test SMS sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Test SMS error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test SMS',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test notification configuration
router.get('/test-config', async (req: Request, res: Response) => {
  try {
    // Check email configuration
    const emailConfig = {
      host: process.env.SMTP_HOST || 'Not configured',
      port: process.env.SMTP_PORT || 'Not configured',
      user: process.env.SMTP_USER || 'Not configured',
      configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER)
    };

    // Check SMS configuration
    const smsConfig = {
      provider: process.env.SMS_PROVIDER || 'Not configured',
      apiKey: process.env.SMS_API_KEY ? 'Configured' : 'Not configured',
      senderId: process.env.SMS_SENDER_ID || 'Not configured',
      configured: !!(process.env.SMS_PROVIDER && process.env.SMS_API_KEY)
    };

    res.json({
      success: true,
      data: {
        email: emailConfig,
        sms: smsConfig,
        overall: {
          emailReady: emailConfig.configured,
          smsReady: smsConfig.configured,
          status: (emailConfig.configured && smsConfig.configured) ? 'Fully configured' : 'Partially configured'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking notification configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
