import { RequestHandler } from 'express';
import { sendEmail } from '../services/emailService';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: string;
  message: string;
}

export const submitContactForm: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, subject, category, message }: ContactFormData = req.body;

    // Validate required fields
    if (!name || !email || !subject || !category || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Prepare email content
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FF5722, #F44336); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Contact Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 10px; color: #333;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px; color: #333;">${email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px; color: #333;">${phone || 'Not provided'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #555;">Category:</td>
              <td style="padding: 10px; color: #333;">${category}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; font-weight: bold; color: #555;">Subject:</td>
              <td style="padding: 10px; color: #333;">${subject}</td>
            </tr>
          </table>
          
          <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; color: #333; line-height: 1.5;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 5px; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              This message was sent from the Coastal Connect contact form.<br>
              Please respond to the customer at: <a href="mailto:${email}" style="color: #FF5722;">${email}</a>
            </p>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p style="margin: 0;">© 2024 Coastal Connect. All rights reserved.</p>
        </div>
      </div>
    `;

    // Customer acknowledgment email
    const customerEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FF5722, #F44336); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${name},</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Thank you for reaching out to Coastal Connect! We have received your message and our team will review it shortly.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Your Message Details:</h3>
            <p style="margin: 5px 0; color: #555;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Category:</strong> ${category}</p>
            <p style="margin: 5px 0; color: #555;"><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; color: #333; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            We typically respond within <strong>24 hours</strong> during business hours (Monday-Friday, 9 AM - 6 PM IST). 
            For urgent matters, you can also reach us at:
          </p>
          
          <div style="background: #FF5722; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📞 Phone:</strong> +91 9876543210</p>
            <p style="margin: 5px 0;"><strong>✉️ Email:</strong> hello@coastalconnect.in</p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Thank you for choosing Coastal Connect for your coastal Karnataka travel needs!
          </p>
          
          <p style="color: #555; margin-top: 30px;">
            Best regards,<br>
            <strong>The Coastal Connect Team</strong>
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p style="margin: 0;">© 2024 Coastal Connect. All rights reserved.</p>
          <p style="margin: 5px 0;">Visit us at <a href="https://coastalconnect.in" style="color: #FF5722;">coastalconnect.in</a></p>
        </div>
      </div>
    `;

    try {
      // Send email to admin
      await sendEmail(
        'hello@coastalconnect.in',
        `New Contact Form: ${subject}`,
        adminEmailContent
      );

      // Send acknowledgment email to customer
      await sendEmail(
        email,
        'Thank you for contacting Coastal Connect',
        customerEmailContent
      );

      res.json({
        success: true,
        message: 'Contact form submitted successfully. We will get back to you soon!'
      });

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Still return success to user, but log the email failure
      res.json({
        success: true,
        message: 'Contact form submitted successfully. We will get back to you soon!',
        note: 'Email notification may be delayed'
      });
    }

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form. Please try again.'
    });
  }
};

export const getContactInfo: RequestHandler = async (req, res) => {
  try {
    const contactInfo = {
      phone: '+91 9876543210',
      email: 'hello@coastalconnect.in',
      address: 'Near Light House Hill Road, Mangalore - 575001',
      businessHours: {
        weekdays: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed'
      },
      supportCategories: [
        'General Inquiry',
        'Technical Support',
        'Booking Issue',
        'Partnership',
        'Complaint',
        'Feedback',
        'Other'
      ]
    };

    res.json({
      success: true,
      data: contactInfo
    });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact information'
    });
  }
};
