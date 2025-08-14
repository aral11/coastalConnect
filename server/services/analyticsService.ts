/**
 * Analytics Service for CoastalConnect
 * Provides real-time analytics tracking, reporting, and dashboard data
 * Supports both Supabase and SQL Server backends
 */

import { getDatabaseService } from './databaseService.js';
import { getDataService } from './dataService.js';

// Analytics Event Types
export type AnalyticsEventType = 
  | 'page_view'
  | 'search'
  | 'service_view'
  | 'service_click'
  | 'booking_start'
  | 'booking_complete'
  | 'booking_abandon'
  | 'payment_start'
  | 'payment_success'
  | 'payment_failed'
  | 'user_register'
  | 'user_login'
  | 'vendor_register'
  | 'event_view'
  | 'event_register'
  | 'contact_submit'
  | 'feedback_submit'
  | 'error_occurred'
  | 'feature_used';

// Analytics Event Interface
export interface AnalyticsEvent {
  id?: string;
  event_type: AnalyticsEventType;
  event_name?: string;
  user_id?: string;
  session_id: string;
  properties?: Record<string, any>;
  page_url?: string;
  page_title?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  created_at?: string;
}

// Analytics Summary Interfaces
export interface AnalyticsSummary {
  totalEvents: number;
  uniqueUsers: number;
  uniqueSessions: number;
  pageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number }>;
  topEvents: Array<{ event: string; count: number }>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
}

export interface ConversionFunnel {
  stage: string;
  users: number;
  dropoffRate: number;
  conversionRate: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  averageOrderValue: number;
  revenueByService: Array<{ service_type: string; revenue: number }>;
  revenueByLocation: Array<{ location: string; revenue: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  revenueGrowth: number;
}

export interface UserBehaviorAnalytics {
  averageSessionDuration: number;
  averagePagesPerSession: number;
  newVsReturningUsers: { new: number; returning: number };
  userRetention: Array<{ period: string; retention: number }>;
  mostActiveHours: Array<{ hour: number; activity: number }>;
  userJourney: Array<{ step: string; users: number }>;
}

// Analytics Service Class
export class AnalyticsService {
  private db = getDatabaseService();
  private dataService = getDataService();

  // ==============================================
  // EVENT TRACKING
  // ==============================================

  async trackEvent(event: AnalyticsEvent): Promise<boolean> {
    try {
      // Enrich event data
      const enrichedEvent = {
        ...event,
        created_at: new Date().toISOString(),
        device_type: this.detectDeviceType(event.user_agent),
        browser: this.detectBrowser(event.user_agent),
        os: this.detectOS(event.user_agent)
      };

      const result = await this.db.insert('analytics_events', enrichedEvent);
      
      // Update real-time aggregations
      if (!result.error) {
        await this.updateRealTimeAggregations(enrichedEvent);
      }

      return !result.error;
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      return false;
    }
  }

  async trackPageView(data: {
    user_id?: string;
    session_id: string;
    page_url: string;
    page_title: string;
    referrer?: string;
    user_agent?: string;
    ip_address?: string;
  }): Promise<boolean> {
    return this.trackEvent({
      event_type: 'page_view',
      ...data
    });
  }

  async trackSearch(data: {
    user_id?: string;
    session_id: string;
    query: string;
    filters?: Record<string, any>;
    results_count: number;
    user_agent?: string;
    ip_address?: string;
  }): Promise<boolean> {
    return this.trackEvent({
      event_type: 'search',
      event_name: 'search_performed',
      properties: {
        query: data.query,
        filters: data.filters,
        results_count: data.results_count
      },
      user_id: data.user_id,
      session_id: data.session_id,
      user_agent: data.user_agent,
      ip_address: data.ip_address
    });
  }

  async trackBookingFunnel(data: {
    user_id?: string;
    session_id: string;
    service_id: string;
    stage: 'start' | 'details' | 'payment' | 'complete' | 'abandon';
    amount?: number;
    properties?: Record<string, any>;
  }): Promise<boolean> {
    const eventType = data.stage === 'complete' ? 'booking_complete' :
                     data.stage === 'abandon' ? 'booking_abandon' :
                     'booking_start';

    return this.trackEvent({
      event_type: eventType,
      event_name: `booking_${data.stage}`,
      user_id: data.user_id,
      session_id: data.session_id,
      properties: {
        service_id: data.service_id,
        stage: data.stage,
        amount: data.amount,
        ...data.properties
      }
    });
  }

