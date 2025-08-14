import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import security middleware
import {
  validateEnvironmentVariables,
  securityHeaders,
  generalRateLimit,
  corsConfig,
  enforceHTTPS,
  secureErrorHandler,
  securityLogger
} from './middleware/security.js';

// Import routes
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import adminApprovalsRoutes from './routes/adminApprovals.js';
import businessRoutes from './routes/business.js';
import communityRoutes from './routes/community.js';
import realDataRoutes from './routes/realData.js';
import homestayRoutes from './routes/homestays.js';
import eateryRoutes from './routes/eateries.js';
import driverRoutes from './routes/drivers.js';
import eventRoutes from './routes/events.js';
import eventOrganizerRoutes from './routes/eventOrganizers.js';
import organizerEventsRoutes from './routes/organizerEvents.js';
import feedbackRoutes from './routes/feedback.js';
import commonRoutes from './routes/common.js';
import uploadRoutes from './routes/upload.js';
import paymentRoutes from './routes/payments.js';
import instagramRoutes from './routes/instagram.js';
import servicesRoutes from './routes/services.js';
import couponRoutes from './routes/coupons.js';
import contactRoutes from './routes/contact.js';
import supportRoutes from './routes/support.js';
import bookingApiRoutes from './routes/bookingApi.js';

// Load environment variables
dotenv.config();

// Validate environment variables before starting
try {
  validateEnvironmentVariables();
  console.log('✅ Environment variables validated successfully');
} catch (error) {
  console.error('❌ Environment validation failed:', error.message);
  console.error('Please check your .env file and ensure all required variables are set');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Security middleware (order matters!)
app.use(enforceHTTPS); // Enforce HTTPS in production
app.use(securityHeaders); // Security headers
app.use(securityLogger); // Log security-relevant requests

// CORS with enhanced security
app.use(cors(corsConfig));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
app.use('/api/', generalRateLimit);

// Static file serving with security
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '1d',
  etag: true,
  setHeaders: (res, path) => {
    // Security headers for static files
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Cache-Control': 'public, max-age=86400'
    });
    
    // Only allow certain file types
    const ext = path.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
    
    if (ext && !allowedExtensions.includes(ext)) {
      res.status(403).send('File type not allowed');
      return;
    }
  }
}));

// Health check endpoint (before rate limiting)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes with enhanced security
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/approvals', adminApprovalsRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/real', realDataRoutes);
app.use('/api/homestays', homestayRoutes);
app.use('/api/eateries', eateryRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/event-organizers', eventOrganizerRoutes);
app.use('/api/organizer-events', organizerEventsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/common', commonRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/booking', bookingApiRoutes);

// Serve client build files (in production)
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  
  app.use(express.static(clientBuildPath, {
    maxAge: '1y',
    etag: true,
    setHeaders: (res, path) => {
      // Security headers for client files
      res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      });
      
      // Cache static assets
      if (path.includes('static/')) {
        res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
      } else {
        res.set('Cache-Control', 'public, max-age=86400'); // 1 day
      }
    }
  }));

  // Handle client-side routing
  app.get('*', (req, res) => {
    // Security check for path traversal
    if (req.path.includes('..') || req.path.includes('//')) {
      return res.status(400).send('Invalid path');
    }
    
    res.sendFile(path.join(clientBuildPath, 'index.html'), {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Cache-Control': 'no-cache'
      }
    });
  });
}

// Security middleware for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler (must be last)
app.use(secureErrorHandler);

// Graceful shutdown handling
const shutdown = (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  const server = app.listen(PORT);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    // Close database connections, cleanup resources here
    
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
🔒 Security: Enhanced protection enabled
📊 Health Check: http://localhost:${PORT}/health
🕒 Started at: ${new Date().toISOString()}

🔐 Security Features Enabled:
  ✅ HTTPS Enforcement (production)
  ✅ Security Headers (Helmet)
  ✅ Rate Limiting
  ✅ CORS Protection
  ✅ Input Validation
  ✅ Environment Variable Validation
  ✅ Secure Error Handling
  ✅ Request Logging

⚡ Ready to serve secure requests!
  `);
});

// Export for testing
export default app;
