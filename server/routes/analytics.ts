/**
 * Analytics API Routes for CoastalConnect
 * Provides endpoints for tracking events and retrieving analytics data
 */

import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getAnalyticsService } from '../services/analyticsService.js';
import { enhancedJWTAuth, requireRole, validateInput, authRateLimit } from '../middleware/security.js';

const router = express.Router();
const analyticsService = getAnalyticsService();

// ==============================================
// EVENT TRACKING ENDPOINTS
// ==============================================

/**
 * Track a single analytics event
 * POST /api/analytics/track
 */
router.post('/track', [
  body('event_type').isIn([
    'page_view', 'search', 'service_view', 'service_click', 'booking_start',
    'booking_complete', 'booking_abandon', 'payment_start', 'payment_success',
    'payment_failed', 'user_register', 'user_login', 'vendor_register',
    'event_view', 'event_register', 'contact_submit', 'feedback_submit',
    'error_occurred', 'feature_used'
  ]).withMessage('Invalid event type'),
  body('session_id').notEmpty().withMessage('Session ID is required'),
  body('user_id').optional().isUUID().withMessage('Invalid user ID format'),
  body('properties').optional().isObject().withMessage('Properties must be an object'),
  validateInput
], async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    };

    const success = await analyticsService.trackEvent(eventData);

    if (success) {
      res.json({
        success: true,
        message: 'Event tracked successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to track event'
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Track page view
 * POST /api/analytics/page-view
 */
router.post('/page-view', [
  body('session_id').notEmpty().withMessage('Session ID is required'),
  body('page_url').isURL().withMessage('Valid page URL is required'),
  body('page_title').notEmpty().withMessage('Page title is required'),
  body('user_id').optional().isUUID().withMessage('Invalid user ID format'),
  validateInput
], async (req, res) => {
  try {
    const success = await analyticsService.trackPageView({
      ...req.body,
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      referrer: req.get('Referer')
    });

    res.json({
      success,
      message: success ? 'Page view tracked' : 'Failed to track page view'
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Track search event
 * POST /api/analytics/search
 */
router.post('/search', [
  body('session_id').notEmpty().withMessage('Session ID is required'),
  body('query').notEmpty().withMessage('Search query is required'),
  body('results_count').isInt({ min: 0 }).withMessage('Results count must be a non-negative integer'),
  body('filters').optional().isObject().withMessage('Filters must be an object'),
  validateInput
], async (req, res) => {
  try {
    const success = await analyticsService.trackSearch({
      ...req.body,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success,
      message: success ? 'Search tracked' : 'Failed to track search'
    });
  } catch (error) {
    console.error('Error tracking search:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Track booking funnel step
 * POST /api/analytics/booking-funnel
 */
router.post('/booking-funnel', [
  body('session_id').notEmpty().withMessage('Session ID is required'),
  body('service_id').isUUID().withMessage('Valid service ID is required'),
  body('stage').isIn(['start', 'details', 'payment', 'complete', 'abandon']).withMessage('Invalid stage'),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  validateInput
], async (req, res) => {
  try {
    const success = await analyticsService.trackBookingFunnel(req.body);

    res.json({
      success,
      message: success ? 'Booking funnel step tracked' : 'Failed to track booking funnel'
    });
  } catch (error) {
    console.error('Error tracking booking funnel:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Track payment event
 * POST /api/analytics/payment
 */
router.post('/payment', [
  body('session_id').notEmpty().withMessage('Session ID is required'),
  body('booking_id').isUUID().withMessage('Valid booking ID is required'),
  body('payment_id').notEmpty().withMessage('Payment ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('currency').isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('status').isIn(['start', 'success', 'failed']).withMessage('Invalid payment status'),
  body('gateway').notEmpty().withMessage('Payment gateway is required'),
  validateInput
], async (req, res) => {
  try {
    const success = await analyticsService.trackPayment(req.body);

    res.json({
      success,
      message: success ? 'Payment event tracked' : 'Failed to track payment'
    });
  } catch (error) {
    console.error('Error tracking payment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// ==============================================
// ANALYTICS REPORTING ENDPOINTS (ADMIN ONLY)
// ==============================================

/**
 * Get analytics summary
 * GET /api/analytics/summary?from=2024-01-01&to=2024-01-31
 */
router.get('/summary', [
  enhancedJWTAuth,
  requireRole(['admin']),
  query('from').isISO8601().withMessage('Valid from date is required'),
  query('to').isISO8601().withMessage('Valid to date is required'),
  validateInput
], async (req, res) => {
  try {
    const { from, to } = req.query;
    const summary = await analyticsService.getAnalyticsSummary(from as string, to as string);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics summary'
    });
  }
});

/**
 * Get conversion funnel data
 * GET /api/analytics/funnel?from=2024-01-01&to=2024-01-31
 */
router.get('/funnel', [
  enhancedJWTAuth,
  requireRole(['admin']),
  query('from').isISO8601().withMessage('Valid from date is required'),
  query('to').isISO8601().withMessage('Valid to date is required'),
  validateInput
], async (req, res) => {
  try {
    const { from, to } = req.query;
    const funnel = await analyticsService.getConversionFunnel(from as string, to as string);

    res.json({
      success: true,
      data: funnel
    });
  } catch (error) {
    console.error('Error getting conversion funnel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversion funnel'
    });
  }
});

/**
 * Get revenue analytics
 * GET /api/analytics/revenue?from=2024-01-01&to=2024-01-31
 */
router.get('/revenue', [
  enhancedJWTAuth,
  requireRole(['admin']),
  query('from').isISO8601().withMessage('Valid from date is required'),
  query('to').isISO8601().withMessage('Valid to date is required'),
  validateInput
], async (req, res) => {
  try {
    const { from, to } = req.query;
    const revenue = await analyticsService.getRevenueAnalytics(from as string, to as string);

    res.json({
      success: true,
      data: revenue
    });
  } catch (error) {
    console.error('Error getting revenue analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get revenue analytics'
    });
  }
});

/**
 * Get user behavior analytics
 * GET /api/analytics/behavior?from=2024-01-01&to=2024-01-31
 */
router.get('/behavior', [
  enhancedJWTAuth,
  requireRole(['admin']),
  query('from').isISO8601().withMessage('Valid from date is required'),
  query('to').isISO8601().withMessage('Valid to date is required'),
  validateInput
], async (req, res) => {
  try {
    const { from, to } = req.query;
    const behavior = await analyticsService.getUserBehaviorAnalytics(from as string, to as string);

    res.json({
      success: true,
      data: behavior
    });
  } catch (error) {
    console.error('Error getting user behavior analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user behavior analytics'
    });
  }
});

/**
 * Get dashboard data with multiple timeframes
 * GET /api/analytics/dashboard?timeframe=7d
 */
router.get('/dashboard', [
  enhancedJWTAuth,
  requireRole(['admin']),
  query('timeframe').optional().isIn(['24h', '7d', '30d']).withMessage('Invalid timeframe'),
  validateInput
], async (req, res) => {
  try {
    const timeframe = (req.query.timeframe as '24h' | '7d' | '30d') || '7d';
    const dashboardData = await analyticsService.getDashboardData(timeframe);

    res.json({
      success: true,
      data: dashboardData,
      timeframe
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data'
    });
  }
});

/**
 * Get real-time analytics data
 * GET /api/analytics/real-time
 */
router.get('/real-time', [
  enhancedJWTAuth,
  requireRole(['admin'])
], async (req, res) => {
  try {
    const realTimeData = await analyticsService.getRealTimeData();

    res.json({
      success: true,
      data: realTimeData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting real-time data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get real-time data'
    });
  }
});

// ==============================================
// BATCH OPERATIONS
// ==============================================

/**
 * Track multiple events in batch
 * POST /api/analytics/batch
 */
router.post('/batch', [
  authRateLimit,
  body('events').isArray({ min: 1, max: 100 }).withMessage('Events must be an array of 1-100 items'),
  body('events.*.event_type').isIn([
    'page_view', 'search', 'service_view', 'service_click', 'booking_start',
    'booking_complete', 'booking_abandon', 'payment_start', 'payment_success',
    'payment_failed', 'user_register', 'user_login', 'vendor_register',
    'event_view', 'event_register', 'contact_submit', 'feedback_submit',
    'error_occurred', 'feature_used'
  ]).withMessage('Invalid event type'),
  body('events.*.session_id').notEmpty().withMessage('Session ID is required for all events'),
  validateInput
], async (req, res) => {
  try {
    const { events } = req.body;
    const results = [];

    for (const event of events) {
      const eventData = {
        ...event,
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      };

      const success = await analyticsService.trackEvent(eventData);
      results.push({ event_type: event.event_type, success });
    }

    const successCount = results.filter(r => r.success).length;
    
    res.json({
      success: true,
      message: `${successCount}/${events.length} events tracked successfully`,
      results
    });
  } catch (error) {
    console.error('Error tracking batch events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track batch events'
    });
  }
});

// ==============================================
// ANALYTICS CONFIGURATION
// ==============================================

/**
 * Get analytics configuration
 * GET /api/analytics/config
 */
router.get('/config', [
  enhancedJWTAuth,
  requireRole(['admin'])
], async (req, res) => {
  try {
    const config = {
      trackingEnabled: true,
      realTimeEnabled: true,
      retentionDays: 365,
      supportedEvents: [
        'page_view', 'search', 'service_view', 'service_click', 'booking_start',
        'booking_complete', 'booking_abandon', 'payment_start', 'payment_success',
        'payment_failed', 'user_register', 'user_login', 'vendor_register',
        'event_view', 'event_register', 'contact_submit', 'feedback_submit',
        'error_occurred', 'feature_used'
      ],
      sampleRate: 100, // Percentage of events to track
      privacyMode: false
    };

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error getting analytics config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics configuration'
    });
  }
});

// ==============================================
// EXPORT FUNCTIONALITY
// ==============================================

/**
 * Export analytics data as CSV
 * GET /api/analytics/export?from=2024-01-01&to=2024-01-31&format=csv
 */
router.get('/export', [
  enhancedJWTAuth,
  requireRole(['admin']),
  query('from').isISO8601().withMessage('Valid from date is required'),
  query('to').isISO8601().withMessage('Valid to date is required'),
  query('format').optional().isIn(['csv', 'json']).withMessage('Format must be csv or json'),
  validateInput
], async (req, res) => {
  try {
    const { from, to, format = 'csv' } = req.query;
    
    // Get analytics data
    const summary = await analyticsService.getAnalyticsSummary(from as string, to as string);
    
    if (format === 'csv') {
      // Convert to CSV format
      let csv = 'Metric,Value\n';
      csv += `Total Events,${summary.totalEvents}\n`;
      csv += `Unique Users,${summary.uniqueUsers}\n`;
      csv += `Unique Sessions,${summary.uniqueSessions}\n`;
      csv += `Page Views,${summary.pageViews}\n`;
      csv += `Average Session Duration,${summary.averageSessionDuration}\n`;
      csv += `Bounce Rate,${summary.bounceRate}%\n`;
      csv += `Conversion Rate,${summary.conversionRate}%\n`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${from}-to-${to}.csv"`);
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${from}-to-${to}.json"`);
      res.json({
        dateRange: { from, to },
        exportedAt: new Date().toISOString(),
        data: summary
      });
    }
  } catch (error) {
    console.error('Error exporting analytics data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics data'
    });
  }
});

export default router;