  async trackPayment(data: {
    user_id?: string;
    session_id: string;
    booking_id: string;
    payment_id: string;
    amount: number;
    currency: string;
    status: 'start' | 'success' | 'failed';
    gateway: string;
    properties?: Record<string, any>;
  }): Promise<boolean> {
    const eventType = data.status === 'success' ? 'payment_success' :
                     data.status === 'failed' ? 'payment_failed' :
                     'payment_start';

    return this.trackEvent({
      event_type: eventType,
      event_name: `payment_${data.status}`,
      user_id: data.user_id,
      session_id: data.session_id,
      properties: {
        booking_id: data.booking_id,
        payment_id: data.payment_id,
        amount: data.amount,
        currency: data.currency,
        gateway: data.gateway,
        ...data.properties
      }
    });
  }

  // ==============================================
  // REAL-TIME AGGREGATIONS
  // ==============================================

  private async updateRealTimeAggregations(event: AnalyticsEvent): Promise<void> {
    try {
      // Update hourly aggregations
      const currentHour = new Date().toISOString().slice(0, 13) + ':00:00.000Z';
      
      if (this.db.getType() === 'supabase') {
        // Use Supabase real-time features
        await this.updateSupabaseAggregations(event, currentHour);
      } else {
        // Use SQL Server aggregations
        await this.updateSQLServerAggregations(event, currentHour);
      }
    } catch (error) {
      console.error('Error updating real-time aggregations:', error);
    }
  }

  private async updateSupabaseAggregations(event: AnalyticsEvent, hour: string): Promise<void> {
    // Upsert hourly stats
    const hourlyStats = {
      hour,
      event_type: event.event_type,
      event_count: 1,
      unique_users: event.user_id ? 1 : 0,
      unique_sessions: 1
    };

    await this.db.query(`
      INSERT INTO hourly_analytics (hour, event_type, event_count, unique_users, unique_sessions)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (hour, event_type)
      DO UPDATE SET
        event_count = hourly_analytics.event_count + $3,
        unique_users = hourly_analytics.unique_users + $4,
        unique_sessions = hourly_analytics.unique_sessions + $5,
        updated_at = NOW()
    `, [hour, event.event_type, 1, event.user_id ? 1 : 0, 1]);
  }

  private async updateSQLServerAggregations(event: AnalyticsEvent, hour: string): Promise<void> {
    // Use MERGE for upsert functionality
    await this.db.query(`
      MERGE hourly_analytics AS target
      USING (VALUES (?, ?, 1, ?, 1)) AS source (hour, event_type, event_count, unique_users, unique_sessions)
      ON target.hour = source.hour AND target.event_type = source.event_type
      WHEN MATCHED THEN
        UPDATE SET 
          event_count = target.event_count + source.event_count,
          unique_users = target.unique_users + source.unique_users,
          unique_sessions = target.unique_sessions + source.unique_sessions,
          updated_at = GETDATE()
      WHEN NOT MATCHED THEN
        INSERT (hour, event_type, event_count, unique_users, unique_sessions, created_at)
        VALUES (source.hour, source.event_type, source.event_count, source.unique_users, source.unique_sessions, GETDATE());
    `, [hour, event.event_type, event.user_id ? 1 : 0]);
  }

  // ==============================================
  // ANALYTICS REPORTING
  // ==============================================

  async getAnalyticsSummary(dateFrom: string, dateTo: string): Promise<AnalyticsSummary> {
    try {
      const sql = `
        SELECT 
          COUNT(*) as total_events,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(DISTINCT session_id) as unique_sessions,
          SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) as page_views
        FROM analytics_events 
        WHERE created_at >= @param1 AND created_at <= @param2
      `;

      const result = await this.db.query(sql, [dateFrom, dateTo]);
      const basicStats = result.data?.[0] || {};

      // Get top pages
      const topPagesResult = await this.db.query(`
        SELECT 
          page_url as page, 
          COUNT(*) as views 
        FROM analytics_events 
        WHERE event_type = 'page_view' 
          AND created_at >= @param1 AND created_at <= @param2
        GROUP BY page_url 
        ORDER BY views DESC 
        LIMIT 10
      `, [dateFrom, dateTo]);

      // Get top events
      const topEventsResult = await this.db.query(`
        SELECT 
          event_type as event, 
          COUNT(*) as count 
        FROM analytics_events 
        WHERE created_at >= @param1 AND created_at <= @param2
        GROUP BY event_type 
        ORDER BY count DESC 
        LIMIT 10
      `, [dateFrom, dateTo]);

      // Get device breakdown
      const deviceResult = await this.db.query(`
        SELECT 
          device_type, 
          COUNT(*) as count 
        FROM analytics_events 
        WHERE created_at >= @param1 AND created_at <= @param2
        GROUP BY device_type
      `, [dateFrom, dateTo]);

      return {
        totalEvents: parseInt(basicStats.total_events) || 0,
        uniqueUsers: parseInt(basicStats.unique_users) || 0,
        uniqueSessions: parseInt(basicStats.unique_sessions) || 0,
        pageViews: parseInt(basicStats.page_views) || 0,
        averageSessionDuration: await this.calculateAverageSessionDuration(dateFrom, dateTo),
        bounceRate: await this.calculateBounceRate(dateFrom, dateTo),
        conversionRate: await this.calculateConversionRate(dateFrom, dateTo),
        topPages: topPagesResult.data || [],
        topEvents: topEventsResult.data || [],
        deviceBreakdown: this.arrayToObject(deviceResult.data || [], 'device_type', 'count'),
        browserBreakdown: await this.getBrowserBreakdown(dateFrom, dateTo),
        locationBreakdown: await this.getLocationBreakdown(dateFrom, dateTo)
      };
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      throw error;
    }
  }

