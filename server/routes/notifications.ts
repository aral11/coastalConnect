import { RequestHandler } from "express";
import { EmailService } from "../services/emailService";
import { SMSService } from "../services/smsService";

// Send booking confirmation email
export const sendBookingConfirmation: RequestHandler = async (req, res) => {
  try {
    const { email, bookingDetails } = req.body;

    if (!email || !bookingDetails) {
      return res.status(400).json({
        success: false,
        message: 'Email and booking details are required'
      });
    }

    // Send email confirmation
    const emailResult = await EmailService.sendBookingConfirmation(bookingDetails);
    
    // Send SMS confirmation (optional)
    let smsResult = null;
    if (bookingDetails.contactInfo?.phone) {
      try {
        smsResult = await SMSService.sendBookingConfirmation(
          bookingDetails.contactInfo.phone,
          bookingDetails
        );
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
        // Don't fail the entire request if SMS fails
      }
    }

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Confirmation sent successfully',
        data: {
          email: emailResult,
          sms: smsResult
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send confirmation email',
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Send booking cancellation notification
export const sendBookingCancellation: RequestHandler = async (req, res) => {
  try {
    const { email, bookingDetails } = req.body;

    if (!email || !bookingDetails) {
      return res.status(400).json({
        success: false,
        message: 'Email and booking details are required'
      });
    }

    const emailResult = await EmailService.sendBookingCancellation(bookingDetails);
    
    // Send SMS notification
    let smsResult = null;
    if (bookingDetails.contactInfo?.phone) {
      try {
        smsResult = await SMSService.sendBookingCancellation(
          bookingDetails.contactInfo.phone,
          bookingDetails
        );
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
      }
    }

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Cancellation notification sent successfully',
        data: {
          email: emailResult,
          sms: smsResult
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send cancellation notification',
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error('Error sending cancellation notification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Send booking reminder
export const sendBookingReminder: RequestHandler = async (req, res) => {
  try {
    const { email, bookingDetails } = req.body;

    if (!email || !bookingDetails) {
      return res.status(400).json({
        success: false,
        message: 'Email and booking details are required'
      });
    }

    const emailResult = await EmailService.sendBookingReminder(bookingDetails);
    
    // Send SMS reminder
    let smsResult = null;
    if (bookingDetails.contactInfo?.phone) {
      try {
        smsResult = await SMSService.sendBookingReminder(
          bookingDetails.contactInfo.phone,
          bookingDetails
        );
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
      }
    }

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Reminder sent successfully',
        data: {
          email: emailResult,
          sms: smsResult
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send reminder',
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Send welcome email to new users
export const sendWelcomeEmail: RequestHandler = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user || !user.email) {
      return res.status(400).json({
        success: false,
        message: 'User information is required'
      });
    }

    const emailResult = await EmailService.sendWelcomeEmail(user);

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Welcome email sent successfully',
        data: emailResult
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send welcome email',
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Send custom notification
export const sendCustomNotification: RequestHandler = async (req, res) => {
  try {
    const { email, phone, subject, message, type = 'email' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    let result = null;

    if (type === 'email' && email) {
      result = await EmailService.sendEmail(
        email,
        subject || 'Notification from coastalConnect',
        `<p>${message}</p>`,
        message
      );
    } else if (type === 'sms' && phone) {
      result = await SMSService.sendCustomSMS(phone, message);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification type or missing recipient information'
      });
    }

    if (result?.success) {
      res.json({
        success: true,
        message: 'Notification sent successfully',
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send notification',
        error: result?.error
      });
    }
  } catch (error) {
    console.error('Error sending custom notification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Send bulk notifications (for newsletters, announcements)
export const sendBulkNotification: RequestHandler = async (req, res) => {
  try {
    const { recipients, subject, message, type = 'email' } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipients array is required'
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    let results = [];

    if (type === 'email') {
      results = await EmailService.sendBulkEmail(
        recipients,
        subject || 'Announcement from coastalConnect',
        `<p>${message}</p>`,
        message
      );
    } else if (type === 'sms') {
      results = await SMSService.sendBulkSMS(recipients, message);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification type'
      });
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    res.json({
      success: true,
      message: `Bulk notification completed. ${successCount} sent, ${failureCount} failed.`,
      data: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
        results: results
      }
    });
  } catch (error) {
    console.error('Error sending bulk notification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get notification history for a user
export const getNotificationHistory: RequestHandler = async (req, res) => {
  try {
    const { email, phone, limit = 50, offset = 0 } = req.query;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone is required'
      });
    }

    // This would typically query a notifications log table
    // For now, return mock data
    const mockHistory = [
      {
        id: 1,
        type: 'email',
        recipient: email || phone,
        subject: 'Booking Confirmation',
        status: 'sent',
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: 2,
        type: 'sms',
        recipient: phone || email,
        subject: 'Booking Reminder',
        status: 'sent',
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      }
    ];

    res.json({
      success: true,
      data: mockHistory,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: mockHistory.length
      }
    });
  } catch (error) {
    console.error('Error fetching notification history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Test notification endpoints
export const testEmail: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for testing'
      });
    }

    const result = await EmailService.sendEmail(
      email,
      'Test Email from coastalConnect',
      '<h1>Test Email</h1><p>This is a test email from coastalConnect. If you received this, email service is working correctly!</p>',
      'Test Email - This is a test email from coastalConnect. If you received this, email service is working correctly!'
    );

    res.json({
      success: result.success,
      message: result.success ? 'Test email sent successfully' : 'Test email failed',
      data: result
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const testSMS: RequestHandler = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required for testing'
      });
    }

    const result = await SMSService.sendCustomSMS(
      phone,
      'Test SMS from coastalConnect. If you received this, SMS service is working correctly!'
    );

    res.json({
      success: result?.success || false,
      message: result?.success ? 'Test SMS sent successfully' : 'Test SMS failed',
      data: result
    });
  } catch (error) {
    console.error('Error sending test SMS:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
