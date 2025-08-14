/**
 * Performance Optimization Middleware for CoastalConnect
 * Implements compression, response time monitoring, query optimization, and caching
 */

import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { getCacheService } from '../services/cacheService.js';
import { getDatabaseService } from '../services/databaseService.js';

// Performance monitoring interface
interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  requestCount: number;
  errorCount: number;
  cacheHitRate: number;
}

// Request performance tracking
interface RequestPerformance {
  startTime: number;
  endTime?: number;
  duration?: number;
  path: string;
  method: string;
  statusCode?: number;
  userId?: string;
  cacheHit: boolean;
  dbQueries: number;
  memoryUsed: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    responseTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    requestCount: 0,
    errorCount: 0,
    cacheHitRate: 0
  };

  private requestHistory: RequestPerformance[] = [];
  private maxHistorySize = 1000;
  private slowRequestThreshold = 1000; // 1 second

  updateMetrics(request: RequestPerformance): void {
    this.metrics.requestCount++;
    
    if (request.duration) {
      this.metrics.responseTime = (this.metrics.responseTime + request.duration) / 2;
    }

    if (request.statusCode && request.statusCode >= 400) {
      this.metrics.errorCount++;
    }

    // Store request in history
    this.requestHistory.push(request);
    
    // Trim history if needed
    if (this.requestHistory.length > this.maxHistorySize) {
      this.requestHistory = this.requestHistory.slice(-this.maxHistorySize);
    }

    // Log slow requests
    if (request.duration && request.duration > this.slowRequestThreshold) {
      console.warn(`🐌 Slow request detected: ${request.method} ${request.path} - ${request.duration}ms`);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getSlowRequests(limit = 10): RequestPerformance[] {
    return this.requestHistory
      .filter(req => req.duration && req.duration > this.slowRequestThreshold)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, limit);
  }

  reset(): void {
    this.metrics = {
      responseTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      requestCount: 0,
      errorCount: 0,
      cacheHitRate: 0
    };
    this.requestHistory = [];
  }
}

const performanceMonitor = new PerformanceMonitor();

// ==============================================
// COMPRESSION MIDDLEWARE
// ==============================================

export const compressionMiddleware = compression({
  level: 6, // Compression level (1-9, 6 is good balance)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Compress everything else
    return compression.filter(req, res);
  }
});

// ==============================================
// RESPONSE TIME TRACKING
// ==============================================

export const responseTimeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;

  // Create performance tracking object
  const performance: RequestPerformance = {
    startTime,
    path: req.path,
    method: req.method,
    userId: (req as any).user?.id,
    cacheHit: false,
    dbQueries: 0,
    memoryUsed: 0
  };

  // Track database queries
  let queryCount = 0;
  const originalQuery = getDatabaseService().query;
  (getDatabaseService() as any).query = function(...args: any[]) {
    queryCount++;
    return originalQuery.apply(this, args);
  };

  // Override end method to capture metrics
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const endTime = Date.now();
    const endMemory = process.memoryUsage().heapUsed;

    performance.endTime = endTime;
    performance.duration = endTime - startTime;
    performance.statusCode = res.statusCode;
    performance.dbQueries = queryCount;
    performance.memoryUsed = endMemory - startMemory;
    performance.cacheHit = res.getHeader('X-Cache-Hit') === 'true';

    // Update performance metrics
    performanceMonitor.updateMetrics(performance);

    // Set response time header
    res.setHeader('X-Response-Time', `${performance.duration}ms`);
    res.setHeader('X-DB-Queries', queryCount.toString());

    // Restore original query method
    (getDatabaseService() as any).query = originalQuery;

    return originalEnd.call(this, chunk, encoding);
  };

  next();
};

// ==============================================
// CACHE HEADERS MIDDLEWARE
// ==============================================

export const cacheHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Set cache headers based on route
  const path = req.path;
  
  if (path.includes('/api/auth') || path.includes('/api/admin')) {
    // Don't cache authentication or admin routes
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  } else if (path.includes('/api/services') || path.includes('/api/events')) {
    // Cache service and event data for 5 minutes
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('ETag', generateETag(req.url));
  } else if (path.includes('/api/static') || path.includes('/uploads')) {
    // Cache static content for 1 hour
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('ETag', generateETag(req.url));
  } else {
    // Default cache for 1 minute
    res.setHeader('Cache-Control', 'public, max-age=60');
  }

  next();
};

// ==============================================
// SMART CACHING MIDDLEWARE
// ==============================================

export const smartCachingMiddleware = (cacheKey: string, ttl = 300, tags: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cache = getCacheService();
    const key = `${cacheKey}:${generateCacheKey(req)}`;

    try {
      // Try to get from cache
      const cachedData = await cache.get(key);
      
      if (cachedData) {
        res.setHeader('X-Cache-Hit', 'true');
        res.setHeader('X-Cache-Key', key);
        return res.json(cachedData);
      }

      // If not in cache, proceed to route handler
      res.setHeader('X-Cache-Hit', 'false');
      
      // Override json method to cache the response
      const originalJson = res.json;
      res.json = function(data: any) {
        // Cache the response data
        cache.set(key, data, ttl, tags).catch(err => {
          console.error('Cache set error:', err);
        });
        
        res.setHeader('X-Cache-Key', key);
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// ==============================================
// DATABASE QUERY OPTIMIZATION
// ==============================================

export const queryOptimizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Add query optimization hints to request
  (req as any).queryHints = {
    limit: Math.min(parseInt(req.query.limit as string) || 20, 100), // Max 100 items
    offset: Math.max(parseInt(req.query.offset as string) || 0, 0),
    fields: req.query.fields as string, // Specific fields to select
    sort: req.query.sort as string || 'created_at:desc'
  };

  next();
};

// ==============================================
// REQUEST SIZE LIMITING
// ==============================================

export const requestSizeLimiter = (maxSize = '10mb') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get('content-length');
    
    if (contentLength) {
      const sizeInBytes = parseInt(contentLength);
      const maxSizeInBytes = parseSize(maxSize);
      
      if (sizeInBytes > maxSizeInBytes) {
        return res.status(413).json({
          success: false,
          message: `Request too large. Maximum size allowed: ${maxSize}`
        });
      }
    }

    next();
  };
};