  async getConversionFunnel(dateFrom: string, dateTo: string): Promise<ConversionFunnel[]> {
    try {
      const funnelSteps = [
        { stage: 'Page Views', event_types: ['page_view'] },
        { stage: 'Service Views', event_types: ['service_view'] },
        { stage: 'Booking Started', event_types: ['booking_start'] },
        { stage: 'Payment Started', event_types: ['payment_start'] },
        { stage: 'Booking Completed', event_types: ['booking_complete'] }
      ];

      const funnel: ConversionFunnel[] = [];
      let previousUsers = 0;

      for (let i = 0; i < funnelSteps.length; i++) {
        const step = funnelSteps[i];
        const eventTypesStr = step.event_types.map(t => `'${t}'`).join(',');
        
        const result = await this.db.query(`
          SELECT COUNT(DISTINCT user_id) as users
          FROM analytics_events 
          WHERE event_type IN (${eventTypesStr})
            AND created_at >= @param1 AND created_at <= @param2
            AND user_id IS NOT NULL
        `, [dateFrom, dateTo]);

        const users = parseInt(result.data?.[0]?.users) || 0;
        const dropoffRate = i > 0 ? ((previousUsers - users) / previousUsers) * 100 : 0;
        const conversionRate = i === 0 ? 100 : (users / funnel[0].users) * 100;

        funnel.push({
          stage: step.stage,
          users,
          dropoffRate: Math.round(dropoffRate * 100) / 100,
          conversionRate: Math.round(conversionRate * 100) / 100
        });

        previousUsers = users;
      }

      return funnel;
    } catch (error) {
      console.error('Error getting conversion funnel:', error);
      throw error;
    }
  }

