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
import analyticsRoutes from './routes/analytics.js';

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
app.use('/api/analytics', analyticsRoutes);

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

app.get('/api/drivers', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Driver data will be served by dynamic services'
  });
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
