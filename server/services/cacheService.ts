/**
 * Caching Service for CoastalConnect
 * Implements multi-layer caching strategy for optimal performance
 * Supports both in-memory and Redis caching with intelligent invalidation
 */

import { createClient } from 'redis';

// Cache Configuration
interface CacheConfig {
  enableMemoryCache: boolean;
  enableRedisCache: boolean;
  defaultTTL: number;
  maxMemoryItems: number;
  redisUrl?: string;
}

// Cache Item Interface
interface CacheItem<T = any> {
  data: T;
  expires: number;
  tags: string[];
  hitCount: number;
  createdAt: number;
}

// Cache Key Patterns
export enum CacheKeys {
  SERVICES = 'services',
  SERVICE_DETAIL = 'service:detail',
  EVENTS = 'events',
  EVENT_DETAIL = 'event:detail',
  USERS = 'users',
  USER_PROFILE = 'user:profile',
  BOOKINGS = 'bookings',
  REVIEWS = 'reviews',
  LOCATIONS = 'locations',
  CATEGORIES = 'categories',
  SEARCH_RESULTS = 'search',
  ANALYTICS = 'analytics',
  CONFIG = 'config'
}

// Cache Tags for Invalidation
export enum CacheTags {
  SERVICES = 'services',
  EVENTS = 'events',
  USERS = 'users',
  BOOKINGS = 'bookings',
  REVIEWS = 'reviews',
  STATIC_DATA = 'static',
  USER_DATA = 'user_data'
}

