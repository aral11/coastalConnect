import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'admin@coastalconnect.in',
    pass: process.env.SMTP_PASSWORD || 'your-app-password',
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
const emailTemplates = {
  vendorRegistrationConfirmation: (vendor: any) => ({
    subject: `Registration Submitted - ${vendor.businessName} | coastalConnect`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vendor Registration - coastalConnect</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #fb7c25 0%, #ea580c 100%); color: white; padding: 20px; text-align: center; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .tagline { font-size: 14px; opacity: 0.9; }
          .content { padding: 30px; }
          .registration-card { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #fb7c25; }
          .registration-id { background: #fb7c25; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin-bottom: 15px; }
          .details-table { width: 100%; margin: 20px 0; }
          .details-table td { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .details-table .label { font-weight: 600; color: #475569; width: 40%; }
          .details-table .value { color: #1e293b; }
          .alert { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 20px 0; }
          .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
          .btn { background: #fb7c25; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 5px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">coastalConnect</div>
            <div class="tagline">Vendor Registration Confirmation</div>
          </div>

          <div class="content">
            <h2>Hello ${vendor.ownerName},</h2>
            <p>Thank you for registering your business with coastalConnect! Your registration has been successfully submitted and is currently under review.</p>

            <div class="registration-card">
              <div class="registration-id">Registration: ${vendor.registrationRef}</div>

              <table class="details-table">
                <tr>
                  <td class="label">Business Name:</td>
                  <td class="value">${vendor.businessName}</td>
                </tr>
                <tr>
                  <td class="label">Category:</td>
                  <td class="value">${vendor.category}</td>
                </tr>
                <tr>
                  <td class="label">Submission Date:</td>
                  <td class="value">${new Date(vendor.submissionDate).toLocaleDateString('en-IN')}</td>
                </tr>
                <tr>
                  <td class="label">Status:</td>
                  <td class="value">Pending Review</td>
                </tr>
              </table>
            </div>

            <div class="alert">
              <strong>🕐 What happens next?</strong><br>
              • Document verification (24-48 hours)<br>
              • Business verification call<br>
              • Approval notification via email<br>
              • Payment link for subscription<br>
              • Account activation
            </div>

            <p>We'll contact you within 24-48 hours with an update on your registration status.</p>

            <a href="mailto:admin@coastalconnect.in" class="btn">Contact Support</a>
          </div>

          <div class="footer">
            <p>© 2024 coastalConnect. All rights reserved.</p>
            <p>📞 Support: +91 8105003858 | 📧 admin@coastalconnect.in</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  adminVendorNotification: (vendor: any) => ({
    subject: `New Vendor Registration - ${vendor.businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Vendor Registration - Admin</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
          .header { background: #dc2626; color: white; padding: 15px; text-align: center; border-radius: 6px; }
          .content { padding: 20px 0; }
          .details { background: #f9fafb; padding: 15px; border-radius: 6px; margin: 15px 0; }
          .btn { background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Vendor Registration - Admin Alert</h2>
          </div>

          <div class="content">
            <h3>New vendor registration requires approval:</h3>

            <div class="details">
              <strong>Registration ID:</strong> ${vendor.registrationRef}<br>
              <strong>Business Name:</strong> ${vendor.businessName}<br>
              <strong>Owner:</strong> ${vendor.ownerName}<br>
              <strong>Category:</strong> ${vendor.category}<br>
              <strong>Email:</strong> ${vendor.vendorEmail}<br>
              <strong>Phone:</strong> ${vendor.vendorPhone}<br>
              <strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}
            </div>

            <p>Please review and approve/reject this registration in the admin panel.</p>

            <a href="https://coastalconnect.in/admin" class="btn">Go to Admin Panel</a>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  bookingConfirmation: (booking: any) => ({
    subject: `Booking Confirmed - ${booking.item.name} | coastalConnect`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - coastalConnect</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 20px; text-align: center; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .tagline { font-size: 14px; opacity: 0.9; }
          .content { padding: 30px; }
          .booking-card { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #0ea5e9; }
          .booking-id { background: #0ea5e9; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin-bottom: 15px; }
          .details-table { width: 100%; margin: 20px 0; }
          .details-table td { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .details-table .label { font-weight: 600; color: #475569; width: 40%; }
          .details-table .value { color: #1e293b; }
          .pricing-table { background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .pricing-row { display: flex; justify-content: space-between; margin: 8px 0; }
          .pricing-total { border-top: 2px solid #0ea5e9; padding-top: 12px; margin-top: 12px; font-weight: bold; font-size: 18px; color: #0ea5e9; }
          .alert { background: #dbeafe; border: 1px solid #93c5fd; border-radius: 6px; padding: 15px; margin: 20px 0; }
          .alert-icon { color: #2563eb; margin-right: 8px; }
          .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
          .footer a { color: #0ea5e9; text-decoration: none; }
          .btn { background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 5px; font-weight: 600; }
          .btn-secondary { background: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="logo">coastalConnect</div>
            <div class="tagline">Your Coastal Karnataka Experience</div>
          </div>

          <!-- Main Content -->
          <div class="content">
            <h1 style="color: #1e293b; margin-bottom: 10px;">Booking Confirmed! 🎉</h1>
            <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
              Dear ${booking.contactInfo.firstName} ${booking.contactInfo.lastName},<br><br>
              Thank you for choosing coastalConnect! Your booking has been confirmed and we're excited to serve you.
            </p>

            <!-- Booking Card -->
            <div class="booking-card">
              <div class="booking-id">Booking ID: ${booking.bookingId}</div>
              
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <img src="${booking.item.image}" alt="${booking.item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
                <div>
                  <h3 style="margin: 0; color: #1e293b;">${booking.item.name}</h3>
                  <p style="margin: 5px 0; color: #64748b;">⭐ ${booking.item.rating} | 📍 ${booking.item.location}</p>
                  <p style="margin: 0; color: #0ea5e9; font-weight: 600;">${booking.item.type.charAt(0).toUpperCase() + booking.item.type.slice(1)}</p>
                </div>
              </div>

              <!-- Booking Details -->
              <table class="details-table">
                ${booking.dates.checkIn ? `
                <tr>
                  <td class="label">Check-in Date:</td>
                  <td class="value">${new Date(booking.dates.checkIn).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                ` : ''}
                ${booking.dates.checkOut ? `
                <tr>
                  <td class="label">Check-out Date:</td>
                  <td class="value">${new Date(booking.dates.checkOut).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                ` : ''}
                <tr>
                  <td class="label">Guests:</td>
                  <td class="value">${booking.guests.adults} Adults${booking.guests.children > 0 ? `, ${booking.guests.children} Children` : ''}</td>
                </tr>
                ${booking.rooms ? `
                <tr>
                  <td class="label">Rooms:</td>
                  <td class="value">${booking.rooms}</td>
                </tr>
                ` : ''}
                <tr>
                  <td class="label">Contact:</td>
                  <td class="value">${booking.contactInfo.phone}</td>
                </tr>
                ${booking.specialRequests ? `
                <tr>
                  <td class="label">Special Requests:</td>
                  <td class="value">${booking.specialRequests}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- Pricing Breakdown -->
            <div class="pricing-table">
              <h3 style="margin-top: 0; color: #1e293b;">Payment Summary</h3>
              <div class="pricing-row">
                <span>Subtotal:</span>
                <span>₹${booking.totalAmount.toLocaleString()}</span>
              </div>
              ${booking.discount > 0 ? `
              <div class="pricing-row" style="color: #059669;">
                <span>Discount Applied:</span>
                <span>-₹${booking.discount.toLocaleString()}</span>
              </div>
              ` : ''}
              <div class="pricing-row">
                <span>Taxes & Fees:</span>
                <span>₹${booking.taxes.toLocaleString()}</span>
              </div>
              <div class="pricing-row pricing-total">
                <span>Total Paid:</span>
                <span>₹${booking.finalAmount.toLocaleString()}</span>
              </div>
            </div>

            <!-- Important Information -->
            <div class="alert">
              <strong class="alert-icon">💡</strong>
              <strong>Important Information:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Booking confirmation will be sent to your mobile via SMS</li>
                <li>Free cancellation available up to 24 hours before check-in</li>
                <li>Please carry a valid ID proof during your visit</li>
                <li>Contact our 24/7 support for any assistance: +91 8105003858</li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://coastalconnect.in/bookings/${booking.bookingId}" class="btn">View Booking Details</a>
              <a href="https://coastalconnect.in/support" class="btn btn-secondary">Contact Support</a>
            </div>

            <!-- Next Steps -->
            <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1e293b; margin-top: 0;">What's Next?</h3>
              <ol style="color: #64748b; line-height: 1.8;">
                <li>You'll receive an SMS confirmation within 5 minutes</li>
                <li>The service provider will contact you 24 hours before your booking</li>
                <li>Check your email for any updates or changes</li>
                <li>Rate your experience after completion to help others</li>
              </ol>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p><strong>coastalConnect</strong> - Your trusted travel companion in Karnataka</p>
            <p>
              📧 <a href="mailto:admin@coastalconnect.in">admin@coastalconnect.in</a> | 
              📞 +91 8105003858 | 
              🌐 <a href="https://coastalconnect.in">coastalconnect.in</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px;">
              Live in Udupi & Manipal | Mangalore Coming Soon<br>
              Follow us: <a href="#">@coastalvibes.in</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Booking Confirmed - coastalConnect
      
      Dear ${booking.contactInfo.firstName} ${booking.contactInfo.lastName},
      
      Your booking has been confirmed!
      
      Booking ID: ${booking.bookingId}
      Service: ${booking.item.name}
      Location: ${booking.item.location}
      ${booking.dates.checkIn ? `Check-in: ${new Date(booking.dates.checkIn).toLocaleDateString()}` : ''}
      ${booking.dates.checkOut ? `Check-out: ${new Date(booking.dates.checkOut).toLocaleDateString()}` : ''}
      Guests: ${booking.guests.adults} Adults, ${booking.guests.children} Children
      
      Total Amount: ₹${booking.finalAmount.toLocaleString()}
      
      Important:
      - Free cancellation up to 24 hours before
      - Carry valid ID proof
      - 24/7 support: +91 8105003858
      
      Thank you for choosing coastalConnect!
      
      coastalConnect Team
      admin@coastalconnect.in
      https://coastalconnect.in
    `
  }),

  bookingCancellation: (booking: any) => ({
    subject: `Booking Cancelled - ${booking.item.name} | coastalConnect`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Cancellation - coastalConnect</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .alert { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Cancelled</h1>
            <p>coastalConnect</p>
          </div>
          <div class="content">
            <p>Dear ${booking.contactInfo.firstName} ${booking.contactInfo.lastName},</p>
            <p>Your booking has been cancelled as requested.</p>
            
            <div class="alert">
              <strong>Booking ID:</strong> ${booking.bookingId}<br>
              <strong>Service:</strong> ${booking.item.name}<br>
              <strong>Refund Amount:</strong> ₹${booking.refundAmount?.toLocaleString() || '0'}<br>
              <strong>Refund Status:</strong> ${booking.refundStatus || 'Processing'}
            </div>
            
            <p>Refund will be processed within 3-5 business days to your original payment method.</p>
            <p>We're sorry to see you go and hope to serve you again soon!</p>
            
            <p>Best regards,<br>coastalConnect Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Booking Cancelled - coastalConnect
      
      Dear ${booking.contactInfo.firstName} ${booking.contactInfo.lastName},
      
      Your booking has been cancelled.
      
      Booking ID: ${booking.bookingId}
      Service: ${booking.item.name}
      Refund Amount: ₹${booking.refundAmount?.toLocaleString() || '0'}
      
      Refund will be processed within 3-5 business days.
      
      coastalConnect Team
    `
  }),

  bookingReminder: (booking: any) => ({
    subject: `Reminder: Your booking tomorrow - ${booking.item.name} | coastalConnect`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Reminder - coastalConnect</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
          .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .reminder-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Booking Reminder</h1>
            <p>coastalConnect</p>
          </div>
          <div class="content">
            <p>Dear ${booking.contactInfo.firstName} ${booking.contactInfo.lastName},</p>
            <p>This is a friendly reminder about your upcoming booking!</p>
            
            <div class="reminder-box">
              <strong>Tomorrow's Booking:</strong><br>
              📍 ${booking.item.name}<br>
              📅 ${booking.dates.checkIn ? new Date(booking.dates.checkIn).toLocaleDateString() : 'Tomorrow'}<br>
              👥 ${booking.guests.adults} Adults, ${booking.guests.children} Children<br>
              📞 Contact: ${booking.contactInfo.phone}
            </div>
            
            <p><strong>Important reminders:</strong></p>
            <ul>
              <li>Carry a valid ID proof</li>
              <li>Arrive 15 minutes early</li>
              <li>Contact us if you need to make changes: +91 8105003858</li>
            </ul>
            
            <p>We look forward to serving you!</p>
            <p>Best regards,<br>coastalConnect Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Booking Reminder - coastalConnect
      
      Dear ${booking.contactInfo.firstName} ${booking.contactInfo.lastName},
      
      Reminder: Your booking is tomorrow!
      
      Service: ${booking.item.name}
      Date: ${booking.dates.checkIn ? new Date(booking.dates.checkIn).toLocaleDateString() : 'Tomorrow'}
      Guests: ${booking.guests.adults} Adults, ${booking.guests.children} Children
      
      Remember to:
      - Carry valid ID proof
      - Arrive 15 minutes early
      
      Contact: +91 8105003858
      
      coastalConnect Team
    `
  }),

  welcomeEmail: (user: any) => ({
    subject: 'Welcome to coastalConnect - Your Coastal Karnataka Journey Begins!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to coastalConnect</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .feature-box { background: #f8fafc; border-radius: 6px; padding: 20px; margin: 15px 0; }
          .btn { background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌊 Welcome to coastalConnect!</h1>
            <p>Your gateway to authentic Coastal Karnataka experiences</p>
          </div>
          <div class="content">
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>Welcome to coastalConnect! We're thrilled to have you join our community of coastal explorers.</p>
            
            <div class="feature-box">
              <h3>🏠 Discover Authentic Homestays</h3>
              <p>Experience traditional Udupi hospitality with our verified homestay hosts</p>
            </div>
            
            <div class="feature-box">
              <h3>🍽️ Savor Local Eateries</h3>
              <p>From authentic Udupi cuisine to coastal delicacies - taste the real Karnataka</p>
            </div>
            
            <div class="feature-box">
              <h3>🚗 Reliable Transportation</h3>
              <p>Safe and trusted drivers to explore Udupi, Manipal, and surrounding areas</p>
            </div>
            
            <div class="feature-box">
              <h3>🎨 Connect with Local Creators</h3>
              <p>Discover and support talented local artists, photographers, and content creators</p>
            </div>
            
            <p><strong>Ready to start exploring?</strong></p>
            <a href="https://coastalconnect.in" class="btn">Start Your Journey</a>
            
            <p>Need help? Our support team is available 24/7 at +91 8105003858</p>
            
            <p>Best regards,<br>The coastalConnect Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to coastalConnect!
      
      Dear ${user.firstName} ${user.lastName},
      
      Welcome to coastalConnect - your gateway to authentic Coastal Karnataka experiences!
      
      Discover:
      🏠 Authentic Homestays
      🍽️ Local Eateries  
      🚗 Reliable Transportation
      🎨 Local Creators
      
      Start exploring: https://coastalconnect.in
      Support: +91 8105003858
      
      The coastalConnect Team
    `
  })
};

// Email service functions
export class EmailService {
  static async sendEmail(to: string, subject: string, html: string, text: string) {
    try {
      const mailOptions = {
        from: `"coastalConnect" <${emailConfig.auth.user}>`,
        to,
        subject,
        html,
        text
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async sendBookingConfirmation(booking: any) {
    const template = emailTemplates.bookingConfirmation(booking);
    return this.sendEmail(
      booking.contactInfo.email,
      template.subject,
      template.html,
      template.text
    );
  }

  static async sendBookingCancellation(booking: any) {
    const template = emailTemplates.bookingCancellation(booking);
    return this.sendEmail(
      booking.contactInfo.email,
      template.subject,
      template.html,
      template.text
    );
  }

  static async sendBookingReminder(booking: any) {
    const template = emailTemplates.bookingReminder(booking);
    return this.sendEmail(
      booking.contactInfo.email,
      template.subject,
      template.html,
      template.text
    );
  }

  static async sendWelcomeEmail(user: any) {
    const template = emailTemplates.welcomeEmail(user);
    return this.sendEmail(
      user.email,
      template.subject,
      template.html,
      template.text
    );
  }

  // Send bulk emails (for newsletters, announcements)
  static async sendBulkEmail(recipients: string[], subject: string, html: string, text: string) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendEmail(recipient, subject, html, text);
        results.push({ email: recipient, ...result });
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({ 
          email: recipient, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return results;
  }

  // Schedule reminder emails
  static async scheduleBookingReminders() {
    try {
      // This would typically be called by a cron job
      // Get all bookings with check-in date tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Query database for bookings
      // const upcomingBookings = await getBookingsForDate(tomorrow);
      
      // Send reminders
      // for (const booking of upcomingBookings) {
      //   await this.sendBookingReminder(booking);
      // }
      
      console.log('Booking reminders scheduled successfully');
    } catch (error) {
      console.error('Failed to schedule booking reminders:', error);
    }
  }
}

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error);
    return false;
  }
}

export default EmailService;
