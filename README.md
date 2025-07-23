# coastalConnect - Coastal Karnataka Travel Platform

A professional travel booking platform for coastal Karnataka, India, similar to MMT and Booking.com. Features homestay bookings, driver hiring, and local eatery listings with integrated payments and SMS notifications.

## 🚀 Features

### Core Functionality
- **Homestay Booking**: Browse and book authentic homestays with real-time availability
- **Driver Services**: Hire local drivers with SMS notifications and trip tracking
- **Local Eateries**: Discover authentic coastal Karnataka restaurants with ratings
- **Authentication**: Email, Google, and Apple OAuth integration
- **Payment Gateway**: Razorpay integration for secure payments
- **SMS Notifications**: Twilio integration for booking confirmations and trip updates

### Technical Features
- **Database**: SQL Server with automatic table creation and seeding
- **Real-time Data**: Live booking management and status updates
- **Professional UI**: Production-ready interface similar to leading travel platforms
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Error Handling**: Graceful fallbacks for offline/cloud deployment

## 📋 Prerequisites

- **Node.js**: v18+ 
- **SQL Server**: Local instance (DESKTOP-6FSVDEL\\SQLEXPRESS)
- **Windows**: For SQL Server connectivity
- **Git**: For version control

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd coastalconnect
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm install

# Or if you prefer yarn
yarn install
```

### 3. Database Configuration

#### Option A: Local SQL Server (Recommended)
1. Ensure SQL Server is running on `DESKTOP-6FSVDEL\\SQLEXPRESS`
2. Create database user `DESKTOP-6FSVDEL\\Aral` with appropriate permissions
3. The application will automatically:
   - Create database `CoastalConnectUdupi`
   - Create all required tables
   - Seed with sample data

#### Option B: Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_SERVER=DESKTOP-6FSVDEL\\SQLEXPRESS
DB_USER=DESKTOP-6FSVDEL\\Aral
DB_PASSWORD=
DB_DATABASE=CoastalConnectUdupi
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# Authentication
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Apple OAuth (Optional)
APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_client_secret
```

### 4. Initialize Database
```bash
# Start the server (it will auto-initialize the database)
npm run dev

# Or manually seed the database via API
curl -X POST http://localhost:5000/api/seed
```

### 5. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (API).

## 🗄️ Database Schema

The application automatically creates the following tables:

### Users
- User accounts with OAuth support
- Email/password authentication
- Role-based access (customer, driver, host)

### Homestays
- Property listings with details, pricing, and amenities
- Location data with coordinates
- Ratings and reviews

### Eateries
- Restaurant listings with cuisine types
- Opening hours and price ranges
- Google ratings integration

### Drivers
- Driver profiles with vehicle information
- Hourly rates and experience
- Language preferences and availability

### Bookings
- **HomestayBookings**: Check-in/out dates, guest information
- **DriverBookings**: Trip details with pickup/dropoff locations
- Payment status and booking references

## 🔧 Configuration

### Payment Gateway Setup
1. Sign up for Razorpay account
2. Get API keys from dashboard
3. Add keys to `.env` file
4. Test with sandbox mode initially

### SMS Service Setup
1. Create Twilio account
2. Get phone number and API credentials
3. Configure in `.env` file
4. Verify phone number for testing

### OAuth Setup (Optional)
1. **Google**: Create project in Google Cloud Console
2. **Apple**: Configure in Apple Developer Portal
3. Add redirect URIs and credentials to `.env`

## 🚀 Production Deployment

### Environment Setup
1. Use production SQL Server instance
2. Configure SSL certificates
3. Set secure JWT secrets
4. Enable payment gateway production mode
5. Configure SMS service for production

### Security Checklist
- [ ] Change default JWT secret
- [ ] Enable database encryption
- [ ] Configure CORS for production domain
- [ ] Set up SSL/TLS certificates
- [ ] Enable rate limiting
- [ ] Configure backup strategy

### Performance Optimization
- Database indexing is automatically configured
- Static assets should be served via CDN
- Consider Redis for session management
- Implement database connection pooling

## 📱 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/email - Email/password login
POST /api/auth/google - Google OAuth
POST /api/auth/apple - Apple OAuth
GET /api/auth/verify - Token verification
```

### Booking Endpoints
```
POST /api/bookings/homestay - Create homestay booking
POST /api/bookings/driver - Create driver booking
GET /api/bookings/user - Get user bookings
POST /api/bookings/confirm-payment - Confirm payment
PUT /api/bookings/driver/:id/status - Update trip status
```

### Data Endpoints
```
GET /api/homestays - List homestays
GET /api/drivers - List drivers
GET /api/eateries - List eateries
GET /api/homestays/search - Search homestays
GET /api/drivers/search - Search drivers
```

## 🧪 Testing

### Manual Testing
1. Visit the application in browser
2. Test user registration/login
3. Make test bookings
4. Verify SMS notifications
5. Test payment flow (sandbox mode)

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password","name":"Test User"}'
```

## 🔍 Troubleshooting

### Database Connection Issues
- Verify SQL Server is running
- Check Windows authentication settings
- Ensure database permissions are correct
- Review firewall settings

### SMS Not Working
- Verify Twilio credentials
- Check phone number format (+91XXXXXXXXXX)
- Ensure account has sufficient balance
- Test with verified numbers first

### Payment Issues
- Confirm Razorpay API keys
- Check webhook configurations
- Verify callback URLs
- Test in sandbox mode first

### Common Errors
- **Port 5000 in use**: Change port in package.json
- **Database connection timeout**: Check SQL Server configuration
- **CORS errors**: Configure frontend proxy in vite.config.ts

## 📞 Support

For technical support or questions:
- Email: support@coastalconnect.in
- Phone: +91 820 252 0001
- Location: Coastal Karnataka, India

## 🔒 Security

This application implements:
- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention
- CORS protection
- Input validation and sanitization
- Secure payment processing

## 📄 License

This project is proprietary software for coastal Karnataka tourism.

---

**coastalConnect** - Your gateway to authentic coastal Karnataka experiences! 🏖️🏠🚗
