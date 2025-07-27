# CoastalConnect - Local Development Setup Guide

## 🚀 Quick Start for Local Development

The application is now configured to run in **development mode** by default, which means:
- ✅ No database required (uses fallback/mock data)
- ✅ No email server setup needed (logs emails to console)
- ✅ No SMS service required (logs SMS to console)
- ✅ No external API keys needed (uses mock data)

## 📦 Installation & Startup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will start at: http://localhost:8080

## 🔧 Development Mode Features

### Database
- **Status**: Mock data mode (no SQL Server required)
- **Behavior**: All data operations use comprehensive fallback data
- **Logging**: Database connection attempts are logged but failures are handled gracefully

### Email Service
- **Status**: Development mode (no SMTP required)
- **Behavior**: All emails are logged to console instead of being sent
- **Logging**: Email content, recipients, and subjects are displayed in logs

### SMS Service
- **Status**: Development mode (no SMS provider required)
- **Behavior**: All SMS messages are logged to console instead of being sent
- **Logging**: Phone numbers and message content are displayed in logs

### External APIs
- **Google Places**: Uses enhanced fallback restaurant data
- **Google OAuth**: Simulated authentication flow
- **Payment Gateway**: Test mode with mock transactions

## 🛠️ Expected Logs During Startup

```
📧 Email Service: Running in development mode - emails will be logged instead of sent
📱 SMS Service: Running in development mode - SMS will be logged instead of sent
🔧 Development Mode: Skipping real database connection
📊 Using fallback/mock data for all database operations
⚠️ Google Places API failed: Using enhanced fallback restaurant data
```

**These are normal and expected in development mode!**

## ✅ What Should Work

1. **Homepage**: Loads with all sections and data
2. **Navigation**: All menu items and links work
3. **Search**: Search functionality with mock results
4. **Vendor Registration**: Complete form flow (logs notifications)
5. **User Authentication**: Login/signup flow (simulated)
6. **Booking Flow**: End-to-end booking process (mock payments)
7. **Admin Dashboard**: Admin functionality with mock data

## 🔄 Production Configuration

When ready for production, update these environment variables:

```bash
# Database (Required for production)
DB_MODE=production
DB_SERVER=your-production-server
DB_DATABASE=CoastalConnectProd

# Email Service (Required for production)
DISABLE_EMAIL_SENDING=false
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-app-password

# SMS Service (Required for production)
DISABLE_SMS_SENDING=false
SMS_API_KEY=your-sms-api-key

# Google Services (Optional but recommended)
GOOGLE_PLACES_API_KEY=your-google-api-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

## 🐛 Troubleshooting

### Issue: "Database connection failed"
**Solution**: This is normal in development mode. The app uses fallback data automatically.

### Issue: "Email sending failed"
**Solution**: This is normal in development mode. Emails are logged to console instead.

### Issue: "Google Places API failed"
**Solution**: This is normal in development mode. The app uses enhanced fallback restaurant data.

### Issue: Port already in use
**Solution**: Change the PORT in .env file or kill the process using the port.

### Issue: ENOTFOUND errors
**Solution**: This happens when external services are unavailable. The app handles this gracefully with fallbacks.

## 📱 Testing User Flows

### Vendor Registration
1. Go to `/vendor-register`
2. Fill out the form
3. Submit - check console for email/SMS logs
4. Go to admin dashboard to see pending approval

### User Booking
1. Browse services on homepage
2. Click "Book Now" on any service
3. Complete booking form
4. Simulate payment - check console for confirmation logs

### Admin Operations
1. Go to `/admin` 
2. Use admin key: `dev-admin-key-2024`
3. View pending approvals and manage content

## 🎯 Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Database | Mock data | SQL Server |
| Email | Console logs | Real SMTP |
| SMS | Console logs | Real SMS API |
| Payments | Mock/Test | Real Razorpay |
| Google APIs | Fallback | Real APIs |

## 📞 Support

If you encounter any issues not covered here:
1. Check the console logs for detailed error messages
2. Ensure all dependencies are installed (`npm install`)
3. Verify the port 8080 is available
4. Check that you're using the latest .env configuration

The application is designed to be robust and work seamlessly in development mode without any external dependencies!