class CacheService {
  private memoryCache = new Map<string, CacheItem>();
  private redisClient: any = null;
  private config: CacheConfig;
  private statsCache = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0
  };

  constructor(config: CacheConfig) {
    this.config = config;
    this.initializeRedis();
    this.startCleanupInterval();
  }

  private async initializeRedis(): Promise<void> {
    if (!this.config.enableRedisCache || !this.config.redisUrl) {
      console.log('Redis caching disabled');
      return;
    }

    try {
      this.redisClient = createClient({
        url: this.config.redisUrl,
        retry_delay_on_failure: 100,
        retry_max_delay: 1000
      });

      this.redisClient.on('error', (err: Error) => {
        console.error('Redis connection error:', err);
        this.redisClient = null;
      });

      this.redisClient.on('connect', () => {
        console.log('✅ Redis cache connected');
      });

      await this.redisClient.connect();
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      this.redisClient = null;
    }
  }

  private startCleanupInterval(): void {
    // Clean up expired items every 5 minutes
    setInterval(() => {
      this.cleanupMemoryCache();
    }, 5 * 60 * 1000);
  }

  private cleanupMemoryCache(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.memoryCache.entries()) {
      if (item.expires < now) {
        this.memoryCache.delete(key);
        cleaned++;
      }
    }

    // If memory cache is too large, remove least recently used items
    if (this.memoryCache.size > this.config.maxMemoryItems) {
      const sortedByHits = Array.from(this.memoryCache.entries())
        .sort((a, b) => a[1].hitCount - b[1].hitCount);

      const toRemove = this.memoryCache.size - this.config.maxMemoryItems;
      for (let i = 0; i < toRemove; i++) {
        this.memoryCache.delete(sortedByHits[i][0]);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
    }
  }

  // ==============================================
  // CORE CACHE OPERATIONS
  // ==============================================

  async get<T>(key: string): Promise<T | null> {
    try {
      // Try memory cache first
      if (this.config.enableMemoryCache) {
        const memoryItem = this.memoryCache.get(key);
        if (memoryItem && memoryItem.expires > Date.now()) {
          memoryItem.hitCount++;
          this.statsCache.hits++;
          return memoryItem.data as T;
        }
      }

      // Try Redis cache
      if (this.redisClient) {
        const redisData = await this.redisClient.get(key);
        if (redisData) {
          const parsed = JSON.parse(redisData);
          
          // Store in memory cache for faster access
          if (this.config.enableMemoryCache) {
            this.memoryCache.set(key, {
              data: parsed.data,
              expires: parsed.expires,
              tags: parsed.tags || [],
              hitCount: 1,
              createdAt: Date.now()
            });
          }

          this.statsCache.hits++;
          return parsed.data as T;
        }
      }

      this.statsCache.misses++;
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      this.statsCache.misses++;
      return null;
    }
  }

  async set<T>(
    key: string, 
    data: T, 
    ttl: number = this.config.defaultTTL,
    tags: string[] = []
  ): Promise<boolean> {
    try {
      const expires = Date.now() + (ttl * 1000);
      const cacheItem: CacheItem<T> = {
        data,
        expires,
        tags,
        hitCount: 0,
        createdAt: Date.now()
      };

      // Set in memory cache
      if (this.config.enableMemoryCache) {
        this.memoryCache.set(key, cacheItem);
      }

      // Set in Redis cache
      if (this.redisClient) {
        const redisData = JSON.stringify({
          data,
          expires,
          tags
        });
        
        await this.redisClient.setEx(key, ttl, redisData);
      }

      this.statsCache.sets++;
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      // Delete from memory cache
      if (this.config.enableMemoryCache) {
        this.memoryCache.delete(key);
      }

      // Delete from Redis cache
      if (this.redisClient) {
        await this.redisClient.del(key);
      }

      this.statsCache.deletes++;
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      // Clear memory cache
      if (this.config.enableMemoryCache) {
        this.memoryCache.clear();
      }

      // Clear Redis cache
      if (this.redisClient) {
        await this.redisClient.flushAll();
      }

      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  // ==============================================
  // SPECIALIZED CACHE METHODS
  // ==============================================

  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl: number = this.config.defaultTTL,
    tags: string[] = []
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, fetch the data
      const data = await fetchFunction();
      
      // Store in cache
      await this.set(key, data, ttl, tags);
      
      return data;
    } catch (error) {
      console.error('Cache getOrSet error:', error);
      // If caching fails, still return the fetched data
      return await fetchFunction();
    }
  }

  async invalidateByTags(tags: string[]): Promise<number> {
    let invalidated = 0;

    try {
      // Invalidate from memory cache
      if (this.config.enableMemoryCache) {
        for (const [key, item] of this.memoryCache.entries()) {
          if (tags.some(tag => item.tags.includes(tag))) {
            this.memoryCache.delete(key);
            invalidated++;
          }
        }
      }

      // For Redis, we would need to store tag mappings separately
      // This is a simplified implementation
      if (this.redisClient) {
        for (const tag of tags) {
          const pattern = `*:${tag}:*`;
          const keys = await this.redisClient.keys(pattern);
          if (keys.length > 0) {
            await this.redisClient.del(keys);
            invalidated += keys.length;
          }
        }
      }

      console.log(`🗑️ Invalidated ${invalidated} cache entries for tags: ${tags.join(', ')}`);
      return invalidated;
    } catch (error) {
      console.error('Cache invalidation error:', error);
      return 0;
    }
  }

  async invalidateByPattern(pattern: string): Promise<number> {
    let invalidated = 0;

    try {
      // Invalidate from memory cache
      if (this.config.enableMemoryCache) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        for (const key of this.memoryCache.keys()) {
          if (regex.test(key)) {
            this.memoryCache.delete(key);
            invalidated++;
          }
        }
      }

      // Invalidate from Redis cache
      if (this.redisClient) {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
          await this.redisClient.del(keys);
          invalidated += keys.length;
        }
      }

      console.log(`🗑️ Invalidated ${invalidated} cache entries matching pattern: ${pattern}`);
      return invalidated;
    } catch (error) {
      console.error('Cache pattern invalidation error:', error);
      return 0;
    }
  }

  // ==============================================
  // BUSINESS-SPECIFIC CACHE METHODS
  // ==============================================

  async cacheServices(services: any[], ttl: number = 300): Promise<boolean> {
    const key = `${CacheKeys.SERVICES}:all`;
    return this.set(key, services, ttl, [CacheTags.SERVICES, CacheTags.STATIC_DATA]);
  }

  async getCachedServices(): Promise<any[] | null> {
    const key = `${CacheKeys.SERVICES}:all`;
    return this.get(key);
  }

  async cacheServiceDetail(serviceId: string, service: any, ttl: number = 600): Promise<boolean> {
    const key = `${CacheKeys.SERVICE_DETAIL}:${serviceId}`;
    return this.set(key, service, ttl, [CacheTags.SERVICES]);
  }

  async getCachedServiceDetail(serviceId: string): Promise<any | null> {
    const key = `${CacheKeys.SERVICE_DETAIL}:${serviceId}`;
    return this.get(key);
  }

  async cacheSearchResults(query: string, filters: any, results: any[], ttl: number = 180): Promise<boolean> {
    const queryHash = this.generateQueryHash(query, filters);
    const key = `${CacheKeys.SEARCH_RESULTS}:${queryHash}`;
    return this.set(key, results, ttl, [CacheTags.SERVICES]);
  }

  async getCachedSearchResults(query: string, filters: any): Promise<any[] | null> {
    const queryHash = this.generateQueryHash(query, filters);
    const key = `${CacheKeys.SEARCH_RESULTS}:${queryHash}`;
    return this.get(key);
  }

  async cacheUserProfile(userId: string, profile: any, ttl: number = 900): Promise<boolean> {
    const key = `${CacheKeys.USER_PROFILE}:${userId}`;
    return this.set(key, profile, ttl, [CacheTags.USERS, CacheTags.USER_DATA]);
  }

  async getCachedUserProfile(userId: string): Promise<any | null> {
    const key = `${CacheKeys.USER_PROFILE}:${userId}`;
    return this.get(key);
  }

  async cacheAnalytics(type: string, dateRange: string, data: any, ttl: number = 3600): Promise<boolean> {
    const key = `${CacheKeys.ANALYTICS}:${type}:${dateRange}`;
    return this.set(key, data, ttl, [CacheKeys.ANALYTICS]);
  }

  async getCachedAnalytics(type: string, dateRange: string): Promise<any | null> {
    const key = `${CacheKeys.ANALYTICS}:${type}:${dateRange}`;
    return this.get(key);
  }

  // ==============================================
  // CACHE INVALIDATION TRIGGERS
  // ==============================================

  async invalidateServicesCache(): Promise<void> {
    await this.invalidateByTags([CacheTags.SERVICES]);
    await this.invalidateByPattern(`${CacheKeys.SEARCH_RESULTS}:*`);
  }

  async invalidateUserCache(userId?: string): Promise<void> {
    if (userId) {
      await this.delete(`${CacheKeys.USER_PROFILE}:${userId}`);
    } else {
      await this.invalidateByTags([CacheTags.USERS]);
    }
  }

  async invalidateBookingCache(): Promise<void> {
    await this.invalidateByTags([CacheTags.BOOKINGS]);
  }

  async invalidateStaticDataCache(): Promise<void> {
    await this.invalidateByTags([CacheTags.STATIC_DATA]);
  }

  // ==============================================
  // CACHE STATISTICS & MONITORING
  // ==============================================

  getStats(): any {
    return {
      memory: {
        size: this.memoryCache.size,
        maxSize: this.config.maxMemoryItems,
        usage: `${Math.round((this.memoryCache.size / this.config.maxMemoryItems) * 100)}%`
      },
      redis: {
        connected: !!this.redisClient,
        status: this.redisClient ? 'connected' : 'disconnected'
      },
      performance: {
        hits: this.statsCache.hits,
        misses: this.statsCache.misses,
        hitRate: this.statsCache.hits + this.statsCache.misses > 0 
          ? `${Math.round((this.statsCache.hits / (this.statsCache.hits + this.statsCache.misses)) * 100)}%`
          : '0%',
        sets: this.statsCache.sets,
        deletes: this.statsCache.deletes
      }
    };
  }

  async warmUpCache(): Promise<void> {
    console.log('🔥 Starting cache warm-up...');

    try {
      // Warm up common data that doesn't change frequently
      // This would be called during application startup
      
      // You would implement specific warm-up logic here
      // For example: pre-load popular services, categories, locations, etc.
      
      console.log('✅ Cache warm-up completed');
    } catch (error) {
      console.error('❌ Cache warm-up failed:', error);
    }
  }

  // ==============================================
  // HELPER METHODS
  // ==============================================

  private generateQueryHash(query: string, filters: any): string {
    const queryString = JSON.stringify({ query, filters });
    return Buffer.from(queryString).toString('base64').slice(0, 32);
  }

  async healthCheck(): Promise<{ status: string; details: any }> {
    const stats = this.getStats();
    const isHealthy = this.config.enableMemoryCache || (this.config.enableRedisCache && !!this.redisClient);

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      details: {
        memoryCache: this.config.enableMemoryCache ? 'enabled' : 'disabled',
        redisCache: this.config.enableRedisCache ? 
          (this.redisClient ? 'connected' : 'disconnected') : 'disabled',
        stats
      }
    };
  }

  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down cache service...');
    
    if (this.redisClient) {
      await this.redisClient.quit();
    }
    
    this.memoryCache.clear();
    console.log('✅ Cache service shutdown complete');
  }
}

// Cache Configuration Factory
const createCacheConfig = (): CacheConfig => ({
  enableMemoryCache: true,
  enableRedisCache: !!process.env.REDIS_URL,
  defaultTTL: parseInt(process.env.CACHE_TTL || '300'), // 5 minutes default
  maxMemoryItems: parseInt(process.env.CACHE_MAX_ITEMS || '1000'),
  redisUrl: process.env.REDIS_URL
});

// Singleton instance
let cacheService: CacheService | null = null;

export function getCacheService(): CacheService {
  if (!cacheService) {
    const config = createCacheConfig();
    cacheService = new CacheService(config);
  }
  return cacheService;
}

export { CacheService, CacheKeys, CacheTags };
export default CacheService;
