/**
 * Comprehensive Security Middleware for CoastalConnect
 * Implements security hardening measures including rate limiting, validation, and protection
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult, query, param } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Enhanced JWT Secret Management
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long');
  }
  return secret;
};

// Enhanced Admin Secret Management
const getAdminSecret = (): string => {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SECRET_KEY must be set and at least 32 characters long');
  }
  return secret;
};

// Environment Variables Validation
export const validateEnvironmentVariables = () => {
  const requiredVars = [
    'JWT_SECRET',
    'ADMIN_SECRET_KEY',
    'DB_PASSWORD',
    'RAZORPAY_KEY_SECRET',
    'STRIPE_SECRET_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  if (process.env.ADMIN_SECRET_KEY && process.env.ADMIN_SECRET_KEY.length < 32) {
    throw new Error('ADMIN_SECRET_KEY must be at least 32 characters long');
  }
};

// Helmet Configuration for Security Headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for some React functionality
        "https://checkout.razorpay.com",
        "https://js.stripe.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      connectSrc: [
        "'self'",
        "https://api.razorpay.com",
        "https://api.stripe.com",
        ...(process.env.NODE_ENV === 'development' ? ["http://localhost:*", "ws://localhost:*"] : [])
      ],
      frameSrc: [
        "https://checkout.razorpay.com",
        "https://js.stripe.com"
      ]
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for payment gateways
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate Limiting Configuration
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  skipSuccessfulRequests: true,
});

export const paymentRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 payment requests per minute
  message: {
    error: 'Too many payment requests, please try again later.',
    retryAfter: 60 * 1000
  },
});

export const uploadRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 upload requests per minute
  message: {
    error: 'Too many upload requests, please try again later.',
    retryAfter: 60 * 1000
  },
});

// Password Strength Validation
export const strongPasswordValidation = () => [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Input Validation Middleware
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }))
    });
  }
  next();
};

// Enhanced JWT Authentication
export const enhancedJWTAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, getJWTSecret()) as any;
    
    // Check token expiration (additional validation)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    // Optional: Validate IP binding (if implemented)
    if (decoded.ip && req.ip !== decoded.ip) {
      return res.status(401).json({
        success: false,
        message: 'Token IP mismatch'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Role-Based Access Control
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Enhanced Admin Authentication
export const enhancedAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const providedKey = req.header('x-admin-key') || req.body.adminKey;
  
  if (!providedKey) {
    return res.status(401).json({
      success: false,
      message: 'Admin key required'
    });
  }

  // Use timing-safe comparison to prevent timing attacks
  const adminKey = getAdminSecret();
  const isValid = crypto.timingSafeEqual(
    Buffer.from(providedKey),
    Buffer.from(adminKey)
  );

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin key'
    });
  }

  next();
};

// SQL Injection Prevention Helpers
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove potential SQL injection patterns
  return input
    .replace(/['";\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, '') // Remove block comment end
    .trim();
};

export const validateSQLParameters = (params: any[]): boolean => {
  return params.every(param => {
    if (typeof param === 'string') {
      // Check for common SQL injection patterns
      const dangerousPatterns = [
        /('|(\\)|;|--|\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b)/i
      ];
      return !dangerousPatterns.some(pattern => pattern.test(param));
    }
    return true;
  });
};

// File Upload Security
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file && !req.files) {
    return next();
  }

  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFileSizeImage = 5 * 1024 * 1024; // 5MB for images

  const files = req.files ? (Array.isArray(req.files) ? req.files : [req.file]) : [req.file];

  for (const file of files) {
    if (!file) continue;

    // Check file type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `File type ${file.mimetype} not allowed`
      });
    }

    // Check file size
    const sizeLimit = file.mimetype.startsWith('image/') ? maxFileSizeImage : maxFileSize;
    if (file.size > sizeLimit) {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size: ${sizeLimit / (1024 * 1024)}MB`
      });
    }

    // Check filename for security
    if (/[<>:"/\\|?*]/.test(file.originalname)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename characters'
      });
    }
  }

  next();
};

// CORS Configuration
export const corsConfig = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://coastalconnect.in',
      'https://www.coastalconnect.in'
    ];

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-admin-key',
    'x-api-key',
    'X-Requested-With'
  ],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400 // 24 hours
};

// HTTPS Enforcement
export const enforceHTTPS = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.get('host')}${req.url}`);
  }
  next();
};

// Error Handler (no information leakage)
export const secureErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the full error for debugging
  console.error('Error:', err);

  // Return generic error message in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } else {
    // In development, provide more details
    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  }
};

// Webhook Signature Verification
export const verifyWebhookSignature = (secret: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['x-razorpay-signature'] || req.headers['stripe-signature'];
    
    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing webhook signature'
      });
    }

    try {
      // For Razorpay
      if (req.headers['x-razorpay-signature']) {
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(req.body))
          .digest('hex');
        
        if (!crypto.timingSafeEqual(Buffer.from(signature as string), Buffer.from(expectedSignature))) {
          throw new Error('Invalid signature');
        }
      }
      
      // For Stripe
      if (req.headers['stripe-signature']) {
        // Stripe signature verification would go here
        // This is a simplified version
        const elements = (signature as string).split(',');
        const timestamp = elements.find(el => el.startsWith('t='))?.substring(2);
        const sig = elements.find(el => el.startsWith('v1='))?.substring(3);
        
        if (!timestamp || !sig) {
          throw new Error('Invalid signature format');
        }
      }

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }
  };
};

// Request Logging (security events)
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const securityEvents = [
    '/api/auth',
    '/api/admin',
    '/api/payment',
    '/api/upload'
  ];

  const shouldLog = securityEvents.some(path => req.path.startsWith(path));

  if (shouldLog) {
    console.log(`[SECURITY] ${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
  }

  next();
};

// Common validation schemas
export const commonValidations = {
  email: body('email').isEmail().normalizeEmail(),
  phone: body('phone').matches(/^\+?[\d\s\-\(\)]{10,15}$/).withMessage('Invalid phone number'),
  name: body('name').isLength({ min: 2, max: 100 }).trim().escape(),
  id: param('id').isUUID().withMessage('Invalid ID format'),
  amount: body('amount').isNumeric().isFloat({ min: 0.01 }).withMessage('Invalid amount'),
  date: body('date').isISO8601().withMessage('Invalid date format'),
};

export default {
  validateEnvironmentVariables,
  securityHeaders,
  generalRateLimit,
  authRateLimit,
  paymentRateLimit,
  uploadRateLimit,
  strongPasswordValidation,
  validateInput,
  enhancedJWTAuth,
  requireRole,
  enhancedAdminAuth,
  sanitizeInput,
  validateSQLParameters,
  validateFileUpload,
  corsConfig,
  enforceHTTPS,
  secureErrorHandler,
  verifyWebhookSignature,
  securityLogger,
  commonValidations
};