// ==============================================
// API RESPONSE OPTIMIZATION
// ==============================================

export const optimizeApiResponse = (req: Request, res: Response, next: NextFunction) => {
  // Override json method to optimize response
  const originalJson = res.json;
  
  res.json = function(data: any) {
    let optimizedData = data;

    // Remove null/undefined values to reduce payload size
    if (typeof data === 'object' && data !== null) {
      optimizedData = removeEmptyValues(data);
    }

    // Add pagination info if available
    if (Array.isArray(optimizedData) && req.query.limit) {
      const total = parseInt(res.getHeader('X-Total-Count') as string) || optimizedData.length;
      const limit = parseInt(req.query.limit as string);
      const offset = parseInt(req.query.offset as string) || 0;
      
      optimizedData = {
        data: optimizedData,
        pagination: {
          total,
          limit,
          offset,
          hasNext: offset + limit < total,
          hasPrev: offset > 0
        }
      };
    }

    return originalJson.call(this, optimizedData);
  };

  next();
};

// ==============================================
// CONDITIONAL REQUESTS (304 NOT MODIFIED)
// ==============================================

export const conditionalRequestsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ifNoneMatch = req.get('If-None-Match');
  const ifModifiedSince = req.get('If-Modified-Since');

  // Check ETag
  if (ifNoneMatch) {
    const currentETag = generateETag(req.url);
    if (ifNoneMatch === currentETag) {
      return res.status(304).end();
    }
  }

  // Check Last-Modified
  if (ifModifiedSince) {
    const modifiedSince = new Date(ifModifiedSince);
    const lastModified = getLastModified(req.path);
    
    if (lastModified && lastModified <= modifiedSince) {
      return res.status(304).end();
    }
  }

  next();
};

// ==============================================
// PERFORMANCE MONITORING ENDPOINTS
// ==============================================

export const performanceStatsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/performance/stats') {
    const stats = {
      performance: performanceMonitor.getMetrics(),
      cache: getCacheService().getStats(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      slowRequests: performanceMonitor.getSlowRequests(5)
    };

    return res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

// ==============================================
// DATABASE CONNECTION POOLING OPTIMIZATION
// ==============================================

export const optimizeDatabaseQueries = (req: Request, res: Response, next: NextFunction) => {
  // Add database optimization context
  (req as any).dbContext = {
    readPreference: 'secondary', // Use read replicas for read operations
    maxTimeMS: 5000, // 5 second timeout
    batchSize: 100, // Batch operations
    enableProfiling: process.env.NODE_ENV === 'development'
  };

  next();
};

// ==============================================
// STATIC ASSET OPTIMIZATION
// ==============================================

export const staticAssetOptimization = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;

  // Optimize static assets
  if (path.includes('/uploads') || path.includes('/assets')) {
    // Set aggressive caching for static assets
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
    res.setHeader('Vary', 'Accept-Encoding');
    
    // Add CORS headers for assets
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }

  next();
};

// ==============================================
// HELPER FUNCTIONS
// ==============================================

function generateCacheKey(req: Request): string {
  const queryString = JSON.stringify(req.query);
  const userId = (req as any).user?.id || 'anonymous';
  return Buffer.from(`${req.path}:${queryString}:${userId}`).toString('base64').slice(0, 32);
}

function generateETag(url: string): string {
  return `"${Buffer.from(url + Date.now()).toString('base64').slice(0, 16)}"`;
}

function getLastModified(path: string): Date | null {
  // This would typically check file modification time or database update time
  // For now, return null to disable Last-Modified checking
  return null;
}

function parseSize(size: string): number {
  const units: { [key: string]: number } = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };

  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2] || 'b';
  
  return value * units[unit];
}

function removeEmptyValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeEmptyValues).filter(v => v != null);
  } else if (typeof obj === 'object' && obj !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value != null && value !== '') {
        cleaned[key] = removeEmptyValues(value);
      }
    }
    return cleaned;
  }
  return obj;
}

// ==============================================
// PERFORMANCE BUDGET ENFORCEMENT
// ==============================================

export const performanceBudgetMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Override end method to check performance budget
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const responseTime = Date.now() - startTime;
    
    // Performance budget: 200ms for API calls
    if (responseTime > 200) {
      console.warn(`⚠️ Performance budget exceeded: ${req.method} ${req.path} - ${responseTime}ms`);
      
      // In development, add warning header
      if (process.env.NODE_ENV === 'development') {
        res.setHeader('X-Performance-Warning', `Response time ${responseTime}ms exceeds 200ms budget`);
      }
    }

    return originalEnd.call(this, chunk, encoding);
  };

  next();
};

export default {
  compressionMiddleware,
  responseTimeMiddleware,
  cacheHeadersMiddleware,
  smartCachingMiddleware,
  queryOptimizationMiddleware,
  requestSizeLimiter,
  optimizeApiResponse,
  conditionalRequestsMiddleware,
  performanceStatsMiddleware,
  optimizeDatabaseQueries,
  staticAssetOptimization,
  performanceBudgetMiddleware,
  performanceMonitor
};
