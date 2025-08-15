import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes that have proper default exports
import adminRoutes from './routes/admin.js';
import bookingApiRoutes from './routes/bookingApi.js';
import couponsRoutes from './routes/coupons.js';
import dynamicServicesRoutes from './routes/dynamicServices.js';
import professionalBookingsRoutes from './routes/professionalBookings.js';
import searchRoutes from './routes/search.js';
import seedingRoutes from './routes/seeding.js';
import statsRoutes from './routes/stats.js';
import subscriptionRoutes from './routes/subscription.js';
import vendorsRoutes from './routes/vendors.js';
// import analyticsRoutes from './routes/analytics.js'; // Temporarily disabled

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Routes - only use routes with proper default exports
app.use('/api/admin', adminRoutes);
app.use('/api/booking', bookingApiRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/services', dynamicServicesRoutes);
app.use('/api/professional-bookings', professionalBookingsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/seeding', seedingRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/vendors', vendorsRoutes);
// app.use('/api/analytics', analyticsRoutes); // Temporarily disabled

// Basic API endpoints for missing functionality
app.get('/api/homestays', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Homestays data will be served by dynamic services'
  });
});

app.get('/api/restaurants', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Restaurant data will be served by dynamic services'
  });
});

// Drivers endpoint with fallback data
app.get('/api/drivers', async (req, res) => {
  try {
    // Fallback drivers data when database is not available
    const mockDrivers = [
      {
        id: 1,
        name: "Suresh Kumar",
        phone: "+91 94488 12345",
        email: "suresh.driver@gmail.com",
        location: "Udupi City",
        vehicle_type: "Sedan (Maruti Dzire)",
        vehicle_number: "KA 20 A 1234",
        license_number: "DL-2020123456789",
        rating: 4.8,
        total_reviews: 156,
        hourly_rate: 300,
        experience_years: 8,
        languages: "Kannada, Hindi, English, Tulu",
        is_available: true,
        is_active: true
      },
      {
        id: 2,
        name: "Ramesh Bhat",
        phone: "+91 98456 78901",
        email: "ramesh.bhat.driver@yahoo.com",
        location: "Manipal-Udupi",
        vehicle_type: "SUV (Mahindra Scorpio)",
        vehicle_number: "KA 20 B 5678",
        license_number: "DL-2019987654321",
        rating: 4.9,
        total_reviews: 203,
        hourly_rate: 450,
        experience_years: 12,
        languages: "Kannada, English, Tulu, Konkani",
        is_available: true,
        is_active: true
      },
      {
        id: 3,
        name: "Prakash Shetty",
        phone: "+91 95916 54321",
        location: "Malpe-Kaup Route",
        vehicle_type: "Hatchback (Maruti Swift)",
        vehicle_number: "KA 20 C 9012",
        license_number: "DL-2021456789123",
        rating: 4.6,
        total_reviews: 89,
        hourly_rate: 250,
        experience_years: 5,
        languages: "Kannada, Hindi, Tulu",
        is_available: true,
        is_active: true
      },
      {
        id: 4,
        name: "Ganesh Acharya",
        phone: "+91 97411 98765",
        email: "ganesh.taxi@gmail.com",
        location: "Udupi-Mangalore Route",
        vehicle_type: "Sedan (Honda City)",
        vehicle_number: "KA 20 D 3456",
        license_number: "DL-2018654321987",
        rating: 4.7,
        total_reviews: 334,
        hourly_rate: 350,
        experience_years: 15,
        languages: "Kannada, English, Hindi, Tulu, Konkani",
        is_available: true,
        is_active: true
      },
      {
        id: 5,
        name: "Vijay Pai",
        phone: "+91 98862 13579",
        location: "Tourist Circuit Guide",
        vehicle_type: "Tempo Traveller (12 Seater)",
        vehicle_number: "KA 20 E 7890",
        license_number: "DL-2017321654987",
        rating: 4.8,
        total_reviews: 124,
        hourly_rate: 800,
        experience_years: 10,
        languages: "Kannada, English, Hindi, Tulu",
        is_available: true,
        is_active: true
      }
    ];

    res.json({
      success: true,
      data: mockDrivers,
      count: mockDrivers.length,
      source: 'fallback'
    });
  } catch (error) {
    console.error('Error in drivers endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch drivers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/events', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Event data will be served by dynamic services'
  });
});

// Serve client build files (in production)
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  
  app.use(express.static(clientBuildPath));

  // Handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } else {
    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  }
});

// Graceful shutdown handling
const shutdown = (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown due to timeout');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 CoastalConnect Server Started Successfully!

📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server URL: http://localhost:${PORT}
🕒 Started at: ${new Date().toISOString()}

⚡ Ready to serve requests!
  `);
});

// Export createServer function for vite.config.ts
export function createServer() {
  return app;
}

// Export for testing
export default app;