  async getRevenueAnalytics(dateFrom: string, dateTo: string): Promise<RevenueAnalytics> {
    try {
      // Get revenue data from bookings
      const revenueResult = await this.db.query(`
        SELECT 
          SUM(total_amount) as total_revenue,
          AVG(total_amount) as average_order_value,
          COUNT(*) as total_orders
        FROM bookings 
        WHERE status = 'completed' 
          AND created_at >= @param1 AND created_at <= @param2
      `, [dateFrom, dateTo]);

      const basicRevenue = revenueResult.data?.[0] || {};

      // Revenue by service type
      const revenueByServiceResult = await this.db.query(`
        SELECT 
          service_type,
          SUM(total_amount) as revenue
        FROM bookings 
        WHERE status = 'completed' 
          AND created_at >= @param1 AND created_at <= @param2
        GROUP BY service_type
        ORDER BY revenue DESC
      `, [dateFrom, dateTo]);

      // Monthly revenue trend
      const monthlyRevenueResult = await this.db.query(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          SUM(total_amount) as revenue
        FROM bookings 
        WHERE status = 'completed' 
          AND created_at >= @param1 AND created_at <= @param2
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month
      `, [dateFrom, dateTo]);

      return {
        totalRevenue: parseFloat(basicRevenue.total_revenue) || 0,
        averageOrderValue: parseFloat(basicRevenue.average_order_value) || 0,
        revenueByService: revenueByServiceResult.data || [],
        revenueByLocation: [], // To be implemented
        monthlyRevenue: monthlyRevenueResult.data || [],
        revenueGrowth: 0 // To be calculated
      };
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      throw error;
    }
  }

  async getUserBehaviorAnalytics(dateFrom: string, dateTo: string): Promise<UserBehaviorAnalytics> {
    try {
      const sessionDuration = await this.calculateAverageSessionDuration(dateFrom, dateTo);
      const pagesPerSession = await this.calculatePagesPerSession(dateFrom, dateTo);
      const newVsReturning = await this.calculateNewVsReturningUsers(dateFrom, dateTo);

      return {
        averageSessionDuration: sessionDuration,
        averagePagesPerSession: pagesPerSession,
        newVsReturningUsers: newVsReturning,
        userRetention: [], // To be implemented
        mostActiveHours: await this.getMostActiveHours(dateFrom, dateTo),
        userJourney: [] // To be implemented
      };
    } catch (error) {
      console.error('Error getting user behavior analytics:', error);
      throw error;
    }
  }

  // ==============================================
  // DASHBOARD WIDGETS
  // ==============================================

  async getDashboardData(timeframe: '24h' | '7d' | '30d' = '7d'): Promise<any> {
    const now = new Date();
    let dateFrom: Date;

    switch (timeframe) {
      case '24h':
        dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const fromStr = dateFrom.toISOString();
    const toStr = now.toISOString();

    return {
      summary: await this.getAnalyticsSummary(fromStr, toStr),
      funnel: await this.getConversionFunnel(fromStr, toStr),
      revenue: await this.getRevenueAnalytics(fromStr, toStr),
      behavior: await this.getUserBehaviorAnalytics(fromStr, toStr),
      realTime: await this.getRealTimeData()
    };
  }

  async getRealTimeData(): Promise<any> {
    try {
      const last15Minutes = new Date(Date.now() - 15 * 60 * 1000).toISOString();

      const result = await this.db.query(`
        SELECT 
          COUNT(*) as active_users,
          COUNT(DISTINCT session_id) as active_sessions,
          SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) as page_views
        FROM analytics_events 
        WHERE created_at >= @param1
      `, [last15Minutes]);

      return result.data?.[0] || { active_users: 0, active_sessions: 0, page_views: 0 };
    } catch (error) {
      console.error('Error getting real-time data:', error);
      return { active_users: 0, active_sessions: 0, page_views: 0 };
    }
  }

  // ==============================================
  // HELPER METHODS
  // ==============================================

  private detectDeviceType(userAgent?: string): 'desktop' | 'mobile' | 'tablet' {
    if (!userAgent) return 'desktop';
    
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const tablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    
    if (tablet) return 'tablet';
    if (mobile) return 'mobile';
    return 'desktop';
  }

  private detectBrowser(userAgent?: string): string {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'Other';
  }

  private detectOS(userAgent?: string): string {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    
    return 'Other';
  }

  private async calculateAverageSessionDuration(dateFrom: string, dateTo: string): Promise<number> {
    // Implementation for calculating average session duration
    return 0; // Placeholder
  }

  private async calculateBounceRate(dateFrom: string, dateTo: string): Promise<number> {
    // Implementation for calculating bounce rate
    return 0; // Placeholder
  }

  private async calculateConversionRate(dateFrom: string, dateTo: string): Promise<number> {
    // Implementation for calculating conversion rate
    return 0; // Placeholder
  }

  private async getBrowserBreakdown(dateFrom: string, dateTo: string): Promise<Record<string, number>> {
    // Implementation for browser breakdown
    return {}; // Placeholder
  }

  private async getLocationBreakdown(dateFrom: string, dateTo: string): Promise<Record<string, number>> {
    // Implementation for location breakdown
    return {}; // Placeholder
  }

  private async calculatePagesPerSession(dateFrom: string, dateTo: string): Promise<number> {
    // Implementation for calculating pages per session
    return 0; // Placeholder
  }

  private async calculateNewVsReturningUsers(dateFrom: string, dateTo: string): Promise<{ new: number; returning: number }> {
    // Implementation for new vs returning users
    return { new: 0, returning: 0 }; // Placeholder
  }

  private async getMostActiveHours(dateFrom: string, dateTo: string): Promise<Array<{ hour: number; activity: number }>> {
    // Implementation for most active hours
    return []; // Placeholder
  }

  private arrayToObject(array: any[], keyField: string, valueField: string): Record<string, number> {
    return array.reduce((obj, item) => {
      obj[item[keyField]] = parseInt(item[valueField]) || 0;
      return obj;
    }, {});
  }
}

// Singleton instance
let analyticsService: AnalyticsService | null = null;

export function getAnalyticsService(): AnalyticsService {
  if (!analyticsService) {
    analyticsService = new AnalyticsService();
  }
  return analyticsService;
}

export default AnalyticsService;
